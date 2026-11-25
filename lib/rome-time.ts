/** L'ora di Savigliano (Europe/Rome), indipendente dal fuso di chi visita il sito. */

const FORMATTER = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
});

export interface ClockTime {
  h: number;
  m: number;
  s: number;
}

export function romeTime(date: Date = new Date()): ClockTime {
  const parts = FORMATTER.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { h: get("hour") % 24, m: get("minute"), s: get("second") };
}

export function formatClock({ h, m }: ClockTime): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const RELATIVE = new Intl.RelativeTimeFormat("it", { numeric: "auto" });

/** "2 ore fa", "ieri", "3 giorni fa": per commit, ascolti e partite. */
export function relativeTime(iso: string): string {
  const diffS = (Date.parse(iso) - Date.now()) / 1000;
  const abs = Math.abs(diffS);
  if (abs < 3600) return RELATIVE.format(Math.round(diffS / 60), "minute");
  if (abs < 86400) return RELATIVE.format(Math.round(diffS / 3600), "hour");
  if (abs < 86400 * 30) return RELATIVE.format(Math.round(diffS / 86400), "day");
  return RELATIVE.format(Math.round(diffS / (86400 * 30)), "month");
}
