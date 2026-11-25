"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { drawPrintCrybu, drawPrintNext, drawPrintOrario, drawPrintPhoto, drawTestStrip } from "../prints";
import { type Draw, useCanvasTexture } from "../textures";
import { useReducedMotion } from "../useReducedMotion";
import { ROOM } from "./Room";

const LINE_Z = -1.82;
const LINE_Y = 2.1;
const SAG = 0.07;
/** La corda parte da un'asta appesa al soffitto, accanto alla porta girevole, e arriva alla parete destra. */
const LINE_START_X = -1.5;
const LINE_END_X = ROOM.maxX;
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
}

function HangingPrint({ x, width, height, canvas, draw, phase }: PrintProps) {
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
    <group position={[x, lineY(x), LINE_Z]}>
      <group ref={ref}>
        <mesh geometry={geometry} position={[0, -height / 2 - 0.012, 0.004]} castShadow receiveShadow>
          <meshStandardMaterial map={texture} roughness={0.55} side={THREE.FrontSide} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * (width / 2 - 0.05), -0.01, 0.012]} castShadow>
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
      {/* Asta dal soffitto che regge l'estremità sinistra della corda */}
      <mesh position={[LINE_START_X, (ROOM.height + LINE_Y) / 2, LINE_Z]}>
        <cylinderGeometry args={[0.008, 0.008, ROOM.height - LINE_Y, 8]} />
        <meshStandardMaterial color="#8d8a86" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* Stesso ordine dei fotogrammi in lib/content.ts: 01A, 02A, 03A e la stampa latente. */}
      <HangingPrint x={-0.95} width={0.42} height={0.525} canvas={[1024, 1280]} draw={drawPrintOrario} phase={0} />
      <HangingPrint x={-0.2} width={0.42} height={0.525} canvas={[1024, 1280]} draw={drawPrintCrybu} phase={1.3} />
      <HangingPrint x={0.55} width={0.42} height={0.525} canvas={[1024, 1280]} draw={drawPrintPhoto} phase={2.6} />
      <HangingPrint x={1.3} width={0.42} height={0.525} canvas={[1024, 1280]} draw={drawPrintNext} phase={3.2} />
      <HangingPrint x={-1.35} width={0.12} height={0.48} canvas={[256, 1024]} draw={drawTestStrip} phase={3.9} />
      <HangingPrint x={2.0} width={0.12} height={0.48} canvas={[256, 1024]} draw={drawTestStrip} phase={4.4} />
    </group>
  );
}
