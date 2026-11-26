"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";
import { useDarkroom } from "@/lib/darkroom/store";
import { proxied } from "@/lib/live/image";
import { useLive } from "@/lib/live/useLive";
import { ALBUMS, BOOKS, type Book, visible } from "@/lib/studio-content";
import { seeded, useCanvasTexture } from "../textures";
import { drawSleeve, drawSpine } from "./studio-textures";
import { useRemoteTexture } from "./useRemoteTexture";
import { useBookCover } from "./book-cover";
import { usePullOut } from "./usePullOut";
import { BoxInstances, type BoxInstance } from "./BoxInstances";
import { ShelfLens, ShelfPlant, StackedBooks } from "./ShelfObjects";
import { SoftBox, useStudioFinishes } from "./StudioFinishes";
import { useDimmedEmissive } from "./useSafelightMix";

export const BOOKCASE = { x: -0.9, z: -1.82, w: 2.9, h: 2.15, d: 0.36 } as const;
const WOOD = "#c4a382";
const BOARD = 0.025;
const FRONT_Z = BOOKCASE.z + BOOKCASE.d / 2;
const ITEM_Z = FRONT_Z - 0.105;
const SHELVES = [0.46, 0.98, 1.5] as const;
const BAY_W = BOOKCASE.w / 3;
const bayStart = (bay: number) => BOOKCASE.x - BOOKCASE.w / 2 + bay * BAY_W + 0.03;
const bayEnd = (bay: number) => bayStart(bay) + BAY_W - 0.06;
const FILLER = ["#3d2b22", "#6b5a45", "#283340", "#7a3a2c", "#c9bda5", "#2f3b2c", "#8a7350"];
const DRAG_THRESHOLD_PX = 6;
const COVER_SLOTS = 3;

interface Slot {
  x: number;
  w: number;
  h: number;
  color: string;
}

/** Riempie lo spazio rimasto in un ripiano con libri senza titolo, così lo scaffale sembra vissuto. */
function filler(from: number, to: number, seed: number, vinyl = false): Slot[] {
  const rand = seeded(seed);
  const slots: Slot[] = [];
  let x = from;
  while (x < to) {
    const w = vinyl ? 0.0075 : 0.022 + rand() * 0.024;
    if (x + w > to) break;
    slots.push({
      x: x + w / 2,
      w,
      h: vinyl ? 0.31 : 0.19 + rand() * 0.08,
      // three.js legge solo la sintassi hsl con le virgole.
      color: vinyl ? `hsl(${Math.round(rand() * 360)}, 18%, ${8 + Math.round(rand() * 22)}%)` : FILLER[Math.floor(rand() * FILLER.length)],
    });
    x += w + (vinyl ? 0.0012 : 0.002);
  }
  return slots;
}

function selectBookOnClick(index: number) {
  return (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > DRAG_THRESHOLD_PX) return;
    e.stopPropagation();
    const state = useDarkroom.getState();
    if (state.phase !== "room") return;
    if (state.focus !== "libreria") state.setFocus("libreria");
    useDarkroom.getState().selectBook(index);
  };
}

