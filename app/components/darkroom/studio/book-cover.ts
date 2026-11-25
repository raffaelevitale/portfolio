import { useMemo } from "react";
import { Color, type Texture } from "three";
import type { Book } from "@/lib/studio-content";
import { useCanvasTexture } from "../textures";
import { drawCover } from "./studio-textures";
import { useRemoteTexture } from "./useRemoteTexture";

export function useBookCover(book: Book) {
  const real = useRemoteTexture(book.cover ?? null);
  const fallback = useCanvasTexture(384, 512, drawCover(book), undefined, book.title);
  const image = real?.image as HTMLImageElement | HTMLCanvasElement | undefined;
  const ratio = image?.height ? image.width / image.height : 384 / 512;
  const spine = useMemo(() => spineColors(book, real), [book, real]);
  return { texture: real ?? fallback, ratio, spine };
}

/** Campiona la grafica in piccoli gruppi di colori, evitando il testo come media globale. */
function contrastingInk(book: Book, color: Color) {
  const luminance = ({ r, g, b }: Color) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const bg = luminance(color);
  const fg = luminance(new Color(book.ink));
  if ((Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05) >= 4.5) return book.ink;
  return bg > 0.179 ? "#000000" : "#ffffff";
}

function spineColors(book: Book, texture: Texture | null): Book {
  const original = new Color(book.color);
  const fallback = { ...book, ink: contrastingInk(book, original) };
  if (!texture) return fallback;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback;
    ctx.drawImage(texture.image as HTMLImageElement | HTMLCanvasElement, 0, 0, 32, 32);
    const { data } = ctx.getImageData(0, 0, 32, 32);
    const groups = new Map<number, { count: number; r: number; g: number; b: number }>();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      const key = (data[i] >> 5) * 64 + (data[i + 1] >> 5) * 8 + (data[i + 2] >> 5);
      const entry = groups.get(key) ?? { count: 0, r: 0, g: 0, b: 0 };
      entry.count++;
      entry.r += data[i];
      entry.g += data[i + 1];
      entry.b += data[i + 2];
      groups.set(key, entry);
    }
    const dominant = [...groups.values()].sort((a, b) => b.count - a.count)[0];
    if (!dominant) return fallback;
    const rgb = [dominant.r, dominant.g, dominant.b].map((v) => Math.round(v / dominant.count));
    const current = original.getHex();
    const base = [current >> 16, (current >> 8) & 255, current & 255];
    if (Math.hypot(...rgb.map((v, i) => v - base[i])) < 85) return fallback;
    const color = `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    return { ...book, color, ink: contrastingInk(book, new Color(color)) };
  } catch {
    return fallback;
  }
}
