"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Luci calde da sera: una sospensione che proietta le ombre, le strisce LED della libreria
 * e le sorgenti "pratiche" (lampada da scrivania, monitor, televisore, vetrina).
 */
export default function StudioLights() {
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
      <ambientLight intensity={0.43} color="#ffe7d2" />
      <hemisphereLight args={["#f2e9db", "#453b34", 0.46]} />
      <primitive object={mainTarget} />
      <spotLight
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
      {/* LED nella libreria */}
      <pointLight position={[-1.86, 1.97, -1.61]} intensity={0.77} distance={1.55} decay={2} color="#ffd5a3" />
      <pointLight position={[0.06, 1.97, -1.61]} intensity={0.77} distance={1.55} decay={2} color="#ffd5a3" />
      {/* Lampada da scrivania */}
      <primitive object={deskTarget} />
      <spotLight position={[-2.21, 1.14, -0.775]} target={deskTarget} angle={0.75} penumbra={0.8} intensity={1.45} distance={2} decay={2} color="#ffdcaf" />
      {/* Monitor, vetrina, televisore */}
      <pointLight position={[-2.15, 1.1, -0.35]} intensity={1.1} distance={1.6} decay={2} color="#8fb4ff" />
      <pointLight position={[2.31, 1.7, -0.65]} intensity={0.6} distance={1.25} decay={2} color="#fff0db" />
      <pointLight position={[2.28, 1.26, -0.18]} intensity={0.32} distance={1.03} decay={2} color="#f6e5ca" />
      <pointLight position={[2.05, 0.8, 0.95]} intensity={0.9} distance={1.5} decay={2} color="#9ab8ff" />
      <pointLight position={[0, 2.3, 3.4]} intensity={2.8} distance={7} decay={2} color="#ffb98a" />
    </>
  );
}
