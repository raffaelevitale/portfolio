"use client";

import { drawEnvelope, useCanvasTexture } from "../textures";
import { BENCH_TOP_Y } from "./Room";

/** Busta di carta kraft sul bancone destro, orientata verso la posa "cv". */
export default function Envelope() {
  const kraft = useCanvasTexture(768, 512, drawEnvelope);

  return (
    <group position={[2.08, BENCH_TOP_Y, 0.45]} rotation={[0, -0.85, 0]}>
      {/* Fogli del CV sotto la busta */}
      <mesh position={[0.03, 0.003, -0.03]} rotation={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.21, 0.004, 0.297]} />
        <meshStandardMaterial color="#e9e4da" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.009, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.006, 0.2]} />
        <meshStandardMaterial color="#a57d50" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.0125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial map={kraft} roughness={0.9} />
      </mesh>
      {/* Matita */}
      <mesh position={[0.02, 0.018, 0.13]} rotation={[0, 0.3, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.004, 0.004, 0.17, 6]} />
        <meshStandardMaterial color="#c99a2e" roughness={0.6} />
      </mesh>
    </group>
  );
}
