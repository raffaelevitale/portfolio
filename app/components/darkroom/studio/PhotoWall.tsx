"use client";

import { proxied } from "@/lib/live/image";
import { useDarkroom } from "@/lib/darkroom/store";
import { type Photo, PHOTOS, WALL_SLOTS } from "@/lib/photos";
import { useItemClick } from "../Hotspot";
import { ROOM } from "../objects/Room";
import { seeded, useCanvasTexture } from "../textures";
import { SoftBox } from "./StudioFinishes";
import { useCoverFit, useRemoteTexture } from "./useRemoteTexture";
import { drawLatentPhoto } from "./wall-textures";

/** La parete destra, dove prima c'era la vetrina: tre fili tesi con le mie stampe. */
export const WALL = { z: -0.45, y: 1.62, span: 1.3 } as const;
const COLUMNS = 3;
const ROWS = Math.ceil(WALL_SLOTS / COLUMNS);
const ROW_GAP = 0.33;
const WIRE = "#8d8a86";
const PAPER = "#efe9dc";
const LANDSCAPE = { w: 0.3, h: 0.21 } as const;
const PORTRAIT = { w: 0.17, h: 0.24 } as const;
/** Margine bianco della carta attorno all'immagine. */
const BORDER = 0.014;

interface SlotProps {
  index: number;
  photo: Photo | undefined;
  x: number;
  y: number;
  tilt: number;
}

function sizeOf(photo: Photo | undefined) {
  return photo?.orientation === "portrait" ? PORTRAIT : LANDSCAPE;
}

function rowY(row: number): number {
  return ((ROWS - 1) / 2) * ROW_GAP - row * ROW_GAP + 0.13;
}

/** La stampa vera, con la foto ritagliata al formato della carta. */
function PhotoImage({ photo, w, h }: { photo: Photo; w: number; h: number }) {
  const texture = useRemoteTexture(proxied(photo.src, 640));
  const fitted = useCoverFit(texture, (w - BORDER * 2) / (h - BORDER * 2));
  return (
    <mesh position={[0, 0, 0.0015]}>
      <planeGeometry args={[w - BORDER * 2, h - BORDER * 2]} />
      {/* Chiavi diverse: lo shader con la mappa va compilato da zero quando la foto arriva. */}
      {fitted
        ? <meshStandardMaterial key="photo" map={fitted} roughness={0.7} />
        : <meshStandardMaterial key="wait" color="#d3cab8" roughness={0.9} />}
    </mesh>
  );
}

function LatentImage({ index, w, h }: { index: number; w: number; h: number }) {
  const frame = String(index + 1).padStart(2, "0");
  const texture = useCanvasTexture(w > h ? 512 : 360, w > h ? 360 : 512, drawLatentPhoto(41 + index * 7, frame));
  return (
    <mesh position={[0, 0, 0.0015]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} roughness={0.85} />
    </mesh>
  );
}

function WallPrint({ index, photo, x, y, tilt }: SlotProps) {
  const selectPhoto = useDarkroom((s) => s.selectPhoto);
  const onClick = useItemClick("fotografie", () => selectPhoto(photo ? index : null));
  const { w, h } = sizeOf(photo);
  return (
    <group position={[x, y, 0]} rotation={[0, 0, tilt]} onClick={onClick}>
      {/* Molletta in cima, appesa al filo */}
      <SoftBox position={[0, 0.004, 0.008]} size={[0.018, 0.05, 0.012]} color="#9c7449" roughness={0.7} radius={0.002} />
      <group position={[0, -h / 2 + 0.012, 0.004]}>
        {photo ? (
          <>
            <SoftBox size={[w, h, 0.002]} color={PAPER} roughness={0.85} radius={0.0005} shadow />
            <PhotoImage photo={photo} w={w} h={h} />
          </>
        ) : (
          <LatentImage index={index} w={w} h={h} />
        )}
      </group>
    </group>
  );
}

/** Tre fili tesi tra due ganci, uno per fila di stampe. */
function Wires() {
  return (
    <>
      {Array.from({ length: ROWS }, (_, row) => (
        <group key={row} position={[0, rowY(row), 0.006]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0025, 0.0025, WALL.span, 6]} />
            <meshStandardMaterial color={WIRE} metalness={0.8} roughness={0.35} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[(side * WALL.span) / 2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.009, 0.009, 0.02, 10]} />
              <meshStandardMaterial color={WIRE} metalness={0.8} roughness={0.35} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

/** Le stampe sulla parete destra: le mie fotografie, o stampe latenti finché la lista è vuota. */
export default function PhotoWall() {
  const rand = seeded(9);
  const cell = WALL.span / COLUMNS;
  return (
    // Ruotata verso il centro della stanza: l'asse x locale corre lungo la parete, verso chi entra.
    <group position={[ROOM.maxX - 0.012, WALL.y, WALL.z]} rotation={[0, -Math.PI / 2, 0]}>
      <Wires />
      {Array.from({ length: WALL_SLOTS }, (_, i) => {
        const x = -WALL.span / 2 + cell * ((i % COLUMNS) + 0.5) + (rand() - 0.5) * 0.04;
        return <WallPrint key={i} index={i} photo={PHOTOS[i]} x={x} y={rowY(Math.floor(i / COLUMNS))} tilt={(rand() - 0.5) * 0.06} />;
      })}
    </group>
  );
}
