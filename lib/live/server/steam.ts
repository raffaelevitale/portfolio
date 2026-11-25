import type { LiveEnvelope, SteamData, SteamGame } from "../types";
import { arr, envelope, failed, fetchJson, num, obj, safeUrl, str } from "./http";

const API = "https://api.steampowered.com";
const REVALIDATE_S = 300;
const GAMES_SHOWN = 4;
const STEAM_ID_PATTERN = /^\d{17}$/;

function hours(minutes: number | null): number | null {
  return minutes === null ? null : Math.round((minutes / 60) * 10) / 10;
}

function toGame(raw: unknown): SteamGame | null {
  const g = obj(raw);
  const appId = num(g.appid);
  const name = str(g.name);
  if (appId === null || !name) return null;
  return {
    appId,
    name,
    hoursRecent: hours(num(g.playtime_2weeks)),
    hoursTotal: hours(num(g.playtime_forever)) ?? 0,
    imageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`,
    storeUrl: `https://store.steampowered.com/app/${appId}`,
  };
}

export async function getSteam(): Promise<LiveEnvelope<SteamData>> {
  const key = process.env.STEAM_API_KEY?.trim();
  const steamId = process.env.STEAM_ID?.trim();
  if (!key || !steamId || !STEAM_ID_PATTERN.test(steamId)) return envelope<SteamData>(false, null);

  const query = (path: string, extra = "") =>
    fetchJson("steam", `${API}${path}?key=${encodeURIComponent(key)}&steamids=${steamId}&steamid=${steamId}${extra}&format=json`, {
      next: { revalidate: REVALIDATE_S },
    });

  try {
    const [summary, recent] = await Promise.all([
      query("/ISteamUser/GetPlayerSummaries/v2/"),
      query("/IPlayerService/GetRecentlyPlayedGames/v1/", `&count=${GAMES_SHOWN}`),
    ]);
    const player = obj(arr(obj(obj(summary).response).players)[0]);
    let games = arr(obj(obj(recent).response).games)
      .map(toGame)
      .filter((g): g is SteamGame => g !== null);

    // Nessuna partita nelle ultime due settimane: mostriamo i più giocati di sempre.
    const allTime = games.length === 0;
    if (allTime) {
      const owned = await query("/IPlayerService/GetOwnedGames/v1/", "&include_appinfo=1");
      games = arr(obj(obj(owned).response).games)
        .map(toGame)
        .filter((g): g is SteamGame => g !== null)
        .sort((a, b) => b.hoursTotal - a.hoursTotal)
        .slice(0, GAMES_SHOWN);
    }

    return envelope(true, {
      profileUrl: safeUrl(player.profileurl, "steamcommunity.com"),
      nowPlaying: str(player.gameextrainfo),
      games,
      allTime,
    });
  } catch (error) {
    return failed("steam", error);
  }
}
