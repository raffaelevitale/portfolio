"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { RIGHT_SAFELIGHT_POSITION, SAFELIGHT_POSITION } from "../Lights";
import { drawPaperBox, drawTimerFace, useCanvasTexture } from "../textures";
import { useReducedMotion } from "../useReducedMotion";
import { BENCH_TOP_Y } from "./Room";

const CHROME = { color: "#b9b6b0", metalness: 0.9, roughness: 0.22 } as const;

function Safelight() {
  return (
    <group position={SAFELIGHT_POSITION} rotation={[0.45, 0.35, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.28, 0.2, 0.12]} />
        <meshStandardMaterial color="#1b1a19" metalness={0.6} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.061]}>
        <planeGeometry args={[0.23, 0.15]} />
        <meshStandardMaterial color="#3a0402" emissive="#ff1a08" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[0, 0.16, -0.04]}>
        <boxGeometry args={[0.03, 0.14, 0.03]} />
        <meshStandardMaterial color="#1b1a19" metalness={0.6} roughness={0.45} />
      </mesh>
    </group>
  );
}

/** Lampada rotonda a parete, inclinata verso il bancone destro. */
function RightSafelight() {
  return (
    <group position={RIGHT_SAFELIGHT_POSITION} rotation={[0, 0, -0.5]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.14, 32]} />
        <meshStandardMaterial color="#1b1a19" metalness={0.6} roughness={0.45} />
      </mesh>
      <mesh position={[-0.071, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.095, 32]} />
        <meshStandardMaterial color="#3a0402" emissive="#ff1a08" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

/** Timer da camera oscura con lancette che girano davvero. */
function Timer() {
  const face = useCanvasTexture(512, 512, drawTimerFace);
  const seconds = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  useFrame(({ clock, frameloop }) => {
    if (!seconds.current || reduced || frameloop === "demand") return;
    seconds.current.rotation.z = -(Math.floor(clock.elapsedTime) % 60) * ((Math.PI * 2) / 60);
  });

  return (
    <group position={[1.72, 2.18, -1.985]}>
      <mesh>
        <circleGeometry args={[0.16, 48]} />
        <meshStandardMaterial map={face} emissiveMap={face} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <torusGeometry args={[0.163, 0.012, 12, 48]} />
        <meshStandardMaterial color="#141312" metalness={0.5} roughness={0.4} />
      </mesh>
      <group ref={seconds} position={[0, 0, 0.01]}>
        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[0.006, 0.13, 0.002]} />
          <meshStandardMaterial color="#ff3b26" emissive="#ff3b26" emissiveIntensity={0.6} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.012]}>
        <circleGeometry args={[0.01, 16]} />
        <meshStandardMaterial color="#d9d4ca" />
      </mesh>
    </group>
  );
}

function Enlarger() {
  return (
    <group position={[-2.25, BENCH_TOP_Y, -0.82]}>
      <mesh position={[0, 0.0125, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.025, 0.56]} />
        <meshStandardMaterial color="#1c1a19" roughness={0.6} />
      </mesh>
      <mesh position={[0.06, 0.03, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.008, 0.36]} />
        <meshStandardMaterial color="#e7e2d8" roughness={0.8} />
      </mesh>
      <mesh position={[-0.2, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 1.05, 16]} />
        <meshStandardMaterial color="#5f5c58" metalness={0.7} roughness={0.45} />
      </mesh>
      <mesh position={[-0.09, 0.78, 0]} castShadow>
        <boxGeometry args={[0.24, 0.05, 0.07]} />
        <meshStandardMaterial color="#232120" roughness={0.5} />
      </mesh>
      <mesh position={[0.06, 0.8, 0]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.22]} />
        <meshStandardMaterial color="#2a2826" roughness={0.45} />
      </mesh>
      <mesh position={[0.06, 0.94, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.095, 0.13, 24]} />
        <meshStandardMaterial color="#2f2c29" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0.06, 0.67, 0]} castShadow>
        <boxGeometry args={[0.12, 0.11, 0.12]} />
        <meshStandardMaterial color="#0e0d0d" roughness={0.9} />
      </mesh>
      <mesh position={[0.06, 0.595, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.032, 0.05, 24]} />
        <meshStandardMaterial color="#121212" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}

function PaperBox() {
  const label = useCanvasTexture(512, 256, drawPaperBox);
  return (
    <group position={[2.2, BENCH_TOP_Y, -0.9]} rotation={[0, Math.PI / 2 + 0.1, 0]}>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.08, 0.26]} />
        <meshStandardMaterial color="#151312" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.0805, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.32, 0.16]} />
        <meshStandardMaterial map={label} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Bottles() {
  return (
    <group position={[1.46, BENCH_TOP_Y, -1.76]}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[(i - 1) * 0.12, 0, (i % 2) * 0.08]}>
          <mesh position={[0, 0.11, 0]} castShadow>
            <cylinderGeometry args={[0.048, 0.05, 0.22, 24]} />
            <meshStandardMaterial color="#5c2a08" roughness={0.12} transparent opacity={0.88} />
          </mesh>
          <mesh position={[0, 0.235, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.1, 0.049]}>
            <planeGeometry args={[0.06, 0.07]} />
            <meshStandardMaterial color="#e6dfcf" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Faucet() {
  return (
    <group position={[1.08, BENCH_TOP_Y, -1.95]}>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.34, 12]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[0, 0.34, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.22, 12]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[0, 0.31, 0.205]}>
        <cylinderGeometry args={[0.012, 0.009, 0.06, 12]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
    </group>
  );
}

/** Oggetti di scena non interattivi: danno credibilità alla stanza. */
export default function Props() {
  return (
    <group>
      <Safelight />
      <RightSafelight />
      <Timer />
      <Enlarger />
      <PaperBox />
      <Bottles />
      <Faucet />
    </group>
  );
}
