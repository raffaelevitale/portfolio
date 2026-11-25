import { useThree } from "@react-three/fiber";
import { type DependencyList, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { GithubData, SteamData } from "@/lib/live/types";
import { relativeTime } from "@/lib/rome-time";
import type { Book } from "@/lib/studio-content";
import { type Draw, fonts, grain, seeded, text } from "../textures";

/**
 * Texture canvas che si ridisegna quando cambiano i dati (monitor, TV).
 * Canvas e texture si creano una sola volta; cambia solo il contenuto.
 */
export function useLiveCanvasTexture(w: number, h: number, draw: Draw, deps: DependencyList): THREE.CanvasTexture {
  const invalidate = useThree((state) => state.invalidate);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 512 / Math.max(w, h));
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [w, h]);

  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Monitor e TV conservano le coordinate di disegno con una texture più piccola.
    ctx.save();
    ctx.scale(canvas.width / w, canvas.height / h);
    draw(ctx, w, h);
    ctx.restore();
    texture.needsUpdate = true;
    invalidate();
    // draw cambia a ogni render: ridisegniamo solo quando cambiano i dati in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texture, invalidate, ...deps]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function fitFont(ctx: CanvasRenderingContext2D, value: string, max: number, start: number, weight: number, family: string) {
  let size = start;
  text.setFont(ctx, weight, size, family, 1);
  while (ctx.measureText(value).width > max && size > 12) {
    size -= 2;
    text.setFont(ctx, weight, size, family, 1);
  }
}

/* ───────────────────────── stanza ───────────────────────── */

export const drawParquet: Draw = (ctx, w, h) => {
  const rand = seeded(77);
  const rows = 8;
  const rh = h / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rand() * 200;
    while (x < w) {
      const len = 160 + rand() * 180;
      const tone = 70 + Math.round(rand() * 34);
      ctx.fillStyle = `rgb(${tone + 30},${tone + 8},${tone - 18})`;
      ctx.fillRect(x, r * rh, len, rh);
      ctx.strokeStyle = "rgba(20,10,4,0.55)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, r * rh, len, rh);
      for (let g = 0; g < 4; g++) {
        ctx.strokeStyle = `rgba(30,15,5,${0.08 + rand() * 0.08})`;
        ctx.beginPath();
        const gy = r * rh + rand() * rh;
        ctx.moveTo(x, gy);
        ctx.bezierCurveTo(x + len * 0.3, gy + 4, x + len * 0.6, gy - 4, x + len, gy);
        ctx.stroke();
      }
      x += len;
    }
  }
  grain(ctx, 0, 0, w, h, 10, 78);
};

export const drawRug: Draw = (ctx, w, h) => {
  ctx.fillStyle = "#1c2433";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#9a5a34";
  ctx.lineWidth = 14;
  ctx.strokeRect(24, 24, w - 48, h - 48);
  ctx.lineWidth = 3;
  ctx.strokeRect(52, 52, w - 104, h - 104);
  ctx.strokeStyle = "rgba(214,190,150,0.5)";
  ctx.beginPath();
  ctx.moveTo(w / 2, 90);
  ctx.lineTo(w - 90, h / 2);
  ctx.lineTo(w / 2, h - 90);
  ctx.lineTo(90, h / 2);
  ctx.closePath();
  ctx.stroke();
  grain(ctx, 0, 0, w, h, 22, 91);
};

export function drawSign(label: string, color: string): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    ctx.fillStyle = "#0c0a09";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fitFont(ctx, label, w - 40, 54, 400, f.mono);
    ctx.letterSpacing = "6px";
    ctx.fillText(label, w / 2, h / 2 + 2);
  };
}

/* ───────────────────────── libreria ───────────────────────── */

export function drawSpine(book: Book): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    ctx.fillStyle = book.color;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = book.ink;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    fitFont(ctx, book.title.toUpperCase(), h * 0.62, 34, 700, f.body);
    ctx.fillText(book.title.toUpperCase(), -h / 2 + 22, 0);
    ctx.textAlign = "right";
    text.setFont(ctx, 400, 18, f.mono, 2);
    ctx.fillText(book.author.split(" ").slice(-1)[0].toUpperCase(), h / 2 - 18, 0);
    ctx.restore();
    grain(ctx, 0, 0, w, h, 14, book.title.length);
  };
}

export function drawCover(book: Book): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    ctx.fillStyle = book.color;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = book.ink;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.globalAlpha = 1;
    ctx.fillStyle = book.ink;
    text.setFont(ctx, 400, 18, f.mono, 4);
    ctx.fillText(book.author.toUpperCase(), 36, 64);
    text.setFont(ctx, 400, 58, f.display, -1);
    const words = book.title.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > w - 72 && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    lines.push(line);
    lines.forEach((l, i) => ctx.fillText(l, 36, h * 0.48 + i * 58));
    text.setFont(ctx, 400, 16, f.mono, 4);
    ctx.fillText(book.tag.toUpperCase(), 36, h - 40);
    grain(ctx, 0, 0, w, h, 18, book.title.length + 3);
  };
}

