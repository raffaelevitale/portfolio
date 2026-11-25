import { NEXT_FRAME, PROJECTS, SERVICES } from "@/lib/content";
import { fonts, grain, seeded, text, type Draw } from "./textures";

/**
 * Le stampe appese al filo (i progetti) e i negativi sul tavolo luminoso (i servizi).
 * Ogni stampa ha il bordo bianco della carta e una didascalia a matita sotto l'immagine.
 */

const PAPER = "#e8e1d3";
const INK = "#1d1916";
const SAFE_RED = "#c8281e";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function paper(ctx: CanvasRenderingContext2D, w: number, h: number): Rect {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  const m = Math.round(w * 0.07);
  return { x: m, y: m, w: w - m * 2, h: h - m * 2 - Math.round(h * 0.08) };
}

function caption(ctx: CanvasRenderingContext2D, w: number, h: number, left: string, right: string) {
  const f = fonts();
  ctx.fillStyle = "#4a433c";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  text.setFont(ctx, 400, 26, f.mono, 3);
  ctx.fillText(left, w * 0.07, h - h * 0.045);
  ctx.textAlign = "right";
  text.setFont(ctx, 400, 40, f.display);
  ctx.fillText(right, w * 0.93, h - h * 0.042);
  ctx.textAlign = "left";
}

/** Didascalia letta dai contenuti, così fotogramma e anno restano allineati al CV. */
function projectCaption(slug: string): string {
  const p = PROJECTS.find((project) => project.slug === slug);
  if (!p) {
    throw new Error(`Progetto sconosciuto: ${slug}`);
  }
  return `${p.frame} — ${p.name} — ${p.year}`;
}

export const drawPrintCrybu: Draw = (ctx, w, h) => {
  const f = fonts();
  const r = paper(ctx, w, h);
  const glow = ctx.createRadialGradient(r.x + r.w * 0.2, r.y + r.h * 0.15, 10, r.x + r.w * 0.3, r.y + r.h * 0.3, r.w);
  glow.addColorStop(0, "#2b2a28");
  glow.addColorStop(1, "#0b0b0b");
  ctx.fillStyle = glow;
  ctx.fillRect(r.x, r.y, r.w, r.h);

  ctx.fillStyle = SAFE_RED;
  ctx.beginPath();
  ctx.arc(r.x + r.w * 0.74, r.y + r.h * 0.26, r.w * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(233,226,211,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(r.x + 48, r.y + r.h * 0.56);
  ctx.lineTo(r.x + r.w - 48, r.y + r.h * 0.56);
  ctx.stroke();

  ctx.fillStyle = "#efe8da";
  text.setFont(ctx, 400, 24, f.mono, 5);
  ctx.fillText("PIATTAFORMA CLIENTI · AI", r.x + 48, r.y + 76);
  text.setFont(ctx, 700, Math.round(r.w * 0.27), f.body, -6);
  ctx.textBaseline = "alphabetic";
  ctx.fillText("CRYBU", r.x + 40, r.y + r.h - 70);
  text.setFont(ctx, 400, 24, f.mono, 4);
  ctx.fillText("CONTROL CENTER — NEXT.JS", r.x + 48, r.y + r.h * 0.56 + 54);

  grain(ctx, r.x, r.y, r.w, r.h, 26, 101);
  caption(ctx, w, h, projectCaption("crybu-control-center"), "f/8 · 12s");
};

export const drawPrintOrario: Draw = (ctx, w, h) => {
  const f = fonts();
  const r = paper(ctx, w, h);
  ctx.fillStyle = "#cbc3b4";
  ctx.fillRect(r.x, r.y, r.w, r.h);

  ctx.fillStyle = INK;
  ctx.textBaseline = "alphabetic";
  text.setFont(ctx, 400, Math.round(r.w * 0.22), f.display, -2);
  ctx.fillText("Orario", r.x + 40, r.y + r.w * 0.24);

  const rand = seeded(42);
  const cols = 5;
  const rows = 6;
  const gx = r.x + 40;
  const gy = r.y + r.w * 0.34;
  const gw = r.w - 80;
  const gh = r.h - (gy - r.y) - 110;
  const cw = gw / cols;
  const ch = gh / rows;
  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < rows; row++) {
      const tone = 60 + Math.round(rand() * 120);
      const current = c === 2 && row === 3;
      ctx.fillStyle = current ? SAFE_RED : `rgb(${tone},${tone - 4},${tone - 10})`;
      ctx.fillRect(gx + c * cw + 5, gy + row * ch + 5, cw - 10, ch - 10);
    }
  }
  ctx.fillStyle = INK;
  text.setFont(ctx, 400, 24, f.mono, 5);
  ctx.fillText("VALLAURI · 1.500 UTENTI/GIORNO", r.x + 40, r.y + r.h - 50);

  grain(ctx, r.x, r.y, r.w, r.h, 20, 202);
  caption(ctx, w, h, projectCaption("orario-vallauri"), "f/11 · 8s");
};

