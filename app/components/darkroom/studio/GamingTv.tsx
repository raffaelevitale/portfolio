"use client";

import { proxied } from "@/lib/live/image";
import { useLive } from "@/lib/live/useLive";
import { BoxInstances, type BoxInstance } from "./BoxInstances";
import { SoftBox, useStudioFinishes } from "./StudioFinishes";
import { drawTvScreen, useLiveCanvasTexture } from "./studio-textures";
import { useImage } from "./useRemoteTexture";

const CABINET = { x: 2.4, z: 0.95, depth: 0.4, len: 1, h: 0.45 } as const;
const DARK = "#282e2e";
const VENTS: readonly BoxInstance[] = Array.from({ length: 18 }, (_, i) => ({
  position: [(i - 8.5) * 0.012, 0.027, -0.051],
  size: [0.004, 0.002, 0.042],
  color: "#151817",
}));

function Controller() {
  return (
    <group position={[-0.093, 0.018, -0.34]} rotation={[0, -1.29, 0]}>
      <SoftBox size={[0.121, 0.027, 0.064]} color="#555b5a" radius={0.013} shadow />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.044, -0.003, 0.028]}>
          <SoftBox rotation={[-0.15, side * 0.28, 0]} size={[0.038, 0.029, 0.062]} color="#474c4b" radius={0.014} />
          <mesh position={[-side * 0.018, 0.019, -0.021]}>
            <cylinderGeometry args={[0.01, 0.007, 0.009, 14]} />
            <meshStandardMaterial color="#242828" roughness={0.73} />
          </mesh>
        </group>
      ))}
      <SoftBox position={[-0.039, 0.016, -0.021]} size={[0.021, 0.003, 0.006]} color="#1b1e1e" radius={0.001} />
      <SoftBox position={[-0.039, 0.016, -0.021]} size={[0.006, 0.003, 0.021]} color="#1b1e1e" radius={0.001} />
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0.039 + Math.cos(i * Math.PI / 2) * 0.009, 0.016, -0.021 + Math.sin(i * Math.PI / 2) * 0.009]}>
          <cylinderGeometry args={[0.0038, 0.0038, 0.004, 10]} />
          <meshStandardMaterial color={["#607f75", "#95664f", "#727b8f", "#9a8e65"][i]} roughness={0.58} />
        </mesh>
      ))}
    </group>
  );
}

/** Il mobile lascia a vista la console e tiene il controller sul piano. */
export default function GamingTv() {
  const steam = useLive("steam");
  const status = !steam ? "loading" : steam.data ? "ok" : "off";
  const game = steam?.data?.games[0];
  const image = useImage(game ? proxied(game.imageUrl, 384) : null);
  const screen = useLiveCanvasTexture(1024, 600, drawTvScreen(steam?.data ?? null, image, status), [steam?.fetchedAt, image, status]);
  const { wood, fabric } = useStudioFinishes();

  return (
    <group position={[CABINET.x, 0, CABINET.z]}>
      <SoftBox position={[0.014, 0.028, 0]} size={[0.31, 0.048, 0.9]} color="#1d2020" />
      <SoftBox position={[0, 0.086, 0]} size={[0.4, 0.052, 1]} color="#9b826c" map={wood} shadow />
      <SoftBox position={[0, 0.426, 0]} size={[0.4, 0.048, 1]} color="#c3a78b" map={wood} shadow />
      <SoftBox position={[0.17, 0.26, 0]} size={[0.041, 0.31, 0.95]} color="#2d2a27" />
      {[-0.48, 0.48, -0.038].map((z) => (
        <SoftBox key={z} position={[0, 0.265, z]} size={[0.36, 0.315, 0.038]} color="#af9376" map={wood} />
      ))}
      <SoftBox position={[-0.174, 0.267, 0.22]} size={[0.023, 0.284, 0.465]} color="#4e5750" map={fabric} />
      <SoftBox position={[-0.193, 0.267, 0.064]} size={[0.02, 0.081, 0.013]} color="#9e8063" roughness={0.43} metalness={0.48} />
      <group position={[-0.047, 0.137, -0.255]} rotation={[0, -Math.PI / 2, 0]}>
        <SoftBox size={[0.298, 0.05, 0.223]} color="#515956" radius={0.014} />
        <SoftBox size={[0.277, 0.024, 0.008]} position={[0, -0.004, 0.112]} radius={0.003} color="#252828" />
        <BoxInstances boxes={VENTS} />
        <SoftBox size={[0.053, 0.004, 0.004]} position={[-0.074, -0.003, 0.117]} radius={0.0015} color="#0e1110" />
        <mesh position={[0.074, -0.002, 0.117]}>
          <circleGeometry args={[0.003, 12]} />
          <meshStandardMaterial color="#574b3b" emissive={status === "ok" ? "#a0d9bc" : "#c08657"} emissiveIntensity={0.85} />
        </mesh>
      </group>
      <group position={[0, CABINET.h, 0]}>
        <group position={[0.055, 0.272, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <SoftBox size={[0.704, 0.422, 0.042]} color="#383e3c" radius={0.018} metalness={0.39} shadow />
          <SoftBox size={[0.68, 0.404, 0.009]} position={[0, 0, 0.022]} color="#131717" radius={0.004} />
          <mesh position={[0, 0.007, 0.0271]}>
            <planeGeometry args={[0.652, 0.382]} />
            <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={0.54} roughness={0.96} />
          </mesh>
          <mesh position={[0.303, -0.194, 0.027]}>
            <circleGeometry args={[0.0026, 12]} />
            <meshStandardMaterial color="#444531" emissive="#a0d9bc" emissiveIntensity={0.55} />
          </mesh>
        </group>
        {[-0.23, 0.23].map((z) => (
          <group key={z}>
            <SoftBox position={[0.02, 0.009, z]} size={[0.206, 0.017, 0.043]} color={DARK} />
            <SoftBox position={[0.063, 0.036, z]} size={[0.031, 0.057, 0.039]} color={DARK} rotation={[0, 0, -0.23]} />
          </group>
        ))}
        <Controller />
      </group>
    </group>
  );
}