function BoundBook({ width, height, thickness, color, cover, spine }: {
  width: number; height: number; thickness: number; color: string; cover: THREE.Texture; spine?: THREE.Texture;
}) {
  return (
    <group position={[0, height / 2, 0]}>
      <mesh position={[-0.001, 0, 0]} castShadow>
        <boxGeometry args={[width - 0.005, height - 0.006, thickness - 0.004]} />
        <meshStandardMaterial color="#d0bda1" roughness={0.9} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 0, side * (thickness / 2 - 0.001)]}>
          <boxGeometry args={[width, height, 0.002]} />
          <meshStandardMaterial color={color} roughness={0.65} />
        </mesh>
      ))}
      <mesh position={[-width / 2 + 0.002, 0, 0]}>
        <boxGeometry args={[0.004, height, thickness]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {spine && (
        <mesh position={[-width / 2 - 0.0006, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[thickness, height]} />
          <meshStandardMaterial map={spine} roughness={0.65} />
        </mesh>
      )}
      <mesh position={[0, 0, thickness / 2 + 0.0006]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={cover} roughness={0.68} />
      </mesh>
    </group>
  );
}

function SpineBook({ book, index, slot, shelfY }: { book: Book; index: number; slot: Slot; shelfY: number }) {
  const ref = useRef<THREE.Group>(null);
  const { texture, ratio, spine: palette } = useBookCover(book);
  const spine = useCanvasTexture(96, 512, drawSpine(palette), undefined, `${palette.color}:${palette.ink}`);
  const toCenter = BOOKCASE.x - slot.x;
  const inset = Math.sign(toCenter) * Math.min(0.27, Math.max(0, Math.abs(toCenter) - 0.98));
  usePullOut(index, ref, -Math.PI / 2, true, inset);
  return (
    <group position={[slot.x, shelfY, ITEM_Z]}>
      <group ref={ref} onClick={selectBookOnClick(index)}>
        {/* La rotazione porta il dorso in avanti e lascia la copertina sul lato destro. */}
        <group rotation={[0, Math.PI / 2, 0]}>
          <BoundBook width={slot.h * ratio} height={slot.h} thickness={slot.w} color={palette.color} cover={texture} spine={spine} />
        </group>
      </group>
    </group>
  );
}

function CoverBook({ book, index, x, shelfY }: { book: Book; index: number; x: number; shelfY: number }) {
  const ref = useRef<THREE.Group>(null);
  const { texture, ratio } = useBookCover(book);
  usePullOut(index, ref, 0.15, false);
  return (
    <group position={[x, shelfY, ITEM_Z - 0.02]}>
      <group ref={ref} onClick={selectBookOnClick(index)}>
        <group rotation={[-0.12, 0, 0]}>
          <BoundBook width={0.235 * ratio} height={0.235} thickness={0.024} color={book.color} cover={texture} />
        </group>
      </group>
    </group>
  );
}

function Spines({ slots, shelfY }: { slots: Slot[]; shelfY: number }) {
  const boxes = slots.flatMap((slot, index): BoxInstance[] => {
    const { x, w, h, color } = slot;
    const vinyl = w < 0.01;
    const depth = vinyl ? 0.31 : 0.15 + (index % 4) * 0.009;
    const body: BoxInstance = { position: [x, shelfY + h / 2, ITEM_Z], size: [w, h, depth], color };
    if (vinyl || index % 3 === 2) return [body];
    return [body, {
      position: [x, shelfY + h * 0.76, ITEM_Z + depth / 2 + 0.0004],
      size: [w * 0.66, 0.005, 0.001], color: index % 2 ? "#a48f72" : "#625447",
    }];
  });
  return <BoxInstances boxes={boxes} shadow />;
}

function Sleeve({ index, coverUrl, localCover, x }: { index: number; coverUrl: string | null; localCover: string | null; x: number }) {
  const remote = useRemoteTexture(coverUrl ? proxied(coverUrl, 384) : null);
  const local = useRemoteTexture(remote ? null : localCover);
  const placeholder = useCanvasTexture(256, 256, drawSleeve(index));
  return (
    <group position={[x, SHELVES[0], ITEM_Z - 0.04]} rotation={[-0.1, 0, 0]}>
      <mesh position={[0, 0.155, 0]} castShadow>
        <boxGeometry args={[0.31, 0.31, 0.006]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      <mesh position={[0, 0.155, 0.0035]}>
        <planeGeometry args={[0.31, 0.31]} />
        <meshStandardMaterial map={remote ?? local ?? placeholder} roughness={0.5} />
      </mesh>
    </group>
  );
}

function VinylShelf() {
  const spotify = useLive("spotify");
  const liveCovers = (spotify?.data?.topAlbums ?? []).flatMap(({ coverUrl }) => coverUrl ? [coverUrl] : []);
  const staticCovers = ALBUMS.flatMap(({ cover }) => cover ? [cover] : []);
  const count = Math.min(6, Math.max(3, liveCovers.length || staticCovers.length));
  const extra = count - 3;

  return [0, 1, 2].map((bay) => {
    const center = BOOKCASE.x + (bay - 1) * BAY_W;
    const start = bay + Math.min(bay, extra);
    const indexes = bay < extra ? [start, start + 1] : [start];
    const first = center - (indexes.length - 1) * 0.17;
    const last = center + (indexes.length - 1) * 0.17;
    return (
      <group key={bay}>
        <Spines slots={filler(bayStart(bay), first - 0.18, 31 + bay, true)} shelfY={SHELVES[0]} />
        {indexes.map((i, offset) => (
          <Sleeve key={i} index={i} coverUrl={liveCovers[i] ?? null} localCover={staticCovers[i] ?? null} x={first + offset * 0.34} />
        ))}
        <Spines slots={filler(last + 0.18, bayEnd(bay), 37 + bay, true)} shelfY={SHELVES[0]} />
      </group>
    );
  });
}

function Carcass() {
  const { x, z, w, h, d } = BOOKCASE;
  const { wood } = useStudioFinishes();
  // I LED sotto i ripiani si spengono quando si accende la luce rossa.
  const led = useDimmedEmissive({ color: "#dfc6a0", emissive: "#ffd4a0", base: 0.65 });
  const boards: Array<{ pos: [number, number, number]; size: [number, number, number]; color?: string }> = [
    { pos: [x, h / 2, z - d / 2 + 0.01], size: [w, h, 0.02], color: "#3b2a1e" },
    { pos: [x - w / 2, h / 2, z], size: [BOARD, h, d] },
    { pos: [x + w / 2, h / 2, z], size: [BOARD, h, d] },
    { pos: [x, h - BOARD / 2, z], size: [w, BOARD, d] },
    ...SHELVES.map((y): { pos: [number, number, number]; size: [number, number, number] } => ({
      pos: [x, y - BOARD / 2, z],
      size: [w, BOARD, d],
    })),
    ...[1, 2].map((i): { pos: [number, number, number]; size: [number, number, number] } => ({
      pos: [x - w / 2 + i * BAY_W, (SHELVES[0] + h) / 2, z],
      size: [BOARD, h - SHELVES[0], d],
    })),
  ];
  return (
    <group>
      {boards.map((b, i) => (
        <SoftBox key={i} position={b.pos} size={b.size} color={b.color ?? WOOD} map={wood} radius={0.005} shadow />
      ))}
      {[0, 1, 2].map((i) => (
        <group key={i} position={[x - w / 2 + (i + 0.5) * BAY_W, SHELVES[0] / 2, FRONT_Z]}>
          <SoftBox size={[BAY_W - 0.025, SHELVES[0] - 0.06, 0.026]} position={[0, 0.013, 0]} map={wood} color="#bb9d82" shadow />
          <SoftBox size={[BAY_W - 0.08, SHELVES[0] - 0.11, 0.008]} position={[0, 0.013, 0.015]} map={wood} color="#d4b493" radius={0.002} />
          <SoftBox size={[0.104, 0.011, 0.027]} position={[0, 0.126, 0.025]} color="#9f805b" metalness={0.58} roughness={0.33} />
          {[-0.037, 0.037].map((offset) => (
            <SoftBox key={offset} size={[0.012, 0.012, 0.02]} position={[offset, 0.126, 0.02]} color="#786146" metalness={0.5} />
          ))}
        </group>
      ))}
      <SoftBox position={[x, 0.023, FRONT_Z - 0.035]} size={[w - 0.02, 0.042, 0.08]} color="#302520" />
      {/* I diffusori sono incassati dietro il bordo del ripiano. */}
      {[SHELVES[1], SHELVES[2], h - BOARD].map((y) => (
        <group key={y} position={[x, y - BOARD - 0.002, FRONT_Z - 0.055]}>
          <SoftBox size={[w - 0.08, 0.011, 0.026]} color="#3b3029" />
          <mesh position={[0, -0.004, 0.004]} material={led}>
            <boxGeometry args={[w - 0.11, 0.004, 0.014]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** La libreria: libri con commento (titoli in lib/studio-content.ts) e vinili collegati a Spotify. */
export default function Bookcase() {
  const books = visible(BOOKS);

  const layout = useMemo(() => {
    const indexed = books.map((book, index) => ({ book, index }));
    // Ci sono tre posti per le copertine in vista: quelle in più vanno sullo scaffale di costa.
    const faceOut = indexed.filter((b) => b.book.faceOut);
    const covers = faceOut.slice(0, COVER_SLOTS);
    const spines = indexed.filter((b) => !b.book.faceOut).concat(faceOut.slice(COVER_SLOTS));
    const half = Math.ceil(spines.length / 2);
    const place = (group: typeof spines, bay: number) => {
      const rand = seeded(bay * 13 + 5);
      let x = bayStart(bay);
      return group.map((b) => {
        const w = 0.03 + rand() * 0.016;
        const slot: Slot = { x: x + w / 2, w, h: 0.21 + rand() * 0.05, color: b.book.color };
        x += w + 0.003;
        return { ...b, slot, end: x };
      });
    };
    const left = place(spines.slice(0, half), 0);
    const right = place(spines.slice(half), 2);
    return {
      left,
      right,
      covers,
      leftFill: filler(left.at(-1)?.end ?? bayStart(0), bayEnd(0), 11),
      rightFill: filler(right.at(-1)?.end ?? bayStart(2), bayEnd(2), 17),
    };
  }, [books]);

  const midX = BOOKCASE.x;

  return (
    <group>
      <Carcass />
      {/* Ripiano alto: libri di costa ai lati, copertine al centro */}
      {layout.left.map((b) => (
        <SpineBook key={b.book.title} book={b.book} index={b.index} slot={b.slot} shelfY={SHELVES[2]} />
      ))}
      <Spines slots={layout.leftFill} shelfY={SHELVES[2]} />
      {layout.covers.slice(0, 2).map((b, i) => (
        <CoverBook key={b.book.title} book={b.book} index={b.index} x={midX + (i === 0 ? -0.2 : 0.2)} shelfY={SHELVES[2]} />
      ))}
      {layout.right.map((b) => (
        <SpineBook key={b.book.title} book={b.book} index={b.index} slot={b.slot} shelfY={SHELVES[2]} />
      ))}
      <Spines slots={layout.rightFill} shelfY={SHELVES[2]} />

      {/* Ripiano centrale: altri libri e la terza copertina */}
      <Spines slots={filler(bayStart(0), bayStart(0) + 0.5, 23)} shelfY={SHELVES[1]} />
      {layout.covers.slice(2, 3).map((b) => (
        <CoverBook key={b.book.title} book={b.book} index={b.index} x={midX - 0.15} shelfY={SHELVES[1]} />
      ))}
      <ShelfPlant position={[midX + 0.22, SHELVES[1], ITEM_Z - 0.016]} />
      <StackedBooks position={[bayStart(2) + 0.24, SHELVES[1], ITEM_Z - 0.012]} />
      <ShelfLens position={[bayStart(2) + 0.55, SHELVES[1], ITEM_Z + 0.009]} />

      {/* Ripiano basso: i vinili, con in vista gli album più ascoltati */}
      <VinylShelf />
    </group>
  );
}
