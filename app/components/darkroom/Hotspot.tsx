"use client";

import { Html } from "@react-three/drei";
import { type ThreeEvent, useThree } from "@react-three/fiber";
import type { ReactNode } from "react";
import { getHotspot, type HotspotId, type Vec3 } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";

const DRAG_THRESHOLD_PX = 6;

interface HotspotProps {
  id: HotspotId;
  children: ReactNode;
  /** Spostamento del puntino-suggerimento rispetto al centro dell'oggetto. */
  dotOffset?: Vec3;
}

/**
 * Rende cliccabile un gruppo di oggetti. Va montato alla radice della scena,
 * così il puntino-suggerimento usa direttamente le coordinate mondo dell'hotspot.
 */
export default function Hotspot({ id, children, dotOffset = [0, 0.2, 0] }: HotspotProps) {
  const meta = getHotspot(id);
  const phase = useDarkroom((s) => s.phase);
  const focus = useDarkroom((s) => s.focus);
  const isHovered = useDarkroom((s) => s.hovered === id);
  const setHovered = useDarkroom((s) => s.setHovered);
  const setFocus = useDarkroom((s) => s.setFocus);
  const touch = useThree((state) => state.frameloop === "demand");

  const guideOpen = useDarkroom((s) => s.guideOpen);
  const interactive = phase === "room" && !guideOpen;
  const showHint = interactive && focus === null;

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    setHovered(id);
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (useDarkroom.getState().hovered === id) setHovered(null);
  };
  const activate = () => {
    if (focus !== id) setFocus(id);
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    // Un trascinamento per guardarsi intorno non deve aprire l'oggetto su cui finisce.
    if (!interactive || e.delta > DRAG_THRESHOLD_PX) return;
    e.stopPropagation();
    activate();
  };

  const [tx, ty, tz] = meta.pose.target;

  return (
    <>
      <group onPointerOver={touch ? undefined : onOver} onPointerOut={touch ? undefined : onOut} onClick={onClick}>
        {children}
      </group>
      {showHint && (
        <Html position={[tx + dotOffset[0], ty + dotOffset[1], tz + dotOffset[2]]} center zIndexRange={[20, 0]}>
          {/* Duplicato visivo della barra a pellicola, che è la navigazione accessibile. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className={`dr-hint${isHovered ? " is-hovered" : ""}`}
            onClick={activate}
            onPointerEnter={touch ? undefined : () => setHovered(id)}
            onPointerLeave={touch ? undefined : () => setHovered(null)}
          >
            <span className="dr-hint__dot" />
            <span className="dr-hint__label">
              <span className="dr-hint__frame">{meta.frame}</span>
              {meta.label}
            </span>
          </button>
        </Html>
      )}
    </>
  );
}

/**
 * Clic su un singolo oggetto dentro un hotspot (una stampa, una foto): apre l'hotspot
 * e poi segnala quale oggetto è stato scelto, così il pannello si posiziona su di lui.
 */
export function useItemClick(id: HotspotId, onSelect: () => void): (e: ThreeEvent<MouseEvent>) => void {
  return (e) => {
    const { phase, guideOpen, focus, setFocus } = useDarkroom.getState();
    if (phase !== "room" || guideOpen || e.delta > DRAG_THRESHOLD_PX) return;
    e.stopPropagation();
    if (focus !== id) setFocus(id);
    onSelect();
  };
}
