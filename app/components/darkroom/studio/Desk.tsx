"use client";

import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import type { Vec3 } from "@/lib/darkroom/hotspots";
import { useLive } from "@/lib/live/useLive";
import { BoxInstances, type BoxInstance } from "./BoxInstances";
import { drawEditorScreen } from "./desk-textures";
import { ContributionPrint, FilmCamera, Laptop, PostIts } from "./DeskGear";
import { SoftBox, useStudioFinishes } from "./StudioFinishes";
import { useLiveCanvasTexture } from "./studio-textures";

const DESK = { x: -2.25, z: -0.35, w: 0.7, len: 1.3, h: 0.74 } as const;
const CHARCOAL = "#24282b";
const BRASS = "#ae8356";

const KEYS: readonly BoxInstance[] = [
  ...Array.from({ length: 4 }, (_, row) =>
    Array.from({ length: row === 3 ? 10 : 13 }, (_, col): BoxInstance => ({
      position: [-0.050 + row * 0.026, 0.013, 0.172 - col * 0.026],
      size: [0.021, 0.010, 0.022],
      color: row === 0 && col === 0 ? "#bc6348" : col === 0 || col === 12 ? "#46545a" : "#b3a99a",
    })),
  ).flat(),
  { position: [0.028, 0.013, -0.112], size: [0.021, 0.010, 0.056], color: "#46545a" },
  { position: [0.054, 0.013, 0.015], size: [0.021, 0.010, 0.134], color: "#9c9c8c" },
  ...[0.117, 0.158, -0.075, -0.116, -0.157].map((z): BoxInstance => ({
    position: [0.054, 0.013, z], size: [0.021, 0.010, 0.034], color: "#46545a",
  })),
];

function Rod({ from, to, radius }: { from: Vec3; to: Vec3; radius: number }) {
  const { midpoint, rotation, length } = useMemo(() => {
    const start = new Vector3(...from);
    const direction = new Vector3(...to).sub(start);
    return {
      midpoint: start.addScaledVector(direction, 0.5),
      rotation: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize()),
      length: direction.length(),
    };
  }, [from, to]);
  return (
    <mesh position={midpoint} quaternion={rotation}>
      <cylinderGeometry args={[radius, radius, length, 10]} />
      <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.34} />
    </mesh>
  );
}

function TaskLamp() {
  return (
    <group position={[-2.44, DESK.h, -0.83]}>
      <mesh position={[0, 0.013, 0]}>
        <cylinderGeometry args={[0.073, 0.083, 0.026, 24]} />
        <meshStandardMaterial color={CHARCOAL} metalness={0.45} roughness={0.42} />
      </mesh>
      <Rod from={[0, 0.024, 0]} to={[0.02, 0.28, -0.03]} radius={0.007} />
      <Rod from={[0.02, 0.28, -0.03]} to={[0.23, 0.45, 0.045]} radius={0.006} />
      <mesh position={[0.02, 0.28, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.021, 0.021, 0.017, 16]} />
        <meshStandardMaterial color={CHARCOAL} metalness={0.55} />
      </mesh>
      <group position={[0.23, 0.43, 0.055]} rotation={[0.16, 0, 0.27]}>
        <mesh>
          <cylinderGeometry args={[0.032, 0.089, 0.076, 28, 1, true]} />
          <meshStandardMaterial color="#38514e" side={2} roughness={0.38} metalness={0.42} />
        </mesh>
        <mesh position={[0, -0.039, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.083, 28]} />
          <meshStandardMaterial color="#ffe5b6" emissive="#ffdb9f" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0, -0.039, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.087, 0.002, 8, 28]} />
          <meshStandardMaterial color={BRASS} metalness={0.55} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

function Chair() {
  const { fabric } = useStudioFinishes();
  return (
    <group position={[-1.63, 0, -0.42]} rotation={[0, -0.14, 0]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, i * Math.PI * 0.4, 0]}>
          <SoftBox position={[0.123, 0.062, 0]} size={[0.25, 0.028, 0.029]} color={CHARCOAL} />
          <mesh position={[0.24, 0.034, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.025, 12]} />
            <meshStandardMaterial color="#151719" roughness={0.85} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.033, 0.028, 0.36, 16]} />
        <meshStandardMaterial color="#555859" metalness={0.72} roughness={0.42} />
      </mesh>
      <SoftBox position={[0, 0.465, 0]} size={[0.43, 0.08, 0.45]} color="#3d4b4a" map={fabric} radius={0.036} shadow />
      <SoftBox position={[0.202, 0.665, 0]} size={[0.053, 0.35, 0.36]} color={CHARCOAL} radius={0.02} rotation={[0, 0, -0.13]} />
      <SoftBox position={[0.189, 0.751, 0]} size={[0.085, 0.37, 0.43]} color="#405452" map={fabric} radius={0.039} rotation={[0, 0, -0.13]} shadow />
      {[-0.23, 0.23].map((z) => (
        <group key={z}>
          <SoftBox position={[0.045, 0.555, z]} size={[0.026, 0.17, 0.023]} rotation={[0, 0, -0.2]} color={CHARCOAL} />
          <SoftBox position={[0.007, 0.632, z]} size={[0.21, 0.031, 0.046]} color="#292b2b" radius={0.014} />
        </group>
      ))}
    </group>
  );
}

