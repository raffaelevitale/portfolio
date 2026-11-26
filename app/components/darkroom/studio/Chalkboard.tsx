"use client";

import { useLive } from "@/lib/live/useLive";
import { NOW, nowLines } from "@/lib/now";
import { ROOM } from "../objects/Room";
import { SoftBox, useStudioFinishes } from "./StudioFinishes";
import { useLiveCanvasTexture } from "./studio-textures";
import { drawChalkboard } from "./wall-textures";

/** Sulla parete sinistra, accanto al telefono e a due passi dalla scrivania. */
export const BOARD = { w: 0.52, h: 0.37, y: 1.42, z: 1.24 } as const;
const FRAME_WOOD = "#6b4a32";

/** La lavagnetta "Adesso": cosa sto facendo in questo periodo, più quello che sto ascoltando. */
export default function Chalkboard() {
  const { wood } = useStudioFinishes();
  const spotify = useLive("spotify");
  const lines = nowLines(spotify?.data);
  const slate = useLiveCanvasTexture(1024, 728, drawChalkboard(lines, NOW.updated), [lines.map((l) => l.text).join("|")]);

  return (
    <group position={[ROOM.minX + 0.012, BOARD.y, BOARD.z]} rotation={[0, Math.PI / 2, 0.012]}>
      <SoftBox size={[BOARD.w + 0.05, BOARD.h + 0.05, 0.022]} color={FRAME_WOOD} map={wood} radius={0.004} shadow />
      <mesh position={[0, 0, 0.0115]}>
        <planeGeometry args={[BOARD.w, BOARD.h]} />
        <meshStandardMaterial map={slate} roughness={0.95} />
      </mesh>
      {/* Mensolina con il gesso e il cancellino */}
      <SoftBox position={[0, -BOARD.h / 2 - 0.03, 0.022]} size={[BOARD.w * 0.8, 0.012, 0.04]} color={FRAME_WOOD} map={wood} radius={0.002} shadow />
      <mesh position={[0.12, -BOARD.h / 2 - 0.018, 0.03]} rotation={[0, 0, Math.PI / 2 + 0.2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.05, 8]} />
        <meshStandardMaterial color="#f1eee6" roughness={1} />
      </mesh>
      <SoftBox position={[-0.1, -BOARD.h / 2 - 0.006, 0.028]} size={[0.1, 0.03, 0.035]} color="#3a3330" radius={0.004} />
    </group>
  );
}
