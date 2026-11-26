import type { GithubData, GithubRepo } from "@/lib/live/types";
import { relativeTime } from "@/lib/rome-time";
import { type Draw, fonts, grain, seeded, text } from "../textures";

/* ───────────────────────── scrivania e giradischi: schermi e carta ───────────────────────── */

export type LiveStatus = "loading" | "ok" | "off";

const EDITOR = {
  bg: "#14171c",
  side: "#101317",
  bar: "#0c0e12",
  line: "#232831",
  ink: "#c9d1d9",
  muted: "#6e7781",
  accent: "#e6a15c",
} as const;

/** Colori dei "token" del codice finto: da lontano si legge come codice, senza testo inventato. */
const TOKENS = ["#d2a8ff", "#79c0ff", "#ffa657", "#a5d6ff", "#7ee787", "#c9d1d9", "#8b949e"] as const;

function clip(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function hashOf(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return h >>> 0;
}

function fileFor(repo: GithubRepo | undefined): string {
  switch (repo?.language) {
    case "TypeScript": return "page.tsx";
    case "JavaScript": return "index.js";
    case "Python": return "main.py";
    case "PHP": return "index.php";
    case "Swift": return "App.swift";
    case "CSS": return "styles.css";
    default: return "README.md";
  }
}

function drawSidebar(ctx: CanvasRenderingContext2D, repos: readonly GithubRepo[], h: number) {
  const f = fonts();
  ctx.fillStyle = EDITOR.bar;
  ctx.fillRect(0, 0, 44, h);
  ctx.fillStyle = EDITOR.side;
  ctx.fillRect(44, 0, 236, h);
  [0, 1, 2].forEach((i) => {
    ctx.fillStyle = i === 0 ? EDITOR.ink : "#3a414b";
    ctx.fillRect(13, 64 + i * 46, 18, 18);
  });
  ctx.fillStyle = EDITOR.muted;
  text.setFont(ctx, 400, 15, f.mono, 2);
  ctx.fillText("REPOSITORY", 62, 64);
  repos.slice(0, 7).forEach((repo, i) => {
    const y = 104 + i * 38;
    if (i === 0) {
      ctx.fillStyle = "#1f2530";
      ctx.fillRect(44, y - 24, 236, 36);
    }
    ctx.fillStyle = i === 0 ? EDITOR.accent : "#4d5560";
    ctx.fillRect(62, y - 12, 10, 10);
    ctx.fillStyle = i === 0 ? EDITOR.ink : "#9aa3ad";
    text.setFont(ctx, 400, 18, f.mono);
    ctx.fillText(clip(repo.name, 20), 84, y);
  });
}

function drawFakeCode(ctx: CanvasRenderingContext2D, seed: number, x: number, y: number, w: number, rows: number) {
  const f = fonts();
  const rand = seeded(seed);
  let indent = 0;
  for (let r = 0; r < rows; r++) {
    const ly = y + r * 30;
    ctx.fillStyle = "#3d444d";
    ctx.textAlign = "right";
    text.setFont(ctx, 400, 15, f.mono);
    ctx.fillText(String(r + 1), x + 28, ly + 12);
    ctx.textAlign = "left";
    if (rand() < 0.12) {
      indent = Math.max(0, indent - 1);
      continue;
    }
    let cx = x + 48 + indent * 28;
    const tokens = 2 + Math.floor(rand() * 5);
    for (let t = 0; t < tokens && cx < x + w - 40; t++) {
      const tw = 18 + rand() * 90;
      ctx.fillStyle = TOKENS[Math.floor(rand() * TOKENS.length)];
      ctx.globalAlpha = 0.85;
      ctx.fillRect(cx, ly + 2, tw, 12);
      cx += tw + 10;
    }
    ctx.globalAlpha = 1;
    if (rand() < 0.3) indent = Math.min(4, indent + 1);
  }
}

function drawTerminal(ctx: CanvasRenderingContext2D, data: GithubData | null, status: LiveStatus, x: number, y: number, w: number) {
  const f = fonts();
  ctx.fillStyle = "#0d0f13";
  ctx.fillRect(x, y, w, 214);
  ctx.fillStyle = EDITOR.line;
  ctx.fillRect(x, y, w, 2);
  ctx.fillStyle = EDITOR.muted;
  text.setFont(ctx, 400, 15, f.mono, 2);
  ctx.fillText("TERMINALE", x + 24, y + 32);
  text.setFont(ctx, 400, 21, f.mono);
  ctx.fillStyle = "#7ee787";
  ctx.fillText("$ git log -1", x + 24, y + 72);

  const repo = data?.repos.find((r) => r.lastCommit) ?? data?.repos[0];
  if (!data || !repo) {
    ctx.fillStyle = EDITOR.ink;
    ctx.fillText(status === "loading" ? "Collegamento a GitHub…" : "GitHub in pausa. Torno subito.", x + 24, y + 110);
    return;
  }
  ctx.fillStyle = EDITOR.accent;
  ctx.fillText(`● ${clip(repo.lastCommit?.message.split("\n")[0] ?? "Nuovo push", 54)}`, x + 24, y + 110);
  ctx.fillStyle = "#9aa3ad";
  text.setFont(ctx, 400, 18, f.mono);
  const when = relativeTime(repo.lastCommit?.date ?? repo.pushedAt);
  ctx.fillText(`  ${repo.name}${repo.language ? ` · ${repo.language}` : ""} · ${when}`, x + 24, y + 144);
  ctx.fillStyle = EDITOR.ink;
  ctx.fillText("$", x + 24, y + 184);
  ctx.fillRect(x + 46, y + 168, 12, 22);
}

/** Il monitor: un editor aperto sull'ultimo repository toccato, con l'ultimo commit nel terminale. */
export function drawEditorScreen(data: GithubData | null, status: LiveStatus): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    const repos = data?.repos ?? [];
    const repo = repos[0];
    ctx.fillStyle = EDITOR.bg;
    ctx.fillRect(0, 0, w, h);
    drawSidebar(ctx, repos, h);

    // Linguetta del file aperto
    ctx.fillStyle = EDITOR.bar;
    ctx.fillRect(280, 0, w - 280, 40);
    ctx.fillStyle = EDITOR.bg;
    ctx.fillRect(280, 0, 230, 40);
    ctx.fillStyle = EDITOR.accent;
    ctx.fillRect(280, 0, 230, 3);
    ctx.fillStyle = EDITOR.ink;
    text.setFont(ctx, 400, 17, f.mono);
    ctx.fillText(fileFor(repo), 300, 27);
    ctx.fillStyle = EDITOR.muted;
    ctx.fillText(repo ? clip(repo.name, 26) : "raffaelevitale", 540, 27);

    drawFakeCode(ctx, hashOf(repo?.name ?? "studio"), 280, 66, w - 280, 11);
    drawTerminal(ctx, data, status, 280, h - 214 - 28, w - 280);

    // Barra di stato
    ctx.fillStyle = "#2a2018";
    ctx.fillRect(0, h - 28, w, 28);
    ctx.fillStyle = "#e9d3b9";
    text.setFont(ctx, 400, 15, f.mono);
    ctx.fillText(`main   ${repo?.language ?? ""}`, 16, h - 9);
    ctx.textAlign = "right";
    const total = data?.totalContributions;
    ctx.fillText(total != null ? `${total} contributi nell'ultimo anno` : "GitHub", w - 16, h - 9);
    ctx.textAlign = "left";
  };
}

