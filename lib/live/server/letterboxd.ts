import type { LetterboxdData, LetterboxdFilm, LiveEnvelope } from "../types";
import { envelope, failed, fetchText, safeUrl, USER_AGENT } from "./http";

const REVALIDATE_S = 3600;
const FILMS_SHOWN = 6;
const USERNAME_PATTERN = /^[A-Za-z0-9_]{1,40}$/;

const ENTITIES: Record<string, string> = { "&amp;": "&", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&lt;": "<", "&gt;": ">" };

function decode(value: string): string {
  return value.replace(/&(amp|quot|#39|apos|lt|gt);/g, (m) => ENTITIES[m] ?? m);
}

/** Legge il contenuto di un tag RSS, CDATA compreso. Il feed è semplice e stabile: niente parser XML. */
function tag(item: string, name: string): string | null {
  const match = item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  if (!match) return null;
  const raw = match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
  return raw.length > 0 ? decode(raw) : null;
}

function toFilm(item: string): LetterboxdFilm | null {
  const title = tag(item, "letterboxd:filmTitle");
  if (!title) return null;
  const rating = Number.parseFloat(tag(item, "letterboxd:memberRating") ?? "");
  const poster = tag(item, "description")?.match(/<img src="([^"]+)"/)?.[1];
  return {
    title,
    year: tag(item, "letterboxd:filmYear"),
    rating: Number.isFinite(rating) ? rating : null,
    liked: tag(item, "letterboxd:memberLike") === "Yes",
    watchedDate: tag(item, "letterboxd:watchedDate"),
    posterUrl: safeUrl(poster, "ltrbxd.com"),
    url: safeUrl(tag(item, "link"), "letterboxd.com"),
  };
}

export async function getLetterboxd(): Promise<LiveEnvelope<LetterboxdData>> {
  const username = process.env.LETTERBOXD_USERNAME?.trim();
  if (!username || !USERNAME_PATTERN.test(username)) return envelope<LetterboxdData>(false, null);

  try {
    const xml = await fetchText("letterboxd", `https://letterboxd.com/${username}/rss/`, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: REVALIDATE_S },
    });
    const films = xml
      .split("<item>")
      .slice(1)
      .map((chunk) => toFilm(chunk.split("</item>")[0]))
      .filter((f): f is LetterboxdFilm => f !== null)
      .slice(0, FILMS_SHOWN);
    return envelope(true, { profileUrl: `https://letterboxd.com/${username}/`, films });
  } catch (error) {
    return failed("letterboxd", error);
  }
}
