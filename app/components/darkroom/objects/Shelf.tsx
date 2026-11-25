"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PERSON } from "@/lib/content";
import { drawCaption, useCanvasTexture } from "../textures";

const SHELF_X = 2.44;
const SHELF_Y = 1.55;
const SHELF_Z = -0.45;
const CANISTER_BANDS = ["#c8281e", "#e2b13c", "#2d5d8a", "#e9e2d3"] as const;

/** Macchina a telemetro vista di tre quarti, con l'obiettivo rivolto verso la stanza. */
function Camera() {
  return (
    <group position={[SHELF_X - 0.02, SHELF_Y + 0.06, -0.78]} rotation={[0, -0.35, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.05, 0.085, 0.15]} />
        <meshStandardMaterial color="#141313" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.048, 0]} castShadow>
        <boxGeometry args={[0.052, 0.014, 0.152]} />
        <meshStandardMaterial color="#b8b5ae" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[-0.048, -0.004, 0.012]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.028, 0.03, 0.05, 32]} />
        <meshStandardMaterial color="#1c1b1a" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[-0.074, -0.004, 0.012]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.003, 32]} />
        <meshStandardMaterial color="#2a3550" metalness={0.9} roughness={0.05} />
      </mesh>
      {[0.05, -0.05].map((z) => (
        <mesh key={z} position={[-0.026, 0.028, z]}>
          <boxGeometry args={[0.002, 0.016, 0.022]} />
          <meshStandardMaterial color="#d8dde6" metalness={0.6} roughness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, 0.062, -0.045]}>
        <cylinderGeometry args={[0.012, 0.012, 0.012, 20]} />
        <meshStandardMaterial color="#b8b5ae" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Canisters() {
  return (
    <group position={[SHELF_X, SHELF_Y + 0.015, -0.3]}>
      {CANISTER_BANDS.map((band, i) => (
        <group key={band} position={[(i % 2) * 0.03 - 0.02, 0.026, i * 0.045]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.052, 20]} />
            <meshStandardMaterial color="#2b2b2b" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.0165, 0.0165, 0.028, 20]} />
            <meshStandardMaterial color={band} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Polaroid() {
  const portrait = useTexture(PERSON.portrait);
  portrait.colorSpace = THREE.SRGBColorSpace;
  const caption = useCanvasTexture(512, 128, drawCaption("Raffaele, 2026", "AUTORITRATTO"));

  return (
    <group position={[2.57, 1.46, 0.36]} rotation={[0, -Math.PI / 2, 0.06]}>
      <mesh castShadow>
        <boxGeometry args={[0.17, 0.205, 0.003]} />
        <meshStandardMaterial color="#efeae0" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0.0018]}>
        <planeGeometry args={[0.15, 0.15]} />
        <meshStandardMaterial map={portrait} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.073, 0.0018]}>
        <planeGeometry args={[0.15, 0.0375]} />
        <meshStandardMaterial map={caption} transparent roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.088, 0.008]}>
        <sphereGeometry args={[0.008, 12, 12]} />
        <meshStandardMaterial color="#c8281e" roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function Shelf() {
  return (
    <group>
      <mesh position={[SHELF_X, SHELF_Y, SHELF_Z]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.03, 1.1]} />
        <meshStandardMaterial color="#3d2f28" roughness={0.5} />
      </mesh>
      {[-0.4, 0.4].map((dz) => (
        <mesh key={dz} position={[SHELF_X + 0.06, SHELF_Y - 0.08, SHELF_Z + dz]}>
          <boxGeometry args={[0.16, 0.13, 0.02]} />
          <meshStandardMaterial color="#1a1716" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      <Camera />
      <Canisters />
      {/* Pila di libri fotografici */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[SHELF_X, SHELF_Y + 0.025 + i * 0.022, -0.02]} rotation={[0, i * 0.12, 0]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.15]} />
          <meshStandardMaterial color={["#5a1d17", "#d6cdbb", "#1b1b1b"][i]} roughness={0.7} />
        </mesh>
      ))}
      {/* Bacheca in sughero */}
      <mesh position={[2.588, 1.48, 0.42]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[0.55, 0.42, 0.02]} />
        <meshStandardMaterial color="#8a6a48" roughness={1} />
      </mesh>
      <Polaroid />
      {[
        { z: 0.6, y: 1.55, r: -0.08 },
        { z: 0.58, y: 1.36, r: 0.05 },
      ].map((p) => (
        <mesh key={p.z + p.y} position={[2.575, p.y, p.z]} rotation={[0, -Math.PI / 2, p.r]}>
          <planeGeometry args={[0.1, 0.14]} />
          <meshStandardMaterial color="#d8d1c3" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