/** Copertina di riserva per un vinile senza dati Spotify. */
export function drawSleeve(index: number): Draw {
  const palettes = [
    ["#d9472b", "#f2e4c9"],
    ["#1f3b5c", "#e9c46a"],
    ["#e8e1d3", "#151312"],
  ];
  return (ctx, w, h) => {
    const [bg, fg] = palettes[index % palettes.length];
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(w * (0.35 + (index % 3) * 0.15), h * 0.45, w * 0.24, 0, Math.PI * 2);
    ctx.fill();
    grain(ctx, 0, 0, w, h, 20, 300 + index);
  };
}

export const drawGrooves: Draw = (ctx, w, h) => {
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, w, h);
  for (let r = w * 0.18; r < w * 0.49; r += 2.2) {
    ctx.strokeStyle = `rgba(255,255,255,${0.03 + (r % 7) * 0.006})`;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
};

/* ───────────────────────── vetrina ───────────────────────── */

export function drawDial(color: string, face: "round" | "square" | "chronograph" = "round"): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    const c = new THREE.Color(color);
    const light = c.r * 0.299 + c.g * 0.587 + c.b * 0.114 > 0.6;
    const ink = light ? "#1a1a1a" : "#f1ede4";
    ctx.fillStyle = color;
    if (face === "square") ctx.fillRect(0, 0, w, h);
    else {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = ink;
    for (let i = 0; i < 60; i++) {
      const angle = i * Math.PI / 30;
      ctx.lineWidth = i % 5 === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(w / 2 + Math.sin(angle) * w * 0.455, h / 2 - Math.cos(angle) * h * 0.455);
      ctx.lineTo(w / 2 + Math.sin(angle) * w * 0.477, h / 2 - Math.cos(angle) * h * 0.477);
      ctx.stroke();
    }
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.lineWidth = i % 3 === 0 ? 10 : 5;
      ctx.beginPath();
      ctx.moveTo(w / 2 + Math.sin(a) * w * 0.36, h / 2 - Math.cos(a) * h * 0.36);
      ctx.lineTo(w / 2 + Math.sin(a) * w * 0.45, h / 2 - Math.cos(a) * h * 0.45);
      ctx.stroke();
    }
    if (face === "chronograph") {
      for (const [x, y] of [[0.29, 0.5], [0.71, 0.5], [0.5, 0.73]]) {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w * x, h * y, w * 0.095, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * x, h * y);
        ctx.lineTo(w * x, h * (y - 0.071));
        ctx.stroke();
      }
    }
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    text.setFont(ctx, 400, 15, f.mono, 2);
    ctx.fillText("RV", w / 2, h * 0.3);
  };
}

/* ───────────────────────── schermi live ───────────────────────── */

const GH_LEVELS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

function level(count: number, max: number): number {
  if (count === 0) return 0;
  return Math.min(4, Math.ceil((count / Math.max(1, max)) * 4));
}

export function drawGithubScreen(data: GithubData | null, status: "loading" | "ok" | "off"): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#161b22";
    ctx.fillRect(0, 0, w, 44);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(26 + i * 22, 22, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#8b949e";
    ctx.textAlign = "center";
    text.setFont(ctx, 400, 18, f.mono);
    ctx.fillText(`${data?.username ?? "raffaelevitale"} — git log`, w / 2, 28);
    ctx.textAlign = "left";

    if (!data) {
      ctx.fillStyle = "#c9d1d9";
      text.setFont(ctx, 400, 26, f.mono);
      ctx.fillText("$ git log --oneline", 36, 110);
      ctx.fillStyle = "#8b949e";
      ctx.fillText(status === "loading" ? "Collegamento a GitHub…" : "GitHub in pausa. Torno subito.", 36, 156);
      ctx.fillStyle = "#39d353";
      ctx.fillRect(36, 180, 16, 28);
      return;
    }

    let y = 92;
    if (data.weeks && data.weeks.length > 0) {
      const weeks = data.weeks.slice(-53);
      const max = Math.max(...weeks.flat());
      const cell = Math.min(16, (w - 72) / weeks.length - 2);
      weeks.forEach((week, wi) => {
        week.forEach((count, di) => {
          ctx.fillStyle = GH_LEVELS[level(count, max)];
          ctx.fillRect(36 + wi * (cell + 2), y + di * (cell + 2), cell, cell);
        });
      });
      y += 7 * (cell + 2) + 34;
      ctx.fillStyle = "#c9d1d9";
      text.setFont(ctx, 400, 22, f.mono);
      ctx.fillText(`${data.totalContributions ?? 0} contributi nell'ultimo anno`, 36, y);
      y += 46;
    } else {
      ctx.fillStyle = "#c9d1d9";
      text.setFont(ctx, 400, 24, f.mono);
      ctx.fillText(`$ ls ~/repos   # ${data.publicRepos ?? "—"} pubblici`, 36, y);
      y += 52;
    }

    for (const repo of data.repos.slice(0, 4)) {
      if (y > h - 40) break;
      ctx.fillStyle = "#39d353";
      text.setFont(ctx, 400, 22, f.mono);
      ctx.fillText(`● ${repo.name}`, 36, y);
      ctx.fillStyle = "#8b949e";
      ctx.textAlign = "right";
      ctx.fillText(relativeTime(repo.pushedAt), w - 36, y);
      ctx.textAlign = "left";
      y += 30;
      if (repo.lastCommit) {
        ctx.fillStyle = "#c9d1d9";
        const msg = repo.lastCommit.message.length > 64 ? `${repo.lastCommit.message.slice(0, 63)}…` : repo.lastCommit.message;
        ctx.fillText(`  └ ${msg}`, 36, y);
        y += 38;
      } else {
        y += 10;
      }
    }
  };
}

