"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { romeTime } from "@/lib/rome-time";
import { CARS, type ShowcaseItem, visible, WATCHES } from "@/lib/studio-content";
import { useCanvasTexture } from "../textures";
import { drawDial } from "./studio-textures";
import { ShowcaseModel } from "./ShowcaseModel";
import { ModelCar } from "./ModelCar";
import { StackedBooks } from "./ShelfObjects";
import { SoftBox, useStudioFinishes } from "./StudioFinishes";

const CASE = { x: 2.41, z: -0.4, depth: 0.38, len: 1.1, base: 0.5, top: 1.85 } as const;
const FRONT_X = CASE.x - CASE.depth / 2;
const SHELF_CARS = 0.95;
const SHELF_WATCHES = 1.4;
const WATCH_SCALE = 1.5;
const glass = new THREE.MeshStandardMaterial({
  color: "#d6e6ff",
  transparent: true,
  opacity: 0.082,
  roughness: 0.53,
  metalness: 0,
  depthWrite: false,
});

/** Orologio con lancette vere: segnano l'ora di Savigliano. */
function Watch({ item, z }: { item: ShowcaseItem; z: number }) {
  const digital = item.name.startsWith("Apple");
  const square = digital || item.name.startsWith("Cartier");
  const chronograph = item.name.startsWith("Omega");
  const dial = useCanvasTexture(256, 256, drawDial(item.color, square ? "square" : chronograph ? "chronograph" : "round"));
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);
  const last = useRef(-1);

  useFrame(({ clock }) => {
    // Basta aggiornare quattro volte al secondo.
    const tick = Math.floor(clock.elapsedTime * 4);
    if (tick === last.current) return;
    last.current = tick;
    const t = romeTime();
    if (hour.current) hour.current.rotation.z = -(((t.h % 12) + t.m / 60) / 12) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = -((t.m + t.s / 60) / 60) * Math.PI * 2;
    if (second.current) second.current.rotation.z = -(t.s / 60) * Math.PI * 2;
  });

  const steel = !digital;
  const bezel = steel ? "#b5b1a7" : "#535a59";
  return (
    <group position={[CASE.x - 0.02, SHELF_WATCHES + 0.05, z]} rotation={[0, -Math.PI / 2, 0]} scale={WATCH_SCALE}>
      <RoundedBox args={[0.05, 0.073, 0.03]} radius={0.01} position={[0, -0.005, -0.02]}>
        <meshStandardMaterial color="#2b2522" roughness={0.9} />
      </RoundedBox>
      <group rotation={[-0.35, 0, 0]}>
        {[0.034, -0.034].map((y) => (
          <mesh key={y} position={[0, y, -0.002]}>
            <boxGeometry args={[0.018, 0.036, 0.004]} />
            <meshStandardMaterial color={steel ? "#828682" : "#383d3d"} metalness={steel ? 0.68 : 0.1} roughness={0.48} />
          </mesh>
        ))}
        {steel && [-1, 1].map((side) => (
          <group key={side}>
            {[0, 1, 2, 3, 4].map((link) => (
              <SoftBox key={link} size={[0.021, 0.0054, 0.005]} position={[0, side * (0.023 + link * 0.0058), 0.001]} color={link % 2 ? "#a5a69f" : "#c3bdb0"} metalness={0.64} radius={0.001} />
            ))}
          </group>
        ))}
        {square ? (
          <SoftBox size={[0.043, 0.046, 0.011]} color={bezel} radius={0.0049} roughness={0.27} metalness={0.61} />
        ) : (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.011, 30]} />
              <meshStandardMaterial color={bezel} metalness={0.72} roughness={0.32} />
            </mesh>
            <mesh position={[0, 0, 0.0055]}>
              <torusGeometry args={[0.0204, 0.00135, 8, 30]} />
              <meshStandardMaterial color={chronograph ? "#252827" : "#bfb78e"} metalness={0.63} roughness={0.46} />
            </mesh>
          </group>
        )}
        <mesh position={[0.022, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.0036, 0.0036, 0.006, 10]} />
          <meshStandardMaterial color={bezel} metalness={0.6} roughness={0.44} />
        </mesh>
        <mesh position={[0, 0, 0.0056]}>
          {square ? <planeGeometry args={[0.037, 0.039]} /> : <circleGeometry args={[0.0195, 32]} />}
          <meshStandardMaterial map={dial} roughness={0.35} />
        </mesh>
        <group position={[0, 0, 0.0062]}>
          <group ref={hour}>
            <mesh position={[0, 0.0055, 0]}>
              <boxGeometry args={[0.0022, 0.011, 0.0006]} />
              <meshStandardMaterial color="#e8e4da" metalness={0.6} />
            </mesh>
          </group>
          <group ref={minute}>
            <mesh position={[0, 0.0078, 0.0004]}>
              <boxGeometry args={[0.0016, 0.0156, 0.0006]} />
              <meshStandardMaterial color="#e8e4da" metalness={0.6} />
            </mesh>
          </group>
          <group ref={second}>
            <mesh position={[0, 0.0075, 0.0008]}>
              <boxGeometry args={[0.0006, 0.018, 0.0004]} />
              <meshStandardMaterial color="#d7311f" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

