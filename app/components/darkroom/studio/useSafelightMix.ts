"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useDarkroom } from "@/lib/darkroom/store";
import { useReducedMotion } from "../useReducedMotion";

/** Velocità della dissolvenza tra luce calda e luce di sicurezza (più alto = più rapido). */
const FADE_LAMBDA = 3.2;
const SETTLE = 0.002;

/**
 * 0 = studio con le luci calde, 1 = solo luce di sicurezza.
 * Il valore sfuma nel tempo; con frameloop "demand" (mobile) chiede fotogrammi solo mentre cambia.
 */
export function useSafelightMix(): RefObject<number> {
  const mix = useRef(useDarkroom.getState().safelight ? 1 : 0);
  const reduced = useReducedMotion();

  useFrame((state, delta) => {
    const goal = useDarkroom.getState().safelight ? 1 : 0;
    if (reduced || Math.abs(mix.current - goal) < SETTLE) {
      mix.current = goal;
      return;
    }
    mix.current = THREE.MathUtils.damp(mix.current, goal, FADE_LAMBDA, Math.min(delta, 0.05));
    state.invalidate();
  });

  return mix;
}

interface EmissiveLook {
  color: string;
  emissive: string;
  /** Intensità con le luci calde accese. */
  base: number;
  /** Frazione che resta con la luce di sicurezza accesa (le lampade calde quasi si spengono). */
  keep?: number;
}

/**
 * Materiale luminoso condiviso (LED, lampadine) che si spegne quando si accende la luce rossa.
 * Un solo materiale per tutte le mesh che lo usano: si aggiorna una volta per fotogramma.
 */
export function useDimmedEmissive({ color, emissive, base, keep = 0.05 }: EmissiveLook): THREE.MeshStandardMaterial {
  const mix = useSafelightMix();
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: base }),
    [color, emissive, base],
  );
  useEffect(() => () => material.dispose(), [material]);
  useFrame(() => {
    material.emissiveIntensity = base * (1 - (1 - keep) * mix.current);
  });
  return material;
}
