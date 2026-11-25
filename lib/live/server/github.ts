import type { GithubData, GithubRepo, LiveEnvelope } from "../types";
import { arr, envelope, failed, fetchJson, num, obj, safeUrl, str, USER_AGENT } from "./http";

const API = "https://api.github.com";
const REVALIDATE_S = 3600;
const REPOS_SHOWN = 4;
const COMMITS_FOR = 3;
const USERNAME_PATTERN = /^[A-Za-z0-9-]{1,39}$/;

const CONTRIBUTIONS_QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount } }
      }
    }
  }
}`;

function headers(token: string | undefined): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function contributions(username: string, token: string): Promise<{ total: number; weeks: number[][] }> {
  const json = obj(
    await fetchJson("github", `${API}/graphql`, {
      method: "POST",
      headers: { ...headers(token), "Content-Type": "application/json" },
      body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { login: username } }),
      cache: "no-store",
    }),
  );
  const calendar = obj(obj(obj(obj(json.data).user).contributionsCollection).contributionCalendar);
  const weeks = arr(calendar.weeks).map((w) => arr(obj(w).contributionDays).map((d) => num(obj(d).contributionCount) ?? 0));
  return { total: num(calendar.totalContributions) ?? 0, weeks };
}

async function lastCommit(fullName: string, token: string | undefined): Promise<GithubRepo["lastCommit"]> {
  const list = arr(
    await fetchJson("github", `${API}/repos/${fullName}/commits?per_page=1`, {
      headers: headers(token),
      next: { revalidate: REVALIDATE_S },
    }),
  );
  const first = obj(list[0]);
  const commit = obj(first.commit);
  const message = str(commit.message)?.split("\n")[0];
  const url = safeUrl(first.html_url, "github.com");
  const date = str(obj(commit.author).date);
  return message && url && date ? { message, url, date } : null;
}

export async function getGithub(): Promise<LiveEnvelope<GithubData>> {
  const username = process.env.GITHUB_USERNAME?.trim() || "raffaelevitale";
  if (!USERNAME_PATTERN.test(username)) return envelope<GithubData>(false, null);
  const token = process.env.GITHUB_TOKEN?.trim() || undefined;

  try {
    const [user, reposRaw] = await Promise.all([
      fetchJson("github", `${API}/users/${username}`, { headers: headers(token), next: { revalidate: REVALIDATE_S } }),
      fetchJson("github", `${API}/users/${username}/repos?sort=pushed&per_page=12&type=owner`, {
        headers: headers(token),
        next: { revalidate: REVALIDATE_S },
      }),
    ]);

    const repos = arr(reposRaw)
      .map(obj)
      .filter((r) => r.fork !== true && r.private !== true)
      .slice(0, REPOS_SHOWN);

    const withCommits = await Promise.all(
      repos.map(async (r, i): Promise<GithubRepo | null> => {
        const name = str(r.name);
        const fullName = str(r.full_name);
        const url = safeUrl(r.html_url, "github.com");
        const pushedAt = str(r.pushed_at);
        if (!name || !fullName || !url || !pushedAt) return null;
        const commit = i < COMMITS_FOR ? await lastCommit(fullName, token).catch(() => null) : null;
        return {
          name,
          description: str(r.description),
          language: str(r.language),
          url,
          pushedAt,
          stars: num(r.stargazers_count) ?? 0,
          lastCommit: commit,
        };
      }),
    );

    // Il calendario dei contributi richiede un token (anche senza permessi).
    const calendar = token ? await contributions(username, token).catch(() => null) : null;

    return envelope(true, {
      username,
      profileUrl: `https://github.com/${username}`,
      publicRepos: num(obj(user).public_repos),
      totalContributions: calendar?.total ?? null,
      weeks: calendar?.weeks ?? null,
      repos: withCommits.filter((r): r is GithubRepo => r !== null),
    });
  } catch (error) {
    return failed("github", error);
  }
}