export function drawTvScreen(data: SteamData | null, image: HTMLImageElement | null, status: "loading" | "ok" | "off"): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    const game = data?.games[0];
    if (!data || !game) {
      // Barre colore: "nessun segnale".
      const bars = ["#a9a499", "#9c8c53", "#638f8d", "#6b8b64", "#906685", "#985451", "#565b89"];
      bars.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect((i * w) / bars.length, 0, w / bars.length + 1, h * 0.72);
      });
      ctx.fillStyle = "#111";
      ctx.fillRect(0, h * 0.72, w, h * 0.28);
      ctx.fillStyle = "#eee";
      ctx.textAlign = "center";
      text.setFont(ctx, 400, 34, f.mono, 6);
      ctx.fillText(status === "loading" ? "SINTONIZZAZIONE…" : "NESSUN SEGNALE", w / 2, h * 0.87);
      ctx.textAlign = "left";
      return;
    }
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(0, 0, w, h);
    if (image) {
      const ih = (image.height / image.width) * w;
      ctx.drawImage(image, 0, (h * 0.7 - ih) / 2, w, ih);
    }
    const grad = ctx.createLinearGradient(0, h * 0.5, 0, h);
    grad.addColorStop(0, "rgba(10,10,12,0)");
    grad.addColorStop(0.45, "rgba(10,10,12,0.92)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);
    ctx.fillStyle = data.nowPlaying ? "#7ee787" : "#9ab8ff";
    text.setFont(ctx, 400, 22, f.mono, 4);
    ctx.fillText(data.nowPlaying ? "● IN GIOCO ORA" : data.allTime ? "IL PIÙ GIOCATO" : "ULTIMA PARTITA", 32, h * 0.8);
    ctx.fillStyle = "#f4f4f4";
    fitFont(ctx, data.nowPlaying ?? game.name, w - 64, 40, 700, f.body);
    ctx.fillText(data.nowPlaying ?? game.name, 32, h * 0.9);
    // Linee di scansione, per un televisore che sembri un televisore.
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
  };
}

export function drawPosterPlaceholder(index: number): Draw {
  const designs = [
    { paper: "#d0bca0", ink: "#342e2a", accent: "#a8513e", title: "CINEMA" },
    { paper: "#b1b6a4", ink: "#2f4546", accent: "#6d877b", title: "IN SALA" },
    { paper: "#c2a496", ink: "#442f38", accent: "#995749", title: "PROSSIMA VISIONE" },
  ];
  return (ctx, w, h) => {
    const f = fonts();
    const { paper, ink, accent, title } = designs[index % designs.length];
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(w * 0.105, h * 0.09, w * 0.79, h * 0.65);
    ctx.clip();
    ctx.fillStyle = ink;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(w * (0.65 - index * 0.13), h * 0.3, w * (0.21 + index * 0.035), 0, Math.PI * 2);
    ctx.fill();
    for (let line = 0; line < 7; line++) {
      ctx.strokeStyle = paper;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.54 + line * 10);
      ctx.quadraticCurveTo(w * 0.45, h * (0.27 + index * 0.15) + line * 10, w, h * 0.62 + line * 10);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = ink;
    ctx.textAlign = "left";
    fitFont(ctx, title, w * 0.8, 35, 500, f.display);
    ctx.fillText(title, w * 0.105, h * 0.87);
    grain(ctx, 0, 0, w, h, 14, 500 + index);
  };
}