const LESSONS = [
  { code: "INF", color: "#3f7d6e" },
  { code: "MAT", color: "#c7774a" },
  { code: "ITA", color: "#8a5a9c" },
  { code: "ING", color: "#4a73b5" },
  { code: "SIS", color: "#b0913b" },
  { code: "TPS", color: "#b5525a" },
  { code: "GPO", color: "#5e8f4a" },
] as const;
const DAYS = ["LUN", "MAR", "MER", "GIO", "VEN"] as const;
const HOURS = 6;

/** Il portatile: un'interpretazione dell'orario scolastico, con la lezione in corso evidenziata. */
export const drawOrarioScreen: Draw = (ctx, w, h) => {
  const f = fonts();
  const rand = seeded(2026);
  ctx.fillStyle = "#f4f1ea";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#1d2a3a";
  ctx.fillRect(0, 0, w, 52);
  ctx.fillStyle = "#f4f1ea";
  text.setFont(ctx, 700, 22, f.body);
  ctx.fillText("Orario", 22, 34);
  ctx.fillStyle = "#9fb1c6";
  text.setFont(ctx, 400, 15, f.mono, 1);
  ctx.fillText("orario.vallauri.edu", 110, 33);

  // La lezione in corso
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(22, 70, w - 44, 62);
  ctx.fillStyle = LESSONS[0].color;
  ctx.fillRect(22, 70, 8, 62);
  ctx.fillStyle = "#1d2a3a";
  text.setFont(ctx, 700, 20, f.body);
  ctx.fillText("Adesso · Informatica", 44, 97);
  ctx.fillStyle = "#6b7280";
  text.setFont(ctx, 400, 15, f.mono);
  ctx.fillText("Lab 12 · fine tra 14 min", 44, 120);
  ctx.fillStyle = "#e5e1d8";
  ctx.fillRect(w - 190, 96, 150, 8);
  ctx.fillStyle = LESSONS[0].color;
  ctx.fillRect(w - 190, 96, 104, 8);

  // Griglia settimanale
  const top = 152;
  const colW = (w - 44) / DAYS.length;
  const rowH = (h - top - 30) / HOURS;
  DAYS.forEach((day, d) => {
    ctx.fillStyle = "#6b7280";
    text.setFont(ctx, 400, 13, f.mono, 1);
    ctx.fillText(day, 22 + d * colW + 6, top + 4);
    for (let r = 0; r < HOURS; r++) {
      const lesson = LESSONS[Math.floor(rand() * LESSONS.length)];
      const x = 22 + d * colW + 3;
      const y = top + 14 + r * rowH;
      ctx.fillStyle = lesson.color;
      ctx.globalAlpha = d === 1 && r === 2 ? 1 : 0.78;
      ctx.fillRect(x, y, colW - 6, rowH - 5);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffffff";
      text.setFont(ctx, 700, 13, f.mono, 1);
      ctx.fillText(lesson.code, x + 6, y + 18);
    }
  });
};

