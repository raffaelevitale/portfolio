"use client";

import type { GithubData } from "@/lib/live/types";
import { ROOM } from "../objects/Room";
import { useCanvasTexture } from "../textures";
import { drawContributionPrint, drawOrarioScreen, drawPostIt } from "./desk-textures";
import { SoftBox } from "./StudioFinishes";
import { useLiveCanvasTexture } from "./studio-textures";

const DESK_TOP = 0.74;
const CHARCOAL = "#24282b";
/** Apertura dello schermo del portatile, misurata dalla tastiera. */
const LID_ANGLE = 1.78;

/** Il portatile aperto su orario.vallauri.edu, girato verso chi guarda la scrivania. */
export function Laptop() {
  const screen = useCanvasTexture(640, 400, drawOrarioScreen);
  return (
    <group position={[-2.44, DESK_TOP, -0.08]} rotation={[0, 0.25, 0]}>
      <SoftBox position={[0, 0.006, 0]} size={[0.21, 0.012, 0.3]} color="#9a9d9f" metalness={0.6} roughness={0.38} radius={0.004} shadow />
      <SoftBox position={[0.015, 0.0125, 0]} size={[0.1, 0.002, 0.26]} color="#2b2e31" radius={0.001} />
      <SoftBox position={[0.08, 0.0125, 0]} size={[0.045, 0.001, 0.09]} color="#8a8d8f" metalness={0.5} radius={0.001} />
      <group position={[-0.105, 0.012, 0]} rotation={[0, 0, LID_ANGLE]}>
        <SoftBox position={[0.105, 0.004, 0]} size={[0.21, 0.008, 0.3]} color="#9a9d9f" metalness={0.6} roughness={0.38} radius={0.004} shadow />
        <mesh position={[0.107, -0.0005, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
          <planeGeometry args={[0.27, 0.172]} />
          <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={0.5} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/** Una reflex a pellicola appoggiata sul tavolo, con un rullino e una striscia di negativi. */
export function FilmCamera() {
  return (
    <group position={[-2.02, DESK_TOP, -0.9]} rotation={[0, -0.4, 0]}>
      <SoftBox position={[0, 0.045, 0]} size={[0.055, 0.075, 0.14]} color="#171716" radius={0.008} shadow />
      <SoftBox position={[0, 0.087, 0]} size={[0.056, 0.012, 0.142]} color="#c2bfb7" metalness={0.8} roughness={0.28} radius={0.004} />
      <SoftBox position={[0.002, 0.105, 0]} size={[0.045, 0.03, 0.05]} color="#1d1d1c" radius={0.006} />
      <mesh position={[0.05, 0.043, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.026, 0.028, 0.05, 28]} />
        <meshStandardMaterial color="#1b1a19" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0.076, 0.043, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.019, 0.019, 0.003, 28]} />
        <meshPhysicalMaterial color="#2b3a44" metalness={0.2} roughness={0.05} clearcoat={1} />
      </mesh>
      {[-0.045, 0.045].map((z) => (
        <mesh key={z} position={[0, 0.097, z]}>
          <cylinderGeometry args={[0.011, 0.011, 0.008, 18]} />
          <meshStandardMaterial color="#cfccc4" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      <group position={[0.02, 0.013, 0.12]} rotation={[Math.PI / 2, 0, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.013, 0.013, 0.05, 20]} />
          <meshStandardMaterial color="#d9a531" roughness={0.5} />
        </mesh>
        {[-0.026, 0.026].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.0135, 0.0135, 0.004, 20]} />
            <meshStandardMaterial color="#1a1918" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
      </group>
      <SoftBox position={[0.075, 0.001, 0.09]} size={[0.035, 0.002, 0.16]} rotation={[0, -0.3, 0]} color="#3a2a1d" radius={0.0005} />
    </group>
  );
}

interface Note {
  color: string;
  lines: readonly string[];
  seed: number;
  position: readonly [number, number, number];
  rotation: number;
}

const NOTES: readonly [Note, Note] = [
  { color: "#f3d36b", lines: ["commit", "piccoli"], seed: 3, position: [0.29, -0.155, 0.0262], rotation: 0.08 },
  { color: "#f2a7a0", lines: ["venerdì:", "no deploy"], seed: 5, position: [0.235, -0.175, 0.0266], rotation: -0.06 },
];

/** Due post-it attaccati all'angolo del monitor (coordinate del pannello del monitor). */
export function PostIts() {
  const first = useCanvasTexture(128, 128, drawPostIt(NOTES[0].color, NOTES[0].lines, NOTES[0].seed));
  const second = useCanvasTexture(128, 128, drawPostIt(NOTES[1].color, NOTES[1].lines, NOTES[1].seed));
  return (
    <>
      {[first, second].map((map, i) => (
        <mesh key={NOTES[i].seed} position={[...NOTES[i].position]} rotation={[0, 0, NOTES[i].rotation]}>
          <planeGeometry args={[0.068, 0.068]} />
          <meshStandardMaterial map={map} roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

const PRINT = { w: 0.62, h: 0.31, y: 1.93, z: -0.36 } as const;

/** Il grafico dei contributi GitHub stampato come un provino e appeso con due pinze sopra la mensola. */
export function ContributionPrint({ data, revision }: { data: GithubData | null; revision: string | undefined }) {
  const print = useLiveCanvasTexture(1024, 512, drawContributionPrint(data), [revision]);
  return (
    <group position={[ROOM.minX + 0.012, PRINT.y, PRINT.z]} rotation={[0, Math.PI / 2, 0.01]}>
      <mesh>
        <planeGeometry args={[PRINT.w, PRINT.h]} />
        <meshStandardMaterial map={print} roughness={0.85} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (PRINT.w / 2 - 0.07), PRINT.h / 2 - 0.01, 0.008]}>
          <SoftBox size={[0.04, 0.03, 0.01]} color={CHARCOAL} metalness={0.5} roughness={0.4} radius={0.002} />
          <mesh position={[0, 0.03, -0.002]}>
            <torusGeometry args={[0.012, 0.0015, 6, 16, Math.PI]} />
            <meshStandardMaterial color="#b9b6ae" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
