"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { LATENT_SLUG } from "@/lib/content";
import { useDarkroom } from "@/lib/darkroom/store";
import { useItemClick } from "../Hotspot";
import { drawPrintCrybu, drawPrintNext, drawPrintOrario, drawPrintPhoto, drawTestStrip } from "../prints";
import { type Draw, useCanvasTexture } from "../textures";
import { useReducedMotion } from "../useReducedMotion";
import { ROOM } from "./Room";

/** Davanti alla libreria (fronte a z -1.64) e sopra di essa (alta 2.15 m): le stampe non la toccano. */
const LINE_Z = -1.5;
const LINE_Y = 2.62;
const SAG = 0.05;
/** La corda parte dalla parete sinistra e finisce su un'asta dal soffitto, prima dell'angolo della camera oscura. */
const LINE_START_X = ROOM.minX;
const LINE_END_X = 1.55;
const PRINT_W = 0.3;
const PRINT_H = 0.375;
const STRIP_W = 0.09;
const STRIP_H = 0.36;
const LINE_MID = (LINE_START_X + LINE_END_X) / 2;
const LINE_HALF = (LINE_END_X - LINE_START_X) / 2;

function lineY(x: number): number {
  const t = (x - LINE_MID) / LINE_HALF;
  return LINE_Y - SAG * (1 - t * t);
}

/** Piano leggermente incurvato, come carta baritata che si asciuga. */
function useCurledPlane(width: number, height: number): THREE.PlaneGeometry {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(width, height, 1, 12);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = pos.getY(i) / height + 0.5;
      pos.setZ(i, 0.018 * Math.sin(Math.PI * v));
    }
    g.computeVertexNormals();
    return g;
  }, [width, height]);
  return geometry;
}

interface PrintProps {
  x: number;
  width: number;
  height: number;
  canvas: readonly [number, number];
  draw: Draw;
  phase: number;
  /** Progetto a cui rimanda la stampa: cliccandola il pannello si apre sul suo caso. */
  slug?: string;
}

function HangingPrint({ x, width, height, canvas, draw, phase, slug }: PrintProps) {
  const selectPrint = useDarkroom((s) => s.selectPrint);
  const onClick = useItemClick("lavori", () => selectPrint(slug ?? null));
  const ref = useRef<THREE.Group>(null);
  const texture = useCanvasTexture(canvas[0], canvas[1], draw);
  const geometry = useCurledPlane(width, height);
  const reduced = useReducedMotion();

  useFrame(({ clock, frameloop }) => {
    if (!ref.current || reduced || frameloop === "demand") return;
    const t = clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.55 + phase) * 0.018;
    ref.current.rotation.x = Math.sin(t * 0.4 + phase * 1.7) * 0.03;
  });

  return (
    <group position={[x, lineY(x), LINE_Z]} onClick={slug ? onClick : undefined}>
      <group ref={ref}>
        <mesh geometry={geometry} position={[0, -height / 2 - 0.012, 0.004]} castShadow receiveShadow>
          <meshStandardMaterial map={texture} roughness={0.55} side={THREE.FrontSide} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * Math.max(width / 2 - 0.04, 0.012), -0.01, 0.012]} castShadow>
            <boxGeometry args={[0.018, 0.075, 0.014]} />
            <meshStandardMaterial color="#9c7449" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function DryingLine() {
  const wire = useMemo(() => {
    const points = Array.from({ length: 24 }, (_, i) => {
      const x = LINE_START_X + (i / 23) * (LINE_END_X - LINE_START_X);
      return new THREE.Vector3(x, lineY(x), LINE_Z);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 64, 0.0035, 6, false);
  }, []);

  return (
    <group>
      <mesh geometry={wire}>
        <meshStandardMaterial color="#8d8a86" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* Asta dal soffitto che regge l'estremità destra della corda */}
      <mesh position={[LINE_END_X, (ROOM.height + LINE_Y) / 2, LINE_Z]}>
        <cylinderGeometry args={[0.008, 0.008, ROOM.height - LINE_Y, 8]} />
        <meshStandardMaterial color="#8d8a86" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* Gancio a muro per l'estremità sinistra */}
      <mesh position={[LINE_START_X + 0.02, LINE_Y, LINE_Z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.04, 10]} />
        <meshStandardMaterial color="#8d8a86" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* Stesso ordine dei fotogrammi in lib/content.ts: 01A, 02A, 03A e la stampa latente. */}
      <HangingPrint x={-1.95} width={PRINT_W} height={PRINT_H} canvas={[1024, 1280]} draw={drawPrintOrario} phase={0} slug="orario-vallauri" />
      <HangingPrint x={-1.1} width={PRINT_W} height={PRINT_H} canvas={[1024, 1280]} draw={drawPrintCrybu} phase={1.3} slug="crybu-control-center" />
      <HangingPrint x={-0.25} width={PRINT_W} height={PRINT_H} canvas={[1024, 1280]} draw={drawPrintPhoto} phase={2.6} slug="fotografia" />
      <HangingPrint x={0.6} width={PRINT_W} height={PRINT_H} canvas={[1024, 1280]} draw={drawPrintNext} phase={3.2} slug={LATENT_SLUG} />
      <HangingPrint x={-2.4} width={STRIP_W} height={STRIP_H} canvas={[256, 1024]} draw={drawTestStrip} phase={3.9} />
      <HangingPrint x={1.2} width={STRIP_W} height={STRIP_H} canvas={[256, 1024]} draw={drawTestStrip} phase={4.4} />
    </group>
  );
}
