"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { proxied } from "@/lib/live/image";
import { romeTime } from "@/lib/rome-time";
import { CARS, type ShowcaseItem, visible, WATCHES } from "@/lib/studio-content";
import { ROOM } from "../objects/Room";
import { useCanvasTexture } from "../textures";
import { drawDial } from "./studio-textures";
import { ShowcaseModel } from "./ShowcaseModel";
import { StackedBooks } from "./ShelfObjects";
import { SoftBox, useStudioFinishes } from "./StudioFinishes";
import { useCoverFit, useRemoteTexture } from "./useRemoteTexture";
import { useDimmedEmissive } from "./useSafelightMix";

/** La credenza contro la parete destra: sopra il portaorologi, al muro le auto in fotografia. */
export const CREDENZA = { x: 2.4, z: -0.42, depth: 0.42, len: 1.3, h: 0.74, legs: 0.12 } as const;
const BOX = { x: 2.37, z: -0.5, depth: 0.25, len: 0.68, h: 0.07 } as const;
const LID_OPEN = -1.85;
const WATCH_SCALE = 1.5;
/** Inclinazione in più nel portaorologi: il quadrante guarda in alto, verso chi entra. */
const WATCH_TILT = -0.4;
const SLOTS = 5;
const LEATHER = "#3b2519";
const LINING = "#d3c3a6";

const FRAME = { w: 0.36, h: 0.27, photoW: 0.27, photoH: 0.18 } as const;
/** Posti delle stampe (z, y): tre in alto, due sotto sfalsate. */
const PRINT_SLOTS: readonly (readonly [number, number])[] = [
  [-0.84, 1.62], [-0.42, 1.62], [0, 1.62], [-0.63, 1.28], [-0.21, 1.28],
];

/** Orologio con lancette vere: segnano l'ora di Savigliano. */
function Watch({ item }: { item: ShowcaseItem }) {
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
    <group scale={WATCH_SCALE}>
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

function Credenza() {
  const { x, z, depth, len, h, legs } = CREDENZA;
  const { wood } = useStudioFinishes();
  const front = x - depth / 2;
  return (
    <group>
      <SoftBox position={[x, (h + legs) / 2, z]} size={[depth, h - legs, len]} color="#a98a6e" map={wood} shadow />
      <SoftBox position={[x, h - 0.014, z]} size={[depth + 0.02, 0.028, len + 0.02]} color="#c4a383" map={wood} shadow />
      {[-1, 1].map((side) => (
        <group key={side}>
          <SoftBox position={[front - 0.006, (h + legs) / 2 - 0.01, z + side * (len / 4)]} size={[0.012, h - legs - 0.08, len / 2 - 0.03]} color="#b8987a" map={wood} />
          <SoftBox position={[front - 0.016, (h + legs) / 2 + 0.06, z + side * 0.05]} size={[0.012, 0.09, 0.012]} color="#b39570" metalness={0.6} roughness={0.36} />
        </group>
      ))}
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
        <mesh key={`${sx}${sz}`} position={[x + sx * (depth / 2 - 0.05), legs / 2, z + sz * (len / 2 - 0.06)]}>
          <cylinderGeometry args={[0.016, 0.011, legs, 12]} />
          <meshStandardMaterial color="#2a2522" roughness={0.6} />
        </mesh>
      )))}
    </group>
  );
}

function BoxWatch({ watch, z }: { watch: ShowcaseItem; z: number }) {
  const procedural = <Watch item={watch} />;
  return (
    <group position={[BOX.x - 0.01, CREDENZA.h + 0.06, z]} rotation={[0, -Math.PI / 2, 0]}>
      <group rotation={[WATCH_TILT, 0, 0]}>
        {watch.model
          ? <ShowcaseModel url={watch.model} kind="watch" position={[0, 0, 0]} rotationY={0} fallback={procedural} />
          : procedural}
      </group>
    </group>
  );
}

