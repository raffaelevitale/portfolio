import type { LiveEnvelope } from "../types";

const TIMEOUT_MS = 6000;

/** User-Agent generico: nessun dato personale verso i servizi esterni. */
export const USER_AGENT = "portfolio-live/1.0";

export class UpstreamError extends Error {
  constructor(
    readonly service: string,
    readonly status: number,
  ) {
    super(`${service} ha risposto ${status}`);
  }
}

interface FetchOptions extends RequestInit {
  next?: { revalidate?: number };
}

export async function fetchJson(service: string, url: string, init: FetchOptions = {}): Promise<unknown> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) {
    throw new UpstreamError(service, res.status);
  }
  return res.json();
}

export async function fetchText(service: string, url: string, init: FetchOptions = {}): Promise<string> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) {
    throw new UpstreamError(service, res.status);
  }
  return res.text();
}

/* Lettura difensiva di JSON esterno: mai fidarsi della forma delle risposte. */

export function obj(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function arr(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function str(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Accetta solo URL https verso l'host atteso. */
export function safeUrl(value: unknown, host: string): string | null {
  const s = str(value);
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === "https:" && (u.hostname === host || u.hostname.endsWith(`.${host}`)) ? u.toString() : null;
  } catch {
    return null;
  }
}

export function envelope<T>(configured: boolean, data: T | null, error?: LiveEnvelope<T>["error"]): LiveEnvelope<T> {
  return { configured, data, error, fetchedAt: new Date().toISOString() };
}

/** Registra l'errore lato server e restituisce una risposta pulita al client. */
export function failed<T>(service: string, error: unknown): LiveEnvelope<T> {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`[live:${service}] ${detail}`);
  return envelope<T>(true, null, "unavailable");
}
