"use client";

import { proxied } from "@/lib/live/image";
import { useLive } from "@/lib/live/useLive";
import { ROOM } from "../objects/Room";
import { SoftBox, useStudioFinishes } from "./StudioFinishes";
import { useCanvasTexture } from "../textures";
import { drawPosterPlaceholder } from "./studio-textures";
import { useRemoteTexture } from "./useRemoteTexture";

const POSTER_W = 0.26;
const POSTER_H = 0.38;
const POSTER_Y = 1.68;
const POSTER_XS = [0.76, 1.06, 1.36] as const;

function Poster({ index, url, x }: { index: number; url: string | null; x: number }) {
  const remote = useRemoteTexture(url ? proxied(url, 384) : null);
  const placeholder = useCanvasTexture(256, 384, drawPosterPlaceholder(index));
  const { wood } = useStudioFinishes();
  return (
    <group position={[x, POSTER_Y, ROOM.backZ + 0.018]} rotation={[0, 0, (index - 1) * 0.006]}>
      <SoftBox size={[POSTER_W + 0.034, POSTER_H + 0.038, 0.023]} color="#726258" radius={0.004} map={wood} shadow />
      <SoftBox size={[POSTER_W + 0.019, POSTER_H + 0.023, 0.004]} position={[0, 0, 0.011]} color="#c9b493" radius={0.001} />
      <mesh position={[0, 0, 0.0135]}>
        <planeGeometry args={[POSTER_W, POSTER_H]} />
        <meshStandardMaterial map={remote ?? placeholder} roughness={0.81} />
      </mesh>
    </group>
  );
}

/** Tre locandine sopra il giradischi: gli ultimi film visti su Letterboxd. */
export default function Posters() {
  const letterboxd = useLive("letterboxd");
  const films = letterboxd?.data?.films ?? [];
  return (
    <group>
      <SoftBox size={[0.42, 0.012, 0.038]} position={[1.06, 1.935, ROOM.backZ + 0.041]} color="#827057" metalness={0.64} roughness={0.43} />
      {POSTER_XS.map((x, i) => (
        <Poster key={x} index={i} x={x} url={films[i]?.posterUrl ?? null} />
      ))}
    </group>
  );
}
