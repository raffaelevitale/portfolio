"use client";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
import * as THREE from "three";
import { useDarkroom } from "@/lib/darkroom/store";
import { drawSign } from "../studio/studio-textures";
import { useCanvasTexture } from "../textures";
import { useReducedMotion } from "../useReducedMotion";

const RADIUS = 0.52;
const HEIGHT = 2.15;
const OPENING = 1.75;

interface RevolvingDoorProps {
  x: number;
  z: number;
  /** Direzione dell'apertura, in radianti attorno a y (0 = verso +z). */
  facing: number;
  sign: string;
  signColor: string;
  /** Il colore della luce che filtra dall'altra stanza. */
  leak: string;
  hotspotId: "porta-studio" | "porta-camera";
}

/**
 * La porta girevole a tenuta di luce delle camere oscure: un cilindro con un'apertura,
 * e dentro un tamburo che ruota. È il passaggio tra la camera oscura e lo studio.
 */
export default function RevolvingDoor({ x, z, facing, sign, signColor, leak, hotspotId }: RevolvingDoorProps) {
  const drum = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const signTexture = useCanvasTexture(512, 128, drawSign(sign, signColor));

  useFrame(({ frameloop, invalidate }, dt) => {
    if (!drum.current || reduced) return;
    const { hovered, focus } = useDarkroom.getState();
    const active = hovered === hotspotId || focus === hotspotId;
    const angle = active ? -1.2 : 0;
    easing.damp(drum.current.rotation, "y", angle, 0.6, frameloop === "demand" ? Math.min(dt, 0.05) : dt);
    if (frameloop === "demand" && Math.abs(drum.current.rotation.y - angle) > 0.005) invalidate();
  });

  return (
    <group position={[x, 0, z]} rotation={[0, facing, 0]}>
      <mesh position={[0, HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, 48, 1, true, OPENING / 2, Math.PI * 2 - OPENING]} />
        <meshStandardMaterial color="#161514" metalness={0.35} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, HEIGHT + 0.03, 0]} castShadow>
        <cylinderGeometry args={[RADIUS + 0.04, RADIUS + 0.04, 0.06, 48]} />
        <meshStandardMaterial color="#1d1b1a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Tamburo interno: ruota quando ci si avvicina */}
      <group ref={drum}>
        <mesh position={[0, HEIGHT / 2, 0]}>
          <cylinderGeometry args={[RADIUS - 0.06, RADIUS - 0.06, HEIGHT - 0.04, 40, 1, true, Math.PI - 0.5, 1]} />
          <meshStandardMaterial color="#0b0a0a" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, HEIGHT / 2, -RADIUS + 0.12]}>
          <planeGeometry args={[0.5, HEIGHT - 0.2]} />
          <meshStandardMaterial color="#000" emissive={leak} emissiveIntensity={0.2} />
        </mesh>
      </group>
      {/* Maniglia sul bordo dell'apertura */}
      <mesh position={[Math.sin(OPENING / 2) * (RADIUS + 0.02), 1.05, Math.cos(OPENING / 2) * (RADIUS + 0.02)]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 12]} />
        <meshStandardMaterial color="#b9b6b0" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Insegna luminosa */}
      <group position={[0, HEIGHT + 0.22, RADIUS - 0.1]}>
        <mesh>
          <boxGeometry args={[0.42, 0.13, 0.04]} />
          <meshStandardMaterial color="#0c0a09" />
        </mesh>
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[0.4, 0.1]} />
          <meshStandardMaterial map={signTexture} emissiveMap={signTexture} emissive="#ffffff" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </group>
  );
}