/** Un ritratto in controluce: la stampa del lavoro da fotografo. */
export const drawPrintPhoto: Draw = (ctx, w, h) => {
  const f = fonts();
  const r = paper(ctx, w, h);
  const cx = r.x + r.w / 2;
  const light = ctx.createRadialGradient(cx, r.y + r.h * 0.36, 20, cx, r.y + r.h * 0.42, r.w * 0.8);
  light.addColorStop(0, "#e2dbcd");
  light.addColorStop(0.45, "#8a8378");
  light.addColorStop(1, "#141312");
  ctx.fillStyle = light;
  ctx.fillRect(r.x, r.y, r.w, r.h);

  ctx.fillStyle = "#121110";
  ctx.beginPath();
  ctx.ellipse(cx, r.y + r.h * 0.5, r.w * 0.14, r.w * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(r.x + r.w * 0.12, r.y + r.h);
  ctx.quadraticCurveTo(r.x + r.w * 0.18, r.y + r.h * 0.7, cx, r.y + r.h * 0.68);
  ctx.quadraticCurveTo(r.x + r.w * 0.82, r.y + r.h * 0.7, r.x + r.w * 0.88, r.y + r.h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#efe8da";
  text.setFont(ctx, 400, 24, f.mono, 5);
  ctx.fillText("@JOSH63.EXE", r.x + 40, r.y + 70);
  ctx.textAlign = "right";
  ctx.fillText("30+ SERVIZI", r.x + r.w - 40, r.y + 70);
  ctx.textAlign = "left";

  grain(ctx, r.x, r.y, r.w, r.h, 30, 606);
  caption(ctx, w, h, projectCaption("fotografia"), "f/2 · 1/125");
};

/** Una stampa ancora "latente": il prossimo progetto. */
export const drawPrintNext: Draw = (ctx, w, h) => {
  const f = fonts();
  const r = paper(ctx, w, h);
  const fade = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
  fade.addColorStop(0, "#dcd4c4");
  fade.addColorStop(1, "#cfc6b4");
  ctx.fillStyle = fade;
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.fillStyle = "rgba(29,25,22,0.16)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  text.setFont(ctx, 400, Math.round(r.w * 0.17), f.display);
  ctx.fillText("Il prossimo", r.x + r.w / 2, r.y + r.h * 0.44);
  ctx.fillText("è il tuo?", r.x + r.w / 2, r.y + r.h * 0.6);
  ctx.textAlign = "left";
  grain(ctx, r.x, r.y, r.w, r.h, 14, 303);
  caption(ctx, w, h, `${NEXT_FRAME} — IN SVILUPPO`, "?");
};

/** Striscia di prova: esposizioni crescenti, come quelle che si fanno prima della stampa finale. */
export const drawTestStrip: Draw = (ctx, w, h) => {
  const f = fonts();
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  const steps = 7;
  const m = 18;
  const sh = (h - m * 2) / steps;
  for (let i = 0; i < steps; i++) {
    const tone = 215 - i * 30;
    ctx.fillStyle = `rgb(${tone},${tone - 6},${tone - 14})`;
    ctx.fillRect(m, m + i * sh, w - m * 2, sh);
    ctx.fillStyle = i > 3 ? "#e8e1d3" : INK;
    text.setFont(ctx, 400, 26, f.mono);
    ctx.fillText(`${(i + 1) * 2}s`, m + 14, m + i * sh + 40);
  }
  grain(ctx, 0, 0, w, h, 18, 404);
};

/** Due strisce di negativo 35mm sul tavolo luminoso: un fotogramma per servizio. */
export const drawNegatives: Draw = (ctx, w, h) => {
  const f = fonts();
  ctx.fillStyle = "#f6f7fb";
  ctx.fillRect(0, 0, w, h);

  const stripH = h * 0.36;
  const frameW = w * 0.38;
  const frameH = stripH * 0.62;
  const strips = [h * 0.1, h * 0.54];

  strips.forEach((sy, s) => {
    ctx.fillStyle = "#5e2c10";
    ctx.fillRect(w * 0.04, sy, w * 0.92, stripH);
    ctx.fillStyle = "#fffaf0";
    for (let x = w * 0.05; x < w * 0.95; x += 34) {
      ctx.fillRect(x, sy + 10, 18, 22);
      ctx.fillRect(x, sy + stripH - 32, 18, 22);
    }
    ctx.fillStyle = "#f2b37a";
    text.setFont(ctx, 400, 18, f.mono, 4);
    ctx.fillText(`ROLL 2026  ▸ ${s * 2 + 1}  ▸ ${s * 2 + 1}A   SAFETY FILM`, w * 0.06, sy + 50);

    for (let i = 0; i < 2; i++) {
      const service = SERVICES[s * 2 + i];
      const fx = w * 0.08 + i * (frameW + w * 0.08);
      const fy = sy + (stripH - frameH) / 2 + 8;
      ctx.fillStyle = "#d18a4e";
      ctx.fillRect(fx, fy, frameW, frameH);
      ctx.fillStyle = "#1e0c03";
      ctx.textBaseline = "alphabetic";
      text.setFont(ctx, 400, Math.round(frameH * 0.5), f.display);
      ctx.fillText(service.num, fx + 22, fy + frameH * 0.58);
      text.setFont(ctx, 700, Math.round(frameH * 0.1), f.body, 1);
      const words = service.title.split(" ");
      const half = Math.ceil(words.length / 2);
      ctx.fillText(words.slice(0, half).join(" "), fx + 24, fy + frameH * 0.78);
      ctx.fillText(words.slice(half).join(" "), fx + 24, fy + frameH * 0.91);
    }
  });
  grain(ctx, 0, 0, w, h, 8, 505);
};
