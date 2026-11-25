"use client";

import { RoundedBox } from "@react-three/drei";
import { createContext, type ReactNode, useContext } from "react";
import type { CanvasTexture } from "three";
import type { Vec3 } from "@/lib/darkroom/hotspots";
import { type Draw, seeded, useCanvasTexture } from "../textures";

const walnut: Draw = (ctx, w, h) => {
  const rand = seeded(269);
  ctx.fillStyle = "#9a6d4b";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 410; i++) {
    const y = rand() * h;
    const wave = rand() * 7 + 1;
    const length = w * (0.2 + rand());
    const x = rand() * w - length * 0.4;
    ctx.strokeStyle = rand() > 0.34 ? `rgba(55,30,17,${0.045 + rand() * 0.27})` : "rgba(233,183,122,0.14)";
    ctx.lineWidth = 0.35 + rand() * 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + length * 0.3, y + wave, x + length * 0.65, y - wave, x + length, y + wave * 0.35);
    ctx.stroke();
  }
};

const weave: Draw = (ctx, w, h) => {
  ctx.fillStyle = "#a19a8f";
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 4) {
    ctx.fillStyle = "rgba(29,25,23,0.32)";
    ctx.fillRect(0, y, w, 1);
  }
  for (let x = 0; x < w; x += 4) {
    ctx.fillStyle = "rgba(230,220,206,0.19)";
    ctx.fillRect(x, 0, 1, h);
  }
};

const Finishes = createContext<{ wood: CanvasTexture; fabric: CanvasTexture } | null>(null);

export function StudioFinishes({ children }: { children: ReactNode }) {
  const wood = useCanvasTexture(512, 256, walnut);
  const fabric = useCanvasTexture(128, 128, weave);
  return <Finishes value={{ wood, fabric }}>{children}</Finishes>;
}

export function useStudioFinishes() {
  const finishes = useContext(Finishes);
  if (!finishes) throw new Error("Materiali dello Studio non disponibili");
  return finishes;
}

export function SoftBox({
  size, position, rotation, color, radius = 0.007, roughness = 0.65, metalness = 0, map, shadow = false,
}: {
  size: Vec3; position?: Vec3; rotation?: Vec3; color: string; radius?: number;
  roughness?: number; metalness?: number; map?: CanvasTexture; shadow?: boolean;
}) {
  return (
    <RoundedBox
      args={[...size]} position={position && [...position]} rotation={rotation && [...rotation]}
      radius={Math.min(radius, Math.min(...size) * 0.48)} smoothness={2} castShadow={shadow} receiveShadow={shadow}
    >
      <meshStandardMaterial
        color={color} map={map} roughness={roughness} metalness={metalness}
        bumpMap={map} bumpScale={map ? 0.0007 : 0}
      />
    </RoundedBox>
  );
}