/** Un post-it scritto a mano. */
export function drawPostIt(color: string, lines: readonly string[], seed: number): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    const fold = ctx.createLinearGradient(0, 0, 0, h * 0.25);
    fold.addColorStop(0, "rgba(0,0,0,0.12)");
    fold.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = fold;
    ctx.fillRect(0, 0, w, h * 0.25);
    ctx.fillStyle = "#2b2a33";
    ctx.save();
    ctx.translate(w * 0.1, h * 0.42);
    ctx.rotate(-0.04);
    ctx.font = `italic 400 ${Math.round(h * 0.17)}px ${f.display}`;
    lines.forEach((line, i) => ctx.fillText(line, 0, i * h * 0.22));
    ctx.restore();
    grain(ctx, 0, 0, w, h, 10, seed);
  };
}

const PRINT_LEVELS = ["#e2dacb", "#b9b1a4", "#8c8479", "#5b554e", "#25221f"] as const;

function printLevel(count: number, max: number): number {
  if (count === 0) return 0;
  return Math.min(4, Math.ceil((count / Math.max(1, max)) * 4));
}

function drawFilmEdge(ctx: CanvasRenderingContext2D, y: number, w: number) {
  ctx.fillStyle = "#16130f";
  ctx.fillRect(0, y, w, 46);
  ctx.fillStyle = "#e9e1cf";
  for (let x = 14; x < w; x += 30) ctx.fillRect(x, y + 14, 14, 18);
}

/** Il grafico dei contributi GitHub stampato come un provino e appeso al muro. */
export function drawContributionPrint(data: GithubData | null): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    ctx.fillStyle = "#f1ebe0";
    ctx.fillRect(0, 0, w, h);
    drawFilmEdge(ctx, 0, w);
    drawFilmEdge(ctx, h - 46, w);

    // Senza dati il provino resta "da sviluppare": una trama di prova, non numeri inventati.
    const rand = seeded(53);
    const grid = data?.weeks?.slice(-53)
      ?? Array.from({ length: 53 }, () => Array.from({ length: 7 }, () => (rand() < 0.5 ? 0 : 1)));
    const max = Math.max(1, ...grid.flat());
    const cell = Math.floor((w - 80) / grid.length) - 3;
    const left = (w - grid.length * (cell + 3)) / 2;
    grid.forEach((week, wi) => {
      week.forEach((count, di) => {
        ctx.fillStyle = PRINT_LEVELS[printLevel(count, max)];
        ctx.fillRect(left + wi * (cell + 3), 80 + di * (cell + 3), cell, cell);
      });
    });

    ctx.fillStyle = "#2b2622";
    text.setFont(ctx, 400, 22, f.mono, 3);
    const total = data?.totalContributions;
    ctx.fillText(total != null ? `${total} CONTRIBUTI · ULTIMI 12 MESI` : "CONTRIBUTI · ULTIMI 12 MESI", left, h - 70);
    ctx.textAlign = "right";
    ctx.fillStyle = "#8a7f72";
    ctx.fillText("GITHUB", w - left, h - 70);
    ctx.textAlign = "left";
    grain(ctx, 0, 0, w, h, 14, 9);
  };
}

/** Il cartellino sotto il leggio dei vinili. */
export function drawNowPlayingCard(label: string, title: string, artist: string): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    ctx.fillStyle = "#efe7d8";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = label.startsWith("IN ASCOLTO") ? "#b8452c" : "#7a6c5c";
    text.setFont(ctx, 400, 15, f.mono, 3);
    ctx.fillText(label, 16, 26);
    ctx.fillStyle = "#231f1c";
    text.setFont(ctx, 400, 26, f.display);
    ctx.fillText(clip(title, 22), 16, 60);
    ctx.fillStyle = "#5e554c";
    text.setFont(ctx, 400, 16, f.body);
    ctx.fillText(clip(artist, 30), 16, 84);
    grain(ctx, 0, 0, w, h, 10, 4);
  };
}
