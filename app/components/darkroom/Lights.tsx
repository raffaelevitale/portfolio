"use client";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getHotspot } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";

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
