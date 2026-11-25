"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { PROCESS, type ProcessStep } from "@/lib/content";
import { drawTrayLabel, useCanvasTexture } from "../textures";
import { useReducedMotion } from "../useReducedMotion";
import { BENCH_TOP_Y } from "./Room";

const TRAY_W = 0.4;
const TRAY_D = 0.5;
const TRAY_H = 0.07;
const WALL = 0.012;
const TRAY_Z = -1.6;
const TRAY_COLORS = ["#d9d3c6", "#8a1c15", "#262423", "#d9d3c6"] as const;

interface TrayProps {
  step: ProcessStep;
  index: number;
}

function Tray({ step, index }: TrayProps) {
  const label = useCanvasTexture(512, 128, drawTrayLabel(step.step, step.bath));
  const liquid = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();
  const x = -1.08 + index * 0.72;
  const color = TRAY_COLORS[index];
  const liquidColor = new THREE.Color(step.tint).multiplyScalar(0.28);

  useFrame(({ clock, frameloop }) => {
    if (!liquid.current || reduced || frameloop === "demand") return;
    liquid.current.position.y = TRAY_H * 0.62 + Math.sin(clock.elapsedTime * 1.4 + index) * 0.0012;
  });

  const walls: Array<{ pos: [number, number, number]; size: [number, number, number] }> = [
    { pos: [0, WALL / 2, 0], size: [TRAY_W, WALL, TRAY_D] },
    { pos: [-(TRAY_W - WALL) / 2, TRAY_H / 2, 0], size: [WALL, TRAY_H, TRAY_D] },
    { pos: [(TRAY_W - WALL) / 2, TRAY_H / 2, 0], size: [WALL, TRAY_H, TRAY_D] },
    { pos: [0, TRAY_H / 2, -(TRAY_D - WALL) / 2], size: [TRAY_W, TRAY_H, WALL] },
    { pos: [0, TRAY_H / 2, (TRAY_D - WALL) / 2], size: [TRAY_W, TRAY_H, WALL] },
  ];

  return (
    <group position={[x, BENCH_TOP_Y, TRAY_Z]} rotation={[0, (index - 1.5) * 0.025, 0]}>
      {walls.map((w, i) => (
        <mesh key={i} position={w.pos} castShadow receiveShadow>
          <boxGeometry args={w.size} />
          <meshStandardMaterial color={color} roughness={0.35} />
        </mesh>
      ))}
      <mesh ref={liquid} rotation={[-Math.PI / 2, 0, 0]} position={[0, TRAY_H * 0.62, 0]}>
        <planeGeometry args={[TRAY_W - WALL * 2, TRAY_D - WALL * 2]} />
        <meshStandardMaterial color={liquidColor} roughness={0.04} metalness={0.1} transparent opacity={0.92} />
      </mesh>
      {index === 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0.12]} position={[0.01, TRAY_H * 0.45, 0.02]}>
          <planeGeometry args={[0.24, 0.3]} />
          <meshStandardMaterial color="#8d8478" roughness={0.6} />
        </mesh>
      )}
      {index === 1 &&
        [-0.012, 0.012].map((dx) => (
          <mesh key={dx} position={[0.1 + dx, TRAY_H + 0.008, 0.05]} rotation={[0, 0.5, 0.1]} castShadow>
            <boxGeometry args={[0.012, 0.008, 0.24]} />
            <meshStandardMaterial color="#b99568" roughness={0.6} />
          </mesh>
        ))}
      <mesh position={[0, TRAY_H * 0.5, TRAY_D / 2 + 0.0015]}>
        <planeGeometry args={[0.26, 0.065]} />
        <meshStandardMaterial map={label} roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function Trays() {
  return (
    <group>
      {PROCESS.map((step, i) => (
        <Tray key={step.step} step={step} index={i} />
      ))}
    </group>
  );
}