/** Il portaorologi aperto, con un cuscinetto per ogni orologio. */
function WatchBox({ watches }: { watches: readonly ShowcaseItem[] }) {
  const { fabric } = useStudioFinishes();
  const top = CREDENZA.h;
  const slot = (BOX.len - 0.04) / SLOTS;
  const back = BOX.x + BOX.depth / 2;
  const front = BOX.x - BOX.depth / 2;
  return (
    <group>
      <SoftBox position={[BOX.x, top + 0.008, BOX.z]} size={[BOX.depth, 0.016, BOX.len]} color={LEATHER} radius={0.004} shadow />
      <SoftBox position={[front + 0.008, top + 0.028, BOX.z]} size={[0.016, 0.05, BOX.len]} color={LEATHER} radius={0.004} />
      <SoftBox position={[back - 0.008, top + BOX.h / 2, BOX.z]} size={[0.016, BOX.h, BOX.len]} color={LEATHER} radius={0.004} />
      {[-1, 1].map((side) => (
        <SoftBox key={side} position={[BOX.x, top + BOX.h / 2, BOX.z + side * (BOX.len / 2 - 0.008)]} size={[BOX.depth, BOX.h, 0.016]} color={LEATHER} radius={0.004} />
      ))}
      <SoftBox position={[BOX.x, top + 0.018, BOX.z]} size={[BOX.depth - 0.03, 0.006, BOX.len - 0.03]} color={LINING} map={fabric} />
      <group position={[back, top + BOX.h, BOX.z]} rotation={[0, 0, LID_OPEN]}>
        <SoftBox position={[-BOX.depth / 2, 0.014, 0]} size={[BOX.depth, 0.028, BOX.len]} color={LEATHER} radius={0.006} shadow />
        <SoftBox position={[-BOX.depth / 2, -0.001, 0]} size={[BOX.depth - 0.03, 0.004, BOX.len - 0.03]} color={LINING} map={fabric} />
      </group>
      {Array.from({ length: SLOTS }, (_, i) => {
        const z = BOX.z - BOX.len / 2 + 0.02 + slot * (i + 0.5);
        return (
          <group key={i}>
            <RoundedBox args={[BOX.depth - 0.07, 0.045, slot - 0.022]} radius={0.016} position={[BOX.x, top + 0.042, z]}>
              <meshStandardMaterial color={LINING} map={fabric} roughness={0.95} />
            </RoundedBox>
            {watches[i] && <BoxWatch watch={watches[i]} z={z} />}
          </group>
        );
      })}
    </group>
  );
}

/** La lente da orologiaio appoggiata accanto alla scatola. */
function Loupe() {
  return (
    <group position={[2.27, CREDENZA.h, -0.04]} rotation={[0.2, 0, 0.35]}>
      <mesh position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.019, 0.024, 0.032, 24, 1, true]} />
        <meshStandardMaterial color="#1c1b1a" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.033, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.018, 24]} />
        <meshPhysicalMaterial color="#cfe0e4" transparent opacity={0.35} roughness={0.05} clearcoat={1} depthWrite={false} />
      </mesh>
    </group>
  );
}


/** Un'auto stampata e incorniciata, con il passe-partout come in una mostra. */
function CarPrint({ car, z, y }: { car: ShowcaseItem; z: number; y: number }) {
  const { wood } = useStudioFinishes();
  const photo = useRemoteTexture(car.photo ? proxied(car.photo, 640) : null);
  const fitted = useCoverFit(photo, FRAME.photoW / FRAME.photoH);
  return (
    <group position={[ROOM.maxX - 0.016, y, z]} rotation={[0, -Math.PI / 2, 0]}>
      <SoftBox size={[FRAME.w, FRAME.h, 0.024]} color="#2a2420" map={wood} radius={0.003} shadow />
      <SoftBox position={[0, 0, 0.012]} size={[FRAME.w - 0.03, FRAME.h - 0.03, 0.004]} color="#cfc6b6" roughness={0.9} radius={0.001} />
      <mesh position={[0, 0.008, 0.0145]}>
        <planeGeometry args={[FRAME.photoW, FRAME.photoH]} />
        {/* Materiali con chiavi diverse: lo shader con la mappa va compilato da zero. */}
        {fitted
          ? <meshStandardMaterial key="photo" map={fitted} roughness={0.75} />
          : <meshStandardMaterial key="swatch" color={car.color} roughness={0.8} />}
      </mesh>
    </group>
  );
}

/** La luce da quadro in ottone sopra le stampe. */
function PictureLight() {
  const glow = useDimmedEmissive({ color: "#fff1d8", emissive: "#ffe4b8", base: 0.6 });
  return (
    <group position={[ROOM.maxX - 0.05, 1.9, CREDENZA.z]}>
      <SoftBox size={[0.06, 0.026, 0.7]} color="#a8875a" metalness={0.65} roughness={0.32} />
      <mesh position={[-0.012, -0.014, 0]} material={glow}>
        <boxGeometry args={[0.03, 0.002, 0.66]} />
      </mesh>
      <SoftBox position={[0.03, 0.02, 0]} size={[0.012, 0.05, 0.04]} color="#8e7048" metalness={0.6} />
    </group>
  );
}

export default function Showcase() {
  const watches = visible(WATCHES).slice(0, SLOTS);
  const cars = visible(CARS).slice(0, PRINT_SLOTS.length);
  return (
    <group>
      <Credenza />
      <WatchBox watches={watches} />
      <Loupe />
      <group rotation={[0, -Math.PI / 2, 0]} position={[2.45, CREDENZA.h, 0.1]}>
        <StackedBooks position={[0, 0, 0]} />
      </group>
      {cars.map((car, i) => (
        <CarPrint key={car.name} car={car} z={PRINT_SLOTS[i][0]} y={PRINT_SLOTS[i][1]} />
      ))}
      <PictureLight />
    </group>
  );
}
