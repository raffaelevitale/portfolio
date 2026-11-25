import type { LiveEnvelope, SpotifyAlbum, SpotifyData, SpotifyTrack } from "../types";
import { arr, envelope, failed, fetchJson, obj, safeUrl, str, UpstreamError } from "./http";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";
const TOKEN_MARGIN_MS = 30_000;
const TOP_ALBUMS = 8;

let cachedToken: { value: string; expiresAt: number } | null = null;

interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

function config(): SpotifyConfig | null {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim();
  return clientId && clientSecret && refreshToken ? { clientId, clientSecret, refreshToken } : null;
}

async function accessToken(cfg: SpotifyConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + TOKEN_MARGIN_MS) {
    return cachedToken.value;
  }
  const basic = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64");
  const json = obj(
    await fetchJson("spotify", TOKEN_URL, {
      method: "POST",
      headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: cfg.refreshToken }),
      cache: "no-store",
    }),
  );
  const value = str(json.access_token);
  if (!value) {
    throw new Error("Spotify non ha restituito un access token");
  }
  const seconds = typeof json.expires_in === "number" ? json.expires_in : 3600;
  cachedToken = { value, expiresAt: Date.now() + seconds * 1000 };
  return value;
}

function toTrack(item: unknown, isPlaying: boolean, playedAt: string | null): SpotifyTrack | null {
  const t = obj(item);
  const title = str(t.name);
  if (!title) return null;
  const album = obj(t.album);
  const artists = arr(t.artists)
    .map((a) => str(obj(a).name))
    .filter((a): a is string => a !== null);
  return {
    title,
    artist: artists.join(", ") || "Artista sconosciuto",
    album: str(album.name) ?? "",
    coverUrl: safeUrl(obj(arr(album.images)[0]).url, "scdn.co"),
    url: safeUrl(obj(t.external_urls).spotify, "open.spotify.com"),
    isPlaying,
    playedAt,
  };
}

async function api(path: string, token: string): Promise<Response> {
  return fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
}

async function currentTrack(token: string): Promise<SpotifyTrack | null> {
  const res = await api("/me/player/currently-playing", token);
  if (res.status === 200) {
    const json = obj(await res.json());
    const track = toTrack(json.item, json.is_playing === true, null);
    if (track) return track;
  } else if (res.status !== 204) {
    throw new UpstreamError("spotify", res.status);
  }
  const recent = await api("/me/player/recently-played?limit=1", token);
  if (!recent.ok) throw new UpstreamError("spotify", recent.status);
  const first = obj(arr(obj(await recent.json()).items)[0]);
  return toTrack(first.track, false, str(first.played_at));
}

async function topAlbums(token: string): Promise<SpotifyAlbum[]> {
  const res = await api("/me/top/tracks?limit=40&time_range=short_term", token);
  if (!res.ok) throw new UpstreamError("spotify", res.status);
  const seen = new Set<string>();
  const albums: SpotifyAlbum[] = [];
  for (const item of arr(obj(await res.json()).items)) {
    const album = obj(obj(item).album);
    const id = str(album.id);
    const name = str(album.name);
    if (!id || !name || seen.has(id)) continue;
    seen.add(id);
    albums.push({
      name,
      artist: str(obj(arr(album.artists)[0]).name) ?? "",
      coverUrl: safeUrl(obj(arr(album.images)[0]).url, "scdn.co"),
      url: safeUrl(obj(album.external_urls).spotify, "open.spotify.com"),
    });
    if (albums.length >= TOP_ALBUMS) break;
  }
  return albums;
}

export async function getSpotify(): Promise<LiveEnvelope<SpotifyData>> {
  const cfg = config();
  if (!cfg) return envelope<SpotifyData>(false, null);
  try {
    const token = await accessToken(cfg);
    const [track, albums] = await Promise.all([currentTrack(token), topAlbums(token)]);
    return envelope(true, { track, topAlbums: albums });
  } catch (error) {
    cachedToken = null;
    return failed("spotify", error);
  }
}
