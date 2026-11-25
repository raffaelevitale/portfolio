"use client";

import { drawFloor, drawPlaster, useCanvasTexture } from "../textures";

/**
 * Pianta della stanza (metri):
 *   x  -2.6 … 2.6   (parete sinistra … parete destra)
 *   z  -2.0 … 6.5   (parete di fondo … dietro la camera)
 *   y   0   … 2.85
 * Banconi: fondo (bagni e stampe), sinistra (ingranditore e tavolo luminoso), destra (busta e mensola).
 */
export const ROOM = { minX: -2.6, maxX: 2.6, backZ: -2, frontZ: 6.5, height: 2.85 } as const;
export const BENCH_TOP_Y = 0.92;

const BODY_HEIGHT = 0.88;
const WAINSCOT_HEIGHT = 1.02;
const DEPTH = ROOM.frontZ - ROOM.backZ;
const WIDTH = ROOM.maxX - ROOM.minX;
const CENTER_Z = (ROOM.frontZ + ROOM.backZ) / 2;

interface BenchProps {
  x: number;
  z: number;
  width: number;
  depth: number;
}

function Bench({ x, z, width, depth }: BenchProps) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, BODY_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.05, BODY_HEIGHT, depth - 0.05]} />
        <meshStandardMaterial color="#231b17" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width - 0.02, 0.1, depth - 0.02]} />
        <meshStandardMaterial color="#0d0b0a" roughness={0.9} />
      </mesh>
      <mesh position={[0, BENCH_TOP_Y - 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.04, depth]} />
        <meshStandardMaterial color="#3d2f28" roughness={0.42} />
      </mesh>
    </group>
  );
}

export default function Room() {
  const plaster = useCanvasTexture(512, 512, drawPlaster, [3, 1.5]);
  const floor = useCanvasTexture(256, 256, drawFloor, [WIDTH / 1, DEPTH / 1]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, CENTER_Z]} receiveShadow>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial map={floor} roughness={0.32} metalness={0.05} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, CENTER_Z]}>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial color="#120e0d" roughness={1} />
      </mesh>

      {/* Parete di fondo */}
      <mesh position={[0, ROOM.height / 2, ROOM.backZ]} receiveShadow>
        <planeGeometry args={[WIDTH, ROOM.height]} />
        <meshStandardMaterial map={plaster} roughness={0.95} />
      </mesh>
      <mesh position={[0, WAINSCOT_HEIGHT / 2, ROOM.backZ + 0.004]} receiveShadow>
        <planeGeometry args={[WIDTH, WAINSCOT_HEIGHT]} />
        <meshStandardMaterial color="#121010" roughness={0.7} />
      </mesh>

      {/* Pareti laterali */}
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh
            position={[side * ROOM.maxX, ROOM.height / 2, CENTER_Z]}
            rotation={[0, -side * (Math.PI / 2), 0]}
            receiveShadow
          >
            <planeGeometry args={[DEPTH, ROOM.height]} />
            <meshStandardMaterial map={plaster} roughness={0.95} />
          </mesh>
          <mesh
            position={[side * (ROOM.maxX - 0.004), WAINSCOT_HEIGHT / 2, CENTER_Z]}
            rotation={[0, -side * (Math.PI / 2), 0]}
            receiveShadow
          >
            <planeGeometry args={[DEPTH, WAINSCOT_HEIGHT]} />
            <meshStandardMaterial color="#121010" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Il bancone di fondo lascia libero l'angolo sinistro alla porta girevole. */}
      <Bench x={0.15} z={-1.63} width={3.2} depth={0.72} />
      <Bench x={-2.22} z={-0.15} width={0.72} depth={2.1} />
      <Bench x={2.22} z={-0.22} width={0.72} depth={1.96} />
    </group>
  );
}