function DesktopProps() {
  return (
    <>
      <SoftBox position={[-2.16, DESK.h + 0.002, -0.43]} size={[0.33, 0.005, 0.64]} radius={0.002} color="#3b4a40" />
      <group position={[-2.145, DESK.h + 0.005, -0.38]} rotation={[0, 0.055, 0]}>
        <SoftBox size={[0.136, 0.015, 0.393]} color={CHARCOAL} radius={0.006} />
        <BoxInstances boxes={KEYS} />
      </group>
      <group position={[-2.13, DESK.h + 0.012, -0.66]} rotation={[0, -0.12, 0]}>
        <SoftBox size={[0.102, 0.027, 0.058]} radius={0.012} color="#353c3d" />
        <SoftBox position={[-0.018, 0.015, 0]} size={[0.019, 0.007, 0.008]} color="#b8a38b" radius={0.003} />
      </group>
      <group position={[-2.33, DESK.h, -0.78]}>
        <mesh position={[0, 0.034, 0]}>
          <cylinderGeometry args={[0.035, 0.026, 0.067, 24, 1, true]} />
          <meshStandardMaterial color="#c0a383" roughness={0.46} side={2} />
        </mesh>
        <mesh position={[0, 0.055, 0]}>
          <cylinderGeometry args={[0.031, 0.031, 0.003, 24]} />
          <meshStandardMaterial color="#291b14" roughness={0.33} />
        </mesh>
        <mesh position={[0.038, 0.039, 0]} rotation={[0, 0, -0.2]}>
          <torusGeometry args={[0.017, 0.004, 8, 18]} />
          <meshStandardMaterial color="#c0a383" roughness={0.46} />
        </mesh>
      </group>
    </>
  );
}

/** La scrivania dove scrivo codice: editor e provino seguono GitHub in diretta. */
export default function Desk() {
  const github = useLive("github");
  const { wood } = useStudioFinishes();
  const status = !github ? "loading" : github.data ? "ok" : "off";
  const screen = useLiveCanvasTexture(1024, 640, drawEditorScreen(github?.data ?? null, status), [github?.fetchedAt, status]);

  return (
    <group>
      <SoftBox position={[DESK.x, DESK.h - 0.022, DESK.z]} size={[DESK.w, 0.044, DESK.len]} color="#d8b796" map={wood} radius={0.018} roughness={0.48} shadow />
      {[-1, 1].map((end) => (
        <group key={end} position={[DESK.x, 0, DESK.z + end * 0.56]}>
          {[-0.26, 0.26].map((x) => (
            <SoftBox key={x} position={[x, 0.352, 0]} size={[0.033, 0.70, 0.036]} color={CHARCOAL} shadow />
          ))}
          <SoftBox position={[0, 0.069, 0]} size={[0.55, 0.025, 0.032]} color={CHARCOAL} />
        </group>
      ))}
      <group position={[-2.462, DESK.h, -0.37]}>
        <SoftBox position={[0.056, 0.011, 0]} size={[0.2, 0.022, 0.252]} color="#666c6b" metalness={0.62} roughness={0.34} />
        <SoftBox position={[0.017, 0.17, 0]} size={[0.032, 0.32, 0.065]} color="#565c5b" metalness={0.58} />
        <group position={[0.025, 0.365, 0]} rotation={[0, Math.PI / 2, 0]}>
          <SoftBox size={[0.666, 0.414, 0.033]} color="#4f5658" radius={0.014} metalness={0.52} roughness={0.39} shadow />
          <SoftBox position={[0, 0, 0.019]} size={[0.651, 0.401, 0.008]} color="#101415" radius={0.003} />
          <mesh position={[0, 0.003, 0.0235]}>
            <planeGeometry args={[0.624, 0.39]} />
            <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={0.56} roughness={0.9} />
          </mesh>
          <PostIts />
        </group>
      </group>
      <DesktopProps />
      <Laptop />
      <FilmCamera />
      <ContributionPrint data={github?.data ?? null} revision={github?.fetchedAt} />
      <TaskLamp />
      <Chair />
    </group>
  );
}
