"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { drawNegatives } from "../prints";
import { drawTrayLabel, useCanvasTexture } from "../textures";
import { drawSign } from "./studio-textures";
import { useSafelightMix } from "./useSafelightMix";

/**
 * L'angolo della camera oscura, in fondo a destra: bancone nero, tavolo luminoso con i negativi
 * (servizi e processo), una bacinella, la luce di sicurezza e l'insegna "IN USO".
 * Quando la luce di sicurezza è accesa, è questo angolo a illuminare di rosso tutto lo studio.
 */
const BENCH = { x: 2.075, z: -1.69, w: 1.05, d: 0.62, h: 0.88 } as const;
const TOP = BENCH.h + 0.04;
const LAMP: readonly [number, number, number] = [2.53, 2.02, -1.62];
const SAFE_RED = "#ff2a10";

function Bench() {
  return (
    <group position={[BENCH.x, 0, BENCH.z]}>
      <mesh position={[0, BENCH.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[BENCH.w - 0.04, BENCH.h, BENCH.d - 0.04]} />
        <meshStandardMaterial color="#1c1918" roughness={0.75} />
      </mesh>
      <mesh position={[0, BENCH.h + 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[BENCH.w, 0.04, BENCH.d]} />
        <meshStandardMaterial color="#2b2725" roughness={0.4} />
      </mesh>
      {[-0.26, 0.26].map((dx) => (
        <mesh key={dx} position={[dx, 0.62, BENCH.d / 2 - 0.015]}>
          <boxGeometry args={[0.12, 0.012, 0.012]} />
          <meshStandardMaterial color="#8d8a86" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

/** Tavolo luminoso inclinato verso la stanza: i servizi sono fotogrammi su due strisce di negativo. */
function LightTable() {
  const negatives = useCanvasTexture(1280, 960, drawNegatives);
  return (
    <group position={[1.86, TOP + 0.035, -1.66]} rotation={[0.14, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.07, 0.46]} />
        <meshStandardMaterial color="#cfccc4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.0355, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.56, 0.42]} />
        <meshStandardMaterial map={negatives} emissiveMap={negatives} emissive="#ffffff" emissiveIntensity={0.42} roughness={0.25} />
      </mesh>
      <group position={[0.22, 0.07, -0.14]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.026, 0.032, 0.06, 20, 1, true]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function Tray() {
  const label = useCanvasTexture(512, 128, drawTrayLabel("01", "Sviluppo"));
  const walls: Array<{ pos: [number, number, number]; size: [number, number, number] }> = [
    { pos: [0, 0.005, 0], size: [0.28, 0.01, 0.36] },
    { pos: [-0.135, 0.03, 0], size: [0.01, 0.06, 0.36] },
    { pos: [0.135, 0.03, 0], size: [0.01, 0.06, 0.36] },
    { pos: [0, 0.03, -0.175], size: [0.28, 0.06, 0.01] },
    { pos: [0, 0.03, 0.175], size: [0.28, 0.06, 0.01] },
  ];
  return (
    <group position={[2.36, TOP, -1.6]} rotation={[0, -0.06, 0]}>
      {walls.map((w, i) => (
        <mesh key={i} position={w.pos} castShadow receiveShadow>
          <boxGeometry args={w.size} />
          <meshStandardMaterial color="#d9d3c6" roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.038, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.26, 0.34]} />
        <meshStandardMaterial color="#3a3224" roughness={0.04} metalness={0.1} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.03, 0.1815]}>
        <planeGeometry args={[0.2, 0.05]} />
        <meshStandardMaterial map={label} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Bottles() {
  return (
    <group position={[2.36, TOP, -1.9]}>
      {[-0.08, 0.06].map((dx, i) => (
        <group key={dx} position={[dx, 0, 0]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.04, 0.2, 20]} />
            <meshStandardMaterial color="#5c2a08" roughness={0.12} transparent opacity={0.88} />
          </mesh>
          <mesh position={[0, 0.215, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.03, 12]} />
            <meshStandardMaterial color={i === 0 ? "#111" : "#3d1d10"} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Lampada di sicurezza a parete, l'insegna "IN USO" e le luci rosse che sfumano con l'interruttore. */
export function CornerSafelight() {
  const mix = useSafelightMix();
  const glass = useRef<THREE.MeshStandardMaterial>(null);
  const signGlow = useRef<THREE.MeshStandardMaterial>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const sign = useCanvasTexture(512, 128, drawSign("IN USO", "#ff5a43"));
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(1.4, 0.5, -0.8);
    return o;
  }, []);

  useFrame(() => {
    const m = mix.current;
    if (glass.current) glass.current.emissiveIntensity = 0.12 + m * 1.7;
    if (signGlow.current) signGlow.current.emissiveIntensity = 0.04 + m * 1.1;
    if (spot.current) spot.current.intensity = m * 30;
    if (fill.current) fill.current.intensity = m * 7;
  });

  return (
    <>
      {/* Inclinata verso il basso: la luce cade sul bancone e sulla stanza */}
      <group position={[...LAMP]} rotation={[0, 0, 0.45]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.2, 0.26]} />
          <meshStandardMaterial color="#1b1a19" metalness={0.6} roughness={0.45} />
        </mesh>
        <mesh position={[-0.061, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.21, 0.15]} />
          <meshStandardMaterial ref={glass} color="#3a0402" emissive={SAFE_RED} emissiveIntensity={0.12} />
        </mesh>
      </group>
      <group position={[2.08, 2.28, -1.985]}>
        <mesh>
          <boxGeometry args={[0.46, 0.14, 0.03]} />
          <meshStandardMaterial color="#0c0a09" />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[0.44, 0.11]} />
          <meshStandardMaterial ref={signGlow} map={sign} emissiveMap={sign} emissive="#ffffff" emissiveIntensity={0.04} />
        </mesh>
      </group>
      <primitive object={target} />
      <spotLight
        ref={spot}
        position={[2.42, 1.98, -1.62]}
        target={target}
        angle={1.15}
        penumbra={0.9}
        intensity={0}
        distance={9}
        decay={2}
        color={SAFE_RED}
      />
      <pointLight ref={fill} position={[0.2, 2.4, 1.0]} intensity={0} distance={8} decay={2} color="#ff3a20" />
    </>
  );
}

export default function DarkroomCorner() {
  return (
    <group>
      <Bench />
      <LightTable />
      <Tray />
      <Bottles />
    </group>
  );
}
