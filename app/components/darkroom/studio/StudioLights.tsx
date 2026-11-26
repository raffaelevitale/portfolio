"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSafelightMix } from "./useSafelightMix";

/**
 * Luci calde da sera: una sospensione che proietta le ombre, le strisce LED della libreria
 * e le sorgenti "pratiche" (lampada da scrivania, monitor, televisore, parete delle stampe).
 * Con la luce di sicurezza accesa ogni luce scende al proprio livello "rosso":
 * le lampade calde quasi si spengono, gli schermi restano accesi.
 */
interface Dimmable {
  light: THREE.Light;
  base: number;
  /** Frazione di intensità che resta con la luce di sicurezza accesa. */
  keep: number;
}

const WARM_KEEP = 0.08;
const SCREEN_KEEP = 0.85;

export default function StudioLights() {
  const mix = useSafelightMix();
  const lights = useRef(new Map<string, Dimmable>());

  // Ogni luce si registra con la sua intensità di base: il dimmer la scala ad ogni fotogramma.
  const dim = useCallback(
    (name: string, base: number, keep = WARM_KEEP) =>
      (light: THREE.Light | null) => {
        if (light) lights.current.set(name, { light, base, keep });
        else lights.current.delete(name);
      },
    [],
  );

  useFrame(() => {
    const m = mix.current;
    lights.current.forEach(({ light, base, keep }) => {
      light.intensity = base * (1 - (1 - keep) * m);
    });
  });

  const mainTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(-0.3, 0, -1.0);
    return o;
  }, []);
  const deskTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(-2.15, 0.74, -0.59);
    return o;
  }, []);

  return (
    <>
      <ambientLight ref={dim("ambient", 0.43, 0.3)} intensity={0.43} color="#ffe7d2" />
      <hemisphereLight ref={dim("hemi", 0.46, 0.15)} args={["#f2e9db", "#453b34", 0.46]} />
      <primitive object={mainTarget} />
      <spotLight
        ref={dim("main", 28)}
        position={[0, 2.2, 0.6]}
        target={mainTarget}
        angle={1.15}
        penumbra={0.95}
        intensity={28}
        distance={9}
        decay={2}
        color="#ffe1bb"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* LED nella libreria e una luce morbida sulle stampe appese sopra */}
      <pointLight ref={dim("led-left", 0.77)} position={[-1.86, 1.97, -1.61]} intensity={0.77} distance={1.55} decay={2} color="#ffd5a3" />
      <pointLight ref={dim("led-right", 0.77)} position={[0.06, 1.97, -1.61]} intensity={0.77} distance={1.55} decay={2} color="#ffd5a3" />
      <pointLight ref={dim("prints", 1.1)} position={[-0.65, 2.7, -0.9]} intensity={1.1} distance={2.6} decay={2} color="#ffe2bf" />
      {/* Lampada da scrivania */}
      <primitive object={deskTarget} />
      <spotLight ref={dim("desk", 1.45)} position={[-2.21, 1.14, -0.775]} target={deskTarget} angle={0.75} penumbra={0.8} intensity={1.45} distance={2} decay={2} color="#ffdcaf" />
      {/* Monitor e televisore: restano accesi anche al buio */}
      <pointLight ref={dim("monitor", 1.1, SCREEN_KEEP)} position={[-2.15, 1.1, -0.35]} intensity={1.1} distance={1.6} decay={2} color="#8fb4ff" />
      <pointLight ref={dim("tv", 0.9, SCREEN_KEEP)} position={[2.05, 0.8, 0.95]} intensity={0.9} distance={1.5} decay={2} color="#9ab8ff" />
      {/* Parete delle stampe: una luce radente che le lascia leggere anche da lontano */}
      <pointLight ref={dim("photo-wall", 0.7, 0.3)} position={[1.75, 2.35, -0.45]} intensity={0.7} distance={2.4} decay={2} color="#fff0db" />
      {/* Lavagnetta: quanto basta per leggere il gesso */}
      <pointLight ref={dim("chalkboard", 0.45, 0.3)} position={[-2.1, 1.95, 1.24]} intensity={0.45} distance={1.3} decay={2} color="#ffe2bf" />
      <pointLight ref={dim("front", 2.8)} position={[0, 2.3, 3.4]} intensity={2.8} distance={7} decay={2} color="#ffb98a" />
    </>
  );
}
