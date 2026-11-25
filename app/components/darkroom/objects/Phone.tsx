"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

const IVORY = "#e3d6bd";
const DIAL_HOLES = 10;

/** Cavo a spirale dalla cornetta al corpo del telefono. */
function useCoiledCord(): THREE.TubeGeometry {
  return useMemo(() => {
    const base = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.115, -0.13, 0.06),
      new THREE.Vector3(-0.1, -0.32, 0.07),
      new THREE.Vector3(-0.02, -0.4, 0.08),
      new THREE.Vector3(0.03, -0.28, 0.07),
      new THREE.Vector3(0, -0.12, 0.05),
    ]);
    const turns = 26;
    const radius = 0.011;
    const points = Array.from({ length: 360 }, (_, i) => {
      const t = i / 359;
      const p = base.getPoint(t);
      const a = t * Math.PI * 2 * turns;
      return new THREE.Vector3(p.x + Math.cos(a) * radius, p.y, p.z + Math.sin(a) * radius);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 720, 0.0022, 5, false);
  }, []);
}

/** Telefono a muro con disco combinatore. Costruito rivolto verso +z, poi girato verso la stanza. */
export default function Phone() {
  const cord = useCoiledCord();

  return (
    <group position={[2.585, 1.38, 0.88]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0, 0.008]} receiveShadow>
        <boxGeometry args={[0.2, 0.32, 0.016]} />
        <meshStandardMaterial color="#2a211c" roughness={0.6} />
      </mesh>
      <RoundedBox args={[0.17, 0.23, 0.08]} radius={0.025} smoothness={4} position={[0, 0, 0.05]} castShadow>
        <meshStandardMaterial color={IVORY} roughness={0.3} />
      </RoundedBox>

      {/* Disco combinatore */}
      <group position={[0, -0.02, 0.092]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.058, 0.058, 0.008, 40]} />
          <meshStandardMaterial color="#c9c5bd" metalness={0.8} roughness={0.25} />
        </mesh>
        {Array.from({ length: DIAL_HOLES }, (_, i) => {
          const a = (i / DIAL_HOLES) * Math.PI * 1.6 + Math.PI * 0.75;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.04, 0.0045, Math.sin(a) * 0.04]}>
              <cylinderGeometry args={[0.0085, 0.0085, 0.002, 16]} />
              <meshStandardMaterial color="#1b1715" roughness={0.6} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.0045, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.002, 24]} />
          <meshStandardMaterial color="#f2ede3" roughness={0.6} />
        </mesh>
      </group>

      {/* Cornetta appesa al gancio laterale */}
      <group position={[-0.115, 0.02, 0.06]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.2, 16]} />
          <meshStandardMaterial color={IVORY} roughness={0.3} />
        </mesh>
        {[0.1, -0.1].map((y) => (
          <mesh key={y} position={[0, y, 0.012]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.026, 0.022, 0.03, 20]} />
            <meshStandardMaterial color={IVORY} roughness={0.3} />
          </mesh>
        ))}
      </group>
      <mesh geometry={cord} castShadow>
        <meshStandardMaterial color="#d8c9ad" roughness={0.4} />
      </mesh>

      {/* Biglietto appuntato accanto */}
      <mesh position={[0.17, -0.06, 0.004]} rotation={[0, 0, 0.07]}>
        <planeGeometry args={[0.09, 0.12]} />
        <meshStandardMaterial color="#e8dfc8" roughness={0.9} />
      </mesh>
    </group>
  );
}
