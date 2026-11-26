"use client";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
import type { Group } from "three";
import { useDarkroom } from "@/lib/darkroom/store";
import { proxied } from "@/lib/live/image";
import { useLive } from "@/lib/live/useLive";
import { ALBUMS } from "@/lib/studio-content";
import { ROOM } from "../objects/Room";
import { useCanvasTexture } from "../textures";
import { useReducedMotion } from "../useReducedMotion";
import { drawNowPlayingCard } from "./desk-textures";
import { SoftBox, useStudioFinishes } from "./StudioFinishes";
import { drawGrooves, drawSleeve, useLiveCanvasTexture } from "./studio-textures";
import { useRemoteTexture } from "./useRemoteTexture";

export const CONSOLE = { x: 1.06, z: -1.775, w: 0.8, h: 0.6, d: 0.45 } as const;
const RPM_33 = (33.333 / 60) * Math.PI * 2;
const ARM_REST = 0.02;
const ARM_PLAYING = -0.58;
const BLACK = "#222626";
const SILVER = "#a2a19a";

function Speaker({ x }: { x: number }) {
  const { fabric, wood } = useStudioFinishes();
  return (
    <group position={[x, CONSOLE.h, CONSOLE.z + 0.02]}>
      <SoftBox position={[0, 0.135, 0]} size={[0.145, 0.27, 0.18]} color="#ab896b" map={wood} radius={0.009} shadow />
      <SoftBox position={[0, 0.136, 0.093]} size={[0.129, 0.252, 0.012]} color="#3f4443" map={fabric} radius={0.005} />
      {[{ y: 0.094, radius: 0.045 }, { y: 0.199, radius: 0.021 }].map(({ y, radius }) => (
        <group key={y} position={[0, y, 0.101]}>
          <mesh>
            <torusGeometry args={[radius, 0.003, 8, 26]} />
            <meshStandardMaterial color="#777369" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.0003]}>
            <circleGeometry args={[radius - 0.002, 26]} />
            <meshStandardMaterial color="#252928" roughness={0.92} />
          </mesh>
          <mesh scale={[radius * 0.43, radius * 0.43, radius * 0.13]}>
            <sphereGeometry args={[1, 16, 8]} />
            <meshStandardMaterial color="#4e5552" roughness={0.72} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AudioCabinet() {
  const { x, z, w, h, d } = CONSOLE;
  const { wood } = useStudioFinishes();
  return (
    <group position={[x, 0, z]}>
      <SoftBox position={[0, 0.03, 0]} size={[w - 0.12, 0.06, d - 0.10]} color="#292724" />
      <SoftBox position={[0, 0.079, 0]} size={[w, 0.038, d]} color="#bd9876" map={wood} shadow />
      <SoftBox position={[0, h - 0.021, 0]} size={[w, 0.042, d]} color="#c9a384" map={wood} shadow />
      {[-1, 1].map((side) => (
        <SoftBox key={side} position={[side * (w / 2 - 0.018), 0.336, 0]} size={[0.036, 0.48, d - 0.015]} color="#ac9076" map={wood} shadow />
      ))}
      <SoftBox position={[0, 0.33, -0.198]} size={[w - 0.065, 0.45, 0.025]} color="#2d2825" />
      <SoftBox position={[0, 0.258, 0]} size={[w - 0.065, 0.028, d - 0.025]} color="#b1977c" map={wood} />
      <SoftBox position={[0, 0.177, 0.205]} size={[w - 0.087, 0.147, 0.025]} color="#c9a383" map={wood} />
      <SoftBox position={[0, 0.214, 0.224]} size={[0.112, 0.012, 0.022]} color="#a68760" metalness={0.53} />
      <group position={[0, 0.316, 0.016]}>
        <SoftBox size={[0.52, 0.087, 0.35]} color={BLACK} />
        <SoftBox position={[0, 0, 0.176]} size={[0.5, 0.071, 0.008]} color="#606462" metalness={0.36} />
        <SoftBox position={[-0.089, 0.006, 0.181]} size={[0.185, 0.025, 0.004]} color="#101c1a" radius={0.001} />
        {[0.065, 0.114, 0.194].map((x, i) => (
          <mesh key={x} position={[x, 0, 0.189]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[i === 2 ? 0.021 : 0.012, i === 2 ? 0.021 : 0.012, 0.018, 18]} />
            <meshStandardMaterial color={SILVER} metalness={0.66} roughness={0.43} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const LEDGE = { x: CONSOLE.x, y: 1.06, w: 0.52 } as const;
const SLEEVE = 0.31;

interface ShownRecord {
  label: string;
  title: string;
  artist: string;
  cover: string | null;
}

/** Cosa mettere sul leggio: il disco in ascolto, altrimenti il più ascoltato del mese o un preferito. */
function useShownRecord(): ShownRecord {
  const spotify = useLive("spotify");
  const track = spotify?.data?.track ?? null;
  const top = spotify?.data?.topAlbums[0] ?? null;
  if (track?.isPlaying) {
    return { label: "IN ASCOLTO ORA", title: track.album || track.title, artist: track.artist, cover: track.coverUrl ? proxied(track.coverUrl, 384) : null };
  }
  if (top) {
    return { label: "IN ROTAZIONE", title: top.name, artist: top.artist, cover: top.coverUrl ? proxied(top.coverUrl, 384) : null };
  }
  const favourite = ALBUMS[0];
  return { label: "PREFERITO", title: favourite.title, artist: favourite.artist, cover: favourite.cover ? proxied(favourite.cover, 384) : null };
}

/** La mensola sopra il giradischi: la copertina in piedi, come si fa con il disco sul piatto. */
function NowPlayingLedge() {
  const shown = useShownRecord();
  const { wood } = useStudioFinishes();
  const cover = useRemoteTexture(shown.cover);
  const fallback = useCanvasTexture(256, 256, drawSleeve(0));
  const card = useLiveCanvasTexture(256, 96, drawNowPlayingCard(shown.label, shown.title, shown.artist), [shown.label, shown.title, shown.artist]);
  const z = ROOM.backZ;
  return (
    <group position={[LEDGE.x, LEDGE.y, z]}>
      <SoftBox position={[0, 0, 0.04]} size={[LEDGE.w, 0.022, 0.08]} color="#c39f7f" map={wood} shadow />
      <SoftBox position={[0, 0.019, 0.074]} size={[LEDGE.w, 0.016, 0.01]} color="#a8845f" map={wood} />
      <group position={[-0.07, 0.011 + SLEEVE / 2, 0.045]} rotation={[-0.09, 0, 0]}>
        <SoftBox size={[SLEEVE, SLEEVE, 0.006]} color="#1e1b19" radius={0.0015} shadow />
        <mesh position={[0, 0, 0.0032]}>
          <planeGeometry args={[SLEEVE - 0.004, SLEEVE - 0.004]} />
          <meshStandardMaterial map={cover ?? fallback} roughness={0.7} />
        </mesh>
      </group>
      <group position={[0.185, 0.011 + 0.026, 0.06]} rotation={[-0.16, -0.12, 0]}>
        <mesh>
          <planeGeometry args={[0.13, 0.049]} />
          <meshStandardMaterial map={card} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/** Il piatto e il braccio reagiscono allo stato di riproduzione di Spotify. */
export default function HiFi() {
  const spotify = useLive("spotify");
  const track = spotify?.data?.track ?? null;
  const playing = track?.isPlaying ?? false;
  const reduced = useReducedMotion();
  const record = useRef<Group>(null);
  const arm = useRef<Group>(null);
  const { wood } = useStudioFinishes();
  const grooves = useCanvasTexture(512, 512, drawGrooves);
  const label = useRemoteTexture(track?.coverUrl ? proxied(track.coverUrl, 256) : null);

  useFrame(({ frameloop, invalidate }, dt) => {
    const touch = frameloop === "demand";
    const active = !touch || useDarkroom.getState().focus === "musica";
    const step = touch ? Math.min(dt, 0.05) : dt;
    if (record.current && playing && !reduced && active) {
      record.current.rotation.y -= RPM_33 * step;
      if (touch) invalidate();
    }
    if (arm.current) {
      const angle = playing ? ARM_PLAYING : ARM_REST;
      if (reduced || !active) arm.current.rotation.y = angle;
      else {
        easing.damp(arm.current.rotation, "y", angle, 0.8, step);
        if (touch && Math.abs(arm.current.rotation.y - angle) > 0.005) invalidate();
      }
    }
  });

  return (
    <group>
      <NowPlayingLedge />
      <AudioCabinet />
      <Speaker x={CONSOLE.x - 0.32} />
      <Speaker x={CONSOLE.x + 0.32} />
      <group position={[CONSOLE.x, CONSOLE.h, CONSOLE.z + 0.03]}>
        {[-0.159, 0.159].map((x) => (
          <SoftBox key={x} size={[0.04, 0.02, 0.275]} position={[x, 0.012, 0]} color="#292726" />
        ))}
        <SoftBox size={[0.42, 0.055, 0.34]} position={[0, 0.044, 0]} color="#d4b394" map={wood} roughness={0.42} shadow />
        <SoftBox size={[0.405, 0.008, 0.325]} position={[0, 0.074, 0]} color="#414644" roughness={0.48} metalness={0.3} />
        <mesh position={[-0.04, 0.081, 0.006]}>
          <cylinderGeometry args={[0.149, 0.151, 0.013, 56]} />
          <meshStandardMaterial color="#989990" metalness={0.65} roughness={0.43} />
        </mesh>
        <group ref={record} position={[-0.04, 0.089, 0.006]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.145, 56]} />
            <meshStandardMaterial map={grooves} roughness={0.36} metalness={0.24} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0008, 0]}>
            <circleGeometry args={[0.047, 32]} />
            {/* La chiave rimonta il materiale: three.js non ricompila lo shader quando una mappa compare dopo. */}
            <meshStandardMaterial key={label ? "cover" : "plain"} map={label} color={label ? "#ffffff" : "#8a4937"} roughness={0.64} />
          </mesh>
        </group>
        <mesh position={[-0.04, 0.094, 0.006]}>
          <cylinderGeometry args={[0.0027, 0.0027, 0.011, 12]} />
          <meshStandardMaterial color={SILVER} roughness={0.3} metalness={0.63} />
        </mesh>
        <group ref={arm} position={[0.15, 0.083, -0.112]}>
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.018, 0.021, 0.024, 18]} />
            <meshStandardMaterial color={SILVER} metalness={0.76} roughness={0.36} />
          </mesh>
          <mesh position={[0, 0.027, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.028, 16]} />
            <meshStandardMaterial color={BLACK} metalness={0.45} roughness={0.45} />
          </mesh>
          <mesh position={[-0.009, 0.027, 0.099]} rotation={[Math.PI / 2, 0, 0.09]}>
            <cylinderGeometry args={[0.0032, 0.0032, 0.204, 10]} />
            <meshStandardMaterial color="#bdbab0" metalness={0.73} roughness={0.31} />
          </mesh>
          <SoftBox size={[0.018, 0.012, 0.029]} position={[-0.021, 0.018, 0.213]} color="#242523" radius={0.004} />
        </group>
        {/* La cerniera tiene il coperchio aperto sopra il piatto. */}
        <group position={[0, 0.082, -0.153]} rotation={[-1.28, 0, 0]}>
          <mesh position={[0, 0, 0.157]}>
            <boxGeometry args={[0.418, 0.004, 0.314]} />
            <meshPhysicalMaterial color="#a9b5ad" transparent opacity={0.15} depthWrite={false} roughness={0.22} clearcoat={0.75} />
          </mesh>
          {[-0.206, 0.206].map((x) => (
            <SoftBox key={x} size={[0.005, 0.009, 0.315]} position={[x, 0, 0.157]} color="#646d65" />
          ))}
          <SoftBox size={[0.414, 0.009, 0.005]} position={[0, 0, 0.315]} color="#777f76" />
        </group>
        <mesh position={[0.15, 0.048, 0.171]}>
          <circleGeometry args={[0.004, 12]} />
          <meshStandardMaterial color="#31413a" emissive={playing ? "#76ffc2" : "#a06e46"} emissiveIntensity={playing ? 1.6 : 0.55} />
        </mesh>
      </group>
    </group>
  );
}