const SHOWCASE_MAX = 5;
const EDGE = 0.13;

function spread(count: number): number[] {
  const n = Math.min(count, SHOWCASE_MAX);
  if (n <= 1) return [CASE.z];
  const from = CASE.z - CASE.len / 2 + EDGE;
  const step = (CASE.len - EDGE * 2) / (n - 1);
  return Array.from({ length: n }, (_, i) => from + i * step);
}

export default function Showcase() {
  const watches = visible(WATCHES).slice(0, SHOWCASE_MAX);
  const cars = visible(CARS).slice(0, SHOWCASE_MAX);
  const { wood, fabric } = useStudioFinishes();
  const watchZ = spread(watches.length);
  const carZ = spread(cars.length);
  // Con cinque modellini per ripiano servono un po' più piccoli per non toccarsi.
  const carScale = cars.length > 3 ? 0.8 : 1;
  return (
    <group>
      <SoftBox position={[CASE.x, CASE.base / 2, CASE.z]} size={[CASE.depth, CASE.base, CASE.len]} map={wood} color="#af937a" shadow />
      <SoftBox position={[FRONT_X - 0.01, 0.255, CASE.z]} size={[0.022, 0.368, CASE.len - 0.11]} map={wood} color="#c8ac8c" />
      <SoftBox position={[FRONT_X - 0.024, 0.38, CASE.z]} size={[0.019, 0.013, 0.124]} color="#b39570" metalness={0.6} roughness={0.36} />
      <SoftBox position={[CASE.x + 0.167, (CASE.base + CASE.top) / 2, CASE.z]} size={[0.025, CASE.top - CASE.base, CASE.len - 0.015]} map={fabric} color="#696157" />
      {[FRONT_X, CASE.x + 0.164].flatMap((x) => [CASE.z - CASE.len / 2, CASE.z + CASE.len / 2].map((z) => (
        <SoftBox key={`${x}-${z}`} position={[x, (CASE.base + CASE.top) / 2, z]} size={[0.022, CASE.top - CASE.base, 0.023]} color="#363a37" metalness={0.46} />
      )))}
      <SoftBox position={[CASE.x, CASE.top, CASE.z]} size={[CASE.depth, 0.042, CASE.len]} map={wood} color="#bd9c7c" shadow />
      <mesh position={[CASE.x - 0.067, CASE.top - 0.023, CASE.z]}>
        <boxGeometry args={[0.02, 0.004, CASE.len - 0.13]} />
        <meshStandardMaterial color="#d9c9ae" emissive="#e5d5b7" emissiveIntensity={0.54} />
      </mesh>
      {/* Vetri e ripiani in vetro */}
      <mesh position={[FRONT_X, (CASE.base + CASE.top) / 2, CASE.z]} rotation={[0, -Math.PI / 2, 0]} material={glass}>
        <planeGeometry args={[CASE.len, CASE.top - CASE.base]} />
      </mesh>
      {[SHELF_CARS, SHELF_WATCHES].map((y) => (
        <mesh key={y} position={[CASE.x, y, CASE.z]} material={glass}>
          <boxGeometry args={[CASE.depth - 0.02, 0.008, CASE.len - 0.02]} />
        </mesh>
      ))}

      {watches.map((w, i) => (
        w.model ? (
          <ShowcaseModel key={w.name} url={w.model} kind="watch" position={[CASE.x - 0.02, SHELF_WATCHES + 0.05, watchZ[i]]} rotationY={-Math.PI / 2} fallback={<Watch item={w} z={watchZ[i]} />} />
        ) : <Watch key={w.name} item={w} z={watchZ[i]} />
      ))}
      {cars.map((car, i) => {
        const position: [number, number, number] = [CASE.x - 0.02, SHELF_CARS + 0.005, carZ[i]];
        const rotationY = Math.PI * 0.78;
        const miniature = <ModelCar item={car} position={position} rotationY={rotationY} scale={carScale} />;
        return car.model ? (
          <ShowcaseModel key={car.name} url={car.model} kind="car" position={position} rotationY={rotationY} scale={carScale} fallback={miniature} />
        ) : <group key={car.name}>{miniature}</group>;
      })}

      <SoftBox position={[CASE.x, CASE.base + 0.035, CASE.z - 0.25]} size={[0.22, 0.07, 0.29]} color="#925e44" map={wood} shadow />
      <SoftBox position={[CASE.x, CASE.base + 0.075, CASE.z - 0.25]} size={[0.226, 0.014, 0.296]} color="#706353" map={fabric} />
      <SoftBox position={[CASE.x - 0.114, CASE.base + 0.062, CASE.z - 0.25]} size={[0.008, 0.018, 0.034]} color="#b59765" metalness={0.59} />
      <group rotation={[0, -Math.PI / 2, 0]} position={[CASE.x, CASE.base, CASE.z + 0.2]}>
        <StackedBooks position={[0, 0, 0]} />
      </group>
    </group>
  );
}
