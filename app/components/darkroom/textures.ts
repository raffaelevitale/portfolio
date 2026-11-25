import { useEffect, useMemo } from "react";
import * as THREE from "three";

/**
 * Tutte le superfici "stampate" della stanza sono disegnate su canvas a runtime:
 * niente immagini da scaricare, testo nitido e font del sito.
 */

export interface FontSet {
  display: string;
  body: string;
  mono: string;
}

const FALLBACK_FONTS: FontSet = {
  display: "Georgia, serif",
  body: "system-ui, sans-serif",
  mono: "ui-monospace, monospace",
};

let activeFonts: FontSet = FALLBACK_FONTS;

export function fonts(): FontSet {
  return activeFonts;
}

/** Legge le famiglie generate da next/font e attende che siano caricate prima di disegnare. */
export async function prepareFonts(timeoutMs = 2500): Promise<void> {
  const style = getComputedStyle(document.body);
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  const next: FontSet = {
    display: read("--font-display", FALLBACK_FONTS.display),
    body: read("--font-body", FALLBACK_FONTS.body),
    mono: read("--font-mono", FALLBACK_FONTS.mono),
  };
  const specs = [`400 64px ${next.display}`, `400 32px ${next.mono}`, `400 32px ${next.body}`, `700 32px ${next.body}`];
  const loads = Promise.all(specs.map((spec) => document.fonts.load(spec).catch(() => [])));
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
  await Promise.race([loads, timeout]);
  activeFonts = next;
}

/** Generatore pseudo-casuale deterministico: la grana è identica a ogni visita. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

export function makeTexture(w: number, h: number, draw: Draw): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D non disponibile");
  }
  draw(ctx, w, h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Crea una texture una sola volta e la libera allo smontaggio del componente. */
export function useCanvasTexture(
  w: number,
  h: number,
  draw: Draw,
  repeat?: readonly [number, number],
  revision?: string,
): THREE.CanvasTexture {
  const texture = useMemo(() => {
    const t = makeTexture(w, h, draw);
    if (repeat) {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat[0], repeat[1]);
    }
    return t;
    // draw è una funzione statica di modulo: la texture non deve rigenerarsi a ogni render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h, revision]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** Grana d'argento: rumore monocromatico applicato a una regione. */
export function grain(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  amount: number,
  seed = 7,
): void {
  const rand = seeded(seed);
  const img = ctx.getImageData(x, y, w, h);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (rand() - 0.5) * amount;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  ctx.putImageData(img, x, y);
}

function setFont(ctx: CanvasRenderingContext2D, weight: number, size: number, family: string, spacing = 0) {
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.letterSpacing = `${spacing}px`;
}

export const text = { setFont };

/* ───────────────────────── superfici della stanza ───────────────────────── */

export const drawFloor: Draw = (ctx, w, h) => {
  const half = w / 2;
  ctx.fillStyle = "#1c0d0b";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#0c0908";
  ctx.fillRect(0, 0, half, half);
  ctx.fillRect(half, half, half, half);
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, half, half);
  ctx.strokeRect(half, half, half, half);
  grain(ctx, 0, 0, w, h, 14, 3);
};

export const drawPlaster: Draw = (ctx, w, h) => {
  ctx.fillStyle = "#3b3533";
  ctx.fillRect(0, 0, w, h);
  const rand = seeded(11);
  for (let i = 0; i < 900; i++) {
    const r = 4 + rand() * 30;
    ctx.fillStyle = `rgba(${rand() > 0.5 ? "255,255,255" : "0,0,0"},${0.015 + rand() * 0.03})`;
    ctx.beginPath();
    ctx.arc(rand() * w, rand() * h, r, 0, Math.PI * 2);
    ctx.fill();
  }
  grain(ctx, 0, 0, w, h, 10, 5);
};

export function drawTrayLabel(step: string, bath: string): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    ctx.fillStyle = "#ece5d6";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1a1714";
    setFont(ctx, 400, 54, f.mono, 4);
    ctx.textBaseline = "middle";
    ctx.fillText(`${step} — ${bath.toUpperCase()}`, 28, h / 2 + 2);
    grain(ctx, 0, 0, w, h, 18, step.charCodeAt(1));
  };
}

export const drawEnvelope: Draw = (ctx, w, h) => {
  const f = fonts();
  ctx.fillStyle = "#b08657";
  ctx.fillRect(0, 0, w, h);
  const rand = seeded(23);
  for (let i = 0; i < 1400; i++) {
    ctx.strokeStyle = `rgba(60,35,15,${0.05 + rand() * 0.08})`;
    ctx.beginPath();
    const x = rand() * w;
    const y = rand() * h;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rand() - 0.5) * 30, y + (rand() - 0.5) * 6);
    ctx.stroke();
  }
  ctx.fillStyle = "#2a1c10";
  setFont(ctx, 400, 40, f.mono, 6);
  ctx.fillText("CURRICULUM VITAE", 56, 120);
  setFont(ctx, 400, 30, f.mono, 3);
  ctx.fillText("R. VITALE — 2026", 56, 170);
  ctx.save();
  ctx.translate(w - 230, h - 150);
  ctx.rotate(-0.12);
  ctx.strokeStyle = "rgba(190,30,20,0.85)";
  ctx.fillStyle = "rgba(190,30,20,0.85)";
  ctx.lineWidth = 6;
  ctx.strokeRect(-150, -55, 300, 110);
  setFont(ctx, 700, 44, f.body, 6);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PRENDINE", 0, -14);
  ctx.fillText("UNA COPIA", 0, 30);
  ctx.restore();
  grain(ctx, 0, 0, w, h, 16, 29);
};

export const drawTimerFace: Draw = (ctx, w, h) => {
  const f = fonts();
  const cx = w / 2;
  const cy = h / 2;
  ctx.fillStyle = "#0b0b0a";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#a6f28f";
  ctx.fillStyle = "#a6f28f";
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const long = i % 5 === 0;
    const r1 = w * (long ? 0.36 : 0.4);
    const r2 = w * 0.44;
    ctx.lineWidth = long ? 6 : 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    ctx.stroke();
    if (long) {
      setFont(ctx, 400, 34, f.mono);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const r3 = w * 0.29;
      ctx.fillText(String(i), cx + Math.cos(a) * r3, cy + Math.sin(a) * r3);
    }
  }
  setFont(ctx, 400, 20, f.mono, 4);
  ctx.fillText("SECONDI", cx, cy + w * 0.13);
};

export const drawPaperBox: Draw = (ctx, w, h) => {
  const f = fonts();
  ctx.fillStyle = "#151312";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#c8281e";
  ctx.fillRect(0, h * 0.62, w, h * 0.12);
  ctx.fillStyle = "#e9e2d3";
  setFont(ctx, 400, 34, f.mono, 5);
  ctx.fillText("CARTA FOTOGRAFICA", 30, 70);
  setFont(ctx, 400, 24, f.mono, 3);
  ctx.fillText("BARITATA · 24×30 · 100 FOGLI", 30, 112);
  ctx.fillStyle = "#151312";
  setFont(ctx, 700, 24, f.body, 4);
  ctx.fillText("APRIRE SOLO CON LUCE DI SICUREZZA", 30, h * 0.705);
};

export function drawCaption(line: string, sub: string): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#1f1b18";
    setFont(ctx, 400, 64, f.display);
    ctx.textBaseline = "middle";
    ctx.fillText(line, 24, h * 0.42);
    setFont(ctx, 400, 24, f.mono, 4);
    ctx.fillStyle = "#5c544c";
    ctx.fillText(sub, 26, h * 0.82);
  };
}
