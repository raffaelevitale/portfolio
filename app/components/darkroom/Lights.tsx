"use client";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getHotspot } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";

/** Sopra le bacinelle, spostata a destra per lasciare l'angolo alla porta girevole. */
export const SAFELIGHT_POSITION: [number, number, number] = [-1.05, 2.42, -1.86];
/** Seconda luce di sicurezza, a parete sopra il bancone destro. */
export const RIGHT_SAFELIGHT_POSITION: [number, number, number] = [2.48, 2.35, 0.05];

/** La luce di sicurezza rossa domina; il tavolo luminoso è l'unica sorgente fredda. */
export default function Lights() {
  const safelightTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0.5, 0.5, -0.3);
    return o;
  }, []);
  const rightTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(2.2, 0.9, 0.1);
    return o;
  }, []);

  return (
    <>
      <ambientLight intensity={0.32} color="#ffd2c4" />
      <primitive object={safelightTarget} />
      <spotLight
        position={SAFELIGHT_POSITION}
        target={safelightTarget}
        angle={1.1}
        penumbra={0.9}
        intensity={42}
        distance={10}
        decay={2}
        color="#ff2b12"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <pointLight position={[-1.05, 2.3, -1.7]} intensity={2.2} distance={2.2} decay={2} color="#ff2a10" />
      <primitive object={rightTarget} />
      <spotLight
        position={RIGHT_SAFELIGHT_POSITION}
        target={rightTarget}
        angle={0.95}
        penumbra={0.9}
        intensity={16}
        distance={5}
        decay={2}
        color="#ff3418"
      />
      <pointLight position={[1.7, 2.5, 1.1]} intensity={5} distance={6} decay={2} color="#ff3a20" />
      <pointLight position={[0, 2.3, 3.4]} intensity={2.4} distance={7} decay={2} color="#ff7056" />
      <pointLight position={[-1.85, 1.32, 0.22]} intensity={2.6} distance={2.4} decay={2} color="#e4ecff" />
    </>
  );
}

/** Una sola luce che segue l'oggetto sotto il puntatore: il numero di luci resta costante. */
export function HoverLight() {
  const ref = useRef<THREE.PointLight>(null);
  const goal = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const light = ref.current;
    if (!light) return;
    const hovered = useDarkroom.getState().hovered;
    if (hovered) {
      const [x, y, z] = getHotspot(hovered).pose.target;
      goal.set(x, y + 0.45, z);
      if (light.intensity < 0.05) light.position.copy(goal);
      easing.damp3(light.position, goal, 0.15, dt);
    }
    easing.damp(light, "intensity", hovered ? 2.6 : 0, 0.18, dt);
  });

  return <pointLight ref={ref} intensity={0} distance={1.8} decay={2} color="#ffc4aa" />;
}
