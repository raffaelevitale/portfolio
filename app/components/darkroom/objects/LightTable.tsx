"use client";

import { drawNegatives } from "../prints";
import { useCanvasTexture } from "../textures";
import { BENCH_TOP_Y } from "./Room";

/** Tavolo luminoso inclinato verso la stanza, con due strisce di negativo (i servizi). */
export default function LightTable() {
  const negatives = useCanvasTexture(1280, 960, drawNegatives);

  return (
    <group position={[-2.05, BENCH_TOP_Y + 0.04, 0.2]} rotation={[0, 0, -0.14]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.64, 0.08, 0.84]} />
        <meshStandardMaterial color="#cfccc4" roughness={0.5} />
      </mesh>
      {/* Il gruppo ruota la superficie così che il testo si legga dalla posa "servizi". */}
      <group position={[0, 0.0415, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.78, 0.585]} />
          <meshStandardMaterial
            map={negatives}
            emissiveMap={negatives}
            emissive="#ffffff"
            emissiveIntensity={0.42}
            roughness={0.25}
          />
        </mesh>
      </group>
      {/* Lentino */}
      <group position={[0.12, 0.075, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.036, 0.07, 24, 1, true]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} side={2} />
        </mesh>
        <mesh position={[0, 0.036, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.004, 24]} />
          <meshStandardMaterial color="#cfe2ff" roughness={0.05} transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
}
