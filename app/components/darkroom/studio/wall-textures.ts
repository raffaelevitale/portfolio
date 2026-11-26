import { type Draw, fonts, grain, seeded, text } from "../textures";

/* ───────────────────────── stampe latenti ───────────────────────── */

/**
 * Una stampa uscita dall'ingranditore ma non ancora sviluppata: carta baritata,
 * un'ombra appena accennata dell'immagine e il numero scritto a matita sul bordo.
 */
export function drawLatentPhoto(seed: number, frame: string): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    const rand = seeded(seed);
    ctx.fillStyle = "#ece5d6";
    ctx.fillRect(0, 0, w, h);
    const border = Math.round(Math.min(w, h) * 0.07);
    const iw = w - border * 2;
    const ih = h - border * 2.6;
    const base = ctx.createLinearGradient(0, border, 0, border + ih);
    base.addColorStop(0, "#ddd5c4");
    base.addColorStop(1, "#d3cab8");
    ctx.fillStyle = base;
    ctx.fillRect(border, border, iw, ih);
    // Masse tonali vaghe, come un'immagine che sta ancora affiorando.
    for (let i = 0; i < 5; i++) {
      const x = border + rand() * iw;
      const y = border + rand() * ih;
      const r = (0.25 + rand() * 0.4) * Math.max(iw, ih);
      const blob = ctx.createRadialGradient(x, y, 0, x, y, r);
      blob.addColorStop(0, `rgba(120,108,92,${0.05 + rand() * 0.07})`);
      blob.addColorStop(1, "rgba(120,108,92,0)");
      ctx.fillStyle = blob;
      ctx.fillRect(border, border, iw, ih);
    }
    ctx.fillStyle = "rgba(70,62,54,0.55)";
    ctx.font = `italic 400 ${Math.round(border * 0.62)}px ${f.display}`;
    ctx.fillText(`${frame} · in sviluppo`, border, h - border * 0.55);
    grain(ctx, 0, 0, w, h, 12, seed);
  };
}

/* ───────────────────────── lavagnetta ───────────────────────── */

export interface ChalkLine {
  label: string;
  text: string;
}

const SLATE = "#1d2723";
const CHALK = "#ecebe4";

function wrap(ctx: CanvasRenderingContext2D, value: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of value.split(" ")) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Ardesia con aloni di cancellino. */
function drawSlate(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number) {
  ctx.fillStyle = SLATE;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 7; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = (0.15 + rand() * 0.3) * w;
    const smudge = ctx.createRadialGradient(x, y, 0, x, y, r);
    smudge.addColorStop(0, `rgba(236,235,228,${0.03 + rand() * 0.04})`);
    smudge.addColorStop(1, "rgba(236,235,228,0)");
    ctx.fillStyle = smudge;
    ctx.fillRect(0, 0, w, h);
  }
}

/** Il gesso non copre mai del tutto: buca il testo con granelli trasparenti. */
function chalkify(layer: CanvasRenderingContext2D, w: number, h: number, rand: () => number) {
  layer.globalCompositeOperation = "destination-out";
  layer.fillStyle = "#000";
  for (let i = 0; i < w * h * 0.012; i++) {
    layer.globalAlpha = 0.3 + rand() * 0.7;
    layer.fillRect(rand() * w, rand() * h, 1 + rand() * 1.6, 1 + rand() * 1.6);
  }
  layer.globalAlpha = 1;
  layer.globalCompositeOperation = "source-over";
}

/** La lavagnetta "Adesso": titolo, data e una riga per ogni cosa che sto facendo. */
export function drawChalkboard(lines: readonly ChalkLine[], updated: string): Draw {
  return (ctx, w, h) => {
    const f = fonts();
    const rand = seeded(17);
    drawSlate(ctx, w, h, rand);

    const layer = document.createElement("canvas");
    layer.width = w;
    layer.height = h;
    const c = layer.getContext("2d");
    if (!c) return;
    const pad = w * 0.07;
    c.fillStyle = CHALK;
    c.strokeStyle = CHALK;

    text.setFont(c, 400, h * 0.05, f.mono, h * 0.012);
    c.fillText("ADESSO", pad, pad + h * 0.03);
    const stamp = updated.toUpperCase();
    c.fillText(stamp, w - pad - c.measureText(stamp).width, pad + h * 0.03);
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(pad, pad + h * 0.075);
    c.quadraticCurveTo(w / 2, pad + h * 0.085, w - pad, pad + h * 0.07);
    c.stroke();

    let y = pad + h * 0.2;
    const lineGap = h * 0.088;
    for (const line of lines) {
      text.setFont(c, 400, h * 0.04, f.mono, h * 0.008);
      c.globalAlpha = 0.7;
      c.fillText(line.label.toUpperCase(), pad, y);
      c.globalAlpha = 1;
      c.font = `italic 400 ${Math.round(h * 0.075)}px ${f.display}`;
      const wrapped = wrap(c, line.text, w - pad * 2).slice(0, 2);
      wrapped.forEach((part, i) => c.fillText(part, pad + w * 0.01, y + lineGap * (i + 0.95)));
      y += lineGap * (wrapped.length + 1.45);
      if (y > h - pad) break;
    }

    chalkify(c, w, h, rand);
    ctx.drawImage(layer, 0, 0);
    grain(ctx, 0, 0, w, h, 8, 23);
  };
}
