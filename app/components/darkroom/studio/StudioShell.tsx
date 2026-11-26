"use client";

import { Vector2 } from "three";
import { ROOM } from "../objects/Room";
import { drawPlaster, useCanvasTexture } from "../textures";
import { drawParquet, drawRug } from "./studio-textures";
import { useDimmedEmissive } from "./useSafelightMix";

const DEPTH = ROOM.frontZ - ROOM.backZ;
const WIDTH = ROOM.maxX - ROOM.minX;
const CENTER_Z = (ROOM.frontZ + ROOM.backZ) / 2;
const BASEBOARD = 0.09;
const SHADE = [
  [0.035, 0.083], [0.045, 0.075], [0.062, 0.059], [0.085, 0.041],
  [0.114, 0.015], [0.151, -0.017], [0.185, -0.044], [0.197, -0.05], [0.2, -0.056],
].map(([radius, height]) => new Vector2(radius, height));

/** Pareti, pavimento in parquet, tappeto e lampada a sospensione dello studio. */
export default function StudioShell() {
  const plaster = useCanvasTexture(512, 512, drawPlaster, [3, 1.5]);
  const parquet = useCanvasTexture(512, 512, drawParquet, [WIDTH / 1.6, DEPTH / 1.6]);
  const rug = useCanvasTexture(512, 512, drawRug);
  // La sospensione si spegne quando si accende la luce rossa.
  const bulb = useDimmedEmissive({ color: "#f4daba", emissive: "#ffd8ae", base: 0.78, keep: 0.02 });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, CENTER_Z]} receiveShadow>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial map={parquet} roughness={0.42} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.5]} receiveShadow>
        <planeGeometry args={[2.8, 1.9]} />
        <meshStandardMaterial map={rug} roughness={0.95} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, CENTER_Z]}>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial color="#1e1916" roughness={1} />
      </mesh>

      <mesh position={[0, ROOM.height / 2, ROOM.backZ]} receiveShadow>
        <planeGeometry args={[WIDTH, ROOM.height]} />
        <meshStandardMaterial map={plaster} color="#e6cfb2" roughness={0.95} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh
            position={[side * ROOM.maxX, ROOM.height / 2, CENTER_Z]}
            rotation={[0, -side * (Math.PI / 2), 0]}
            receiveShadow
          >
            <planeGeometry args={[DEPTH, ROOM.height]} />
            <meshStandardMaterial map={plaster} color="#e6cfb2" roughness={0.95} />
          </mesh>
          <mesh position={[side * (ROOM.maxX - 0.006), BASEBOARD / 2, CENTER_Z]} rotation={[0, -side * (Math.PI / 2), 0]}>
            <planeGeometry args={[DEPTH, BASEBOARD]} />
            <meshStandardMaterial color="#2b1d15" roughness={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, BASEBOARD / 2, ROOM.backZ + 0.006]}>
        <planeGeometry args={[WIDTH, BASEBOARD]} />
        <meshStandardMaterial color="#2b1d15" roughness={0.6} />
      </mesh>

      {/* Lampada a sospensione: la sorgente visibile della luce principale */}
      <group position={[0, ROOM.height, 0.6]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.5, 6]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, -0.472, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.042, 24]} />
          <meshStandardMaterial color="#887361" metalness={0.59} roughness={0.39} />
        </mesh>
        <mesh position={[0, -0.563, 0]} castShadow>
          <latheGeometry args={[SHADE, 36]} />
          <meshStandardMaterial color="#394e49" metalness={0.33} roughness={0.39} side={2} />
        </mesh>
        <mesh position={[0, -0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.195, 0.0036, 8, 36]} />
          <meshStandardMaterial color="#887361" metalness={0.57} roughness={0.39} />
        </mesh>
        <mesh position={[0, -0.617, 0]} rotation={[Math.PI / 2, 0, 0]} material={bulb}>
          <circleGeometry args={[0.19, 36]} />
        </mesh>
      </group>
    </group>
  );
}
