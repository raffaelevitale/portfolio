/**
 * Forma normalizzata dei dati live. Il server traduce le risposte dei servizi esterni
 * in questi tipi: il client non vede mai i formati originali né le chiavi.
 */

export interface LiveEnvelope<T> {
  /** false se mancano le variabili d'ambiente del servizio. */
  configured: boolean;
  data: T | null;
  error?: "unavailable" | "network";
  fetchedAt: string;
}

export interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  coverUrl: string | null;
  url: string | null;
  isPlaying: boolean;
  playedAt: string | null;
}

export interface SpotifyAlbum {
  name: string;
  artist: string;
  coverUrl: string | null;
  url: string | null;
}

export interface SpotifyData {
  track: SpotifyTrack | null;
  topAlbums: SpotifyAlbum[];
}

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  pushedAt: string;
  stars: number;
  lastCommit: { message: string; url: string; date: string } | null;
}

export interface GithubData {
  username: string;
  profileUrl: string;
  publicRepos: number | null;
  totalContributions: number | null;
  /** Ultime 53 settimane, 7 giorni ciascuna: numero di contributi al giorno. */
  weeks: number[][] | null;
  repos: GithubRepo[];
}

export interface SteamGame {
  appId: number;
  name: string;
  hoursRecent: number | null;
  hoursTotal: number;
  imageUrl: string;
  storeUrl: string;
}

export interface SteamData {
  profileUrl: string | null;
  /** Nome del gioco aperto in questo momento, se c'è. */
  nowPlaying: string | null;
  games: SteamGame[];
  /** true se la lista è dei giochi più giocati di sempre (nessuna partita recente). */
  allTime: boolean;
}

export interface LetterboxdFilm {
  title: string;
  year: string | null;
  rating: number | null;
  liked: boolean;
  watchedDate: string | null;
  posterUrl: string | null;
  url: string | null;
}

export interface LetterboxdData {
  profileUrl: string;
  films: LetterboxdFilm[];
}

export interface LiveDataMap {
  spotify: SpotifyData;
  github: GithubData;
  steam: SteamData;
  letterboxd: LetterboxdData;
}

export type LiveKind = keyof LiveDataMap;

export const LIVE_KINDS: readonly LiveKind[] = ["spotify", "github", "steam", "letterboxd"];

export function isLiveKind(value: string): value is LiveKind {
  return (LIVE_KINDS as readonly string[]).includes(value);
}
