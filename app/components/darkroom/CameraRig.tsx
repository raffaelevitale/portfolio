"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getHotspot, INTRO_POSE, poseFor, ROOM_POSES } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";
import { useReducedMotion } from "./useReducedMotion";

const NARROW_ASPECT = 0.85;
/** Angolo di campo orizzontale desiderato: tutta la stanza resta in quadro anche a 4:3. */
const TARGET_HFOV_DEG = 78;
const FOV_MIN = 44;
const FOV_MAX_WIDE = 64;
const FOV_MAX_NARROW = 72;

function fovFor(aspect: number, narrow: boolean): number {
  const half = THREE.MathUtils.degToRad(TARGET_HFOV_DEG / 2);
  const vertical = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(half) / aspect));
  return THREE.MathUtils.clamp(vertical, FOV_MIN, narrow ? FOV_MAX_NARROW : FOV_MAX_WIDE);
}
const ARRIVAL_DISTANCE = 0.08;
/** Dimensioni allineate al pannello in darkroom-mobile.css e darkroom-panel.css. */
const PANEL_MAX_WIDTH = 460;
const PANEL_WIDTH_RATIO = 0.42;
const COMPACT_PANEL_MAX_WIDTH = 330;
const COMPACT_PANEL_WIDTH_RATIO = 0.46;
const SHEET_HEIGHT_RATIO = 0.52;

const MAX_YAW = 0.75;
const YAW_PER_PIXEL = 0.004;

/** Trascinando sulla stanza ci si guarda intorno (rotazione orizzontale limitata). */
function useDragLook(): RefObject<number> {
  const yaw = useRef(0);
  const element = useThree((s) => s.gl.domElement);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let pointerId: number | null = null;
    let startX = 0;
    let startYaw = 0;
    const down = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return;
      const { phase, focus, guideOpen, switching } = useDarkroom.getState();
      if (phase !== "room" || focus || guideOpen || switching) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startYaw = yaw.current;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const { phase, focus } = useDarkroom.getState();
      if (phase !== "room" || focus) return;
      yaw.current = THREE.MathUtils.clamp(startYaw + (e.clientX - startX) * YAW_PER_PIXEL, -MAX_YAW, MAX_YAW);
      invalidate();
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId === pointerId) pointerId = null;
    };
    element.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      element.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [element, invalidate]);

  return yaw;
}

/** Muove la camera verso la posa dell'oggetto a fuoco, con un leggero parallasse in esplorazione libera. */
export default function CameraRig({ compact, touch }: { compact: boolean; touch: boolean }) {
  const phase = useDarkroom((s) => s.phase);
  const focus = useDarkroom((s) => s.focus);
  const arrive = useDarkroom((s) => s.arrive);
  const reduced = useReducedMotion();
  const yaw = useDragLook();
  const lookDir = useMemo(() => new THREE.Vector3(), []);

  const room = useDarkroom((s) => s.room);
  const look = useRef(new THREE.Vector3(...INTRO_POSE.target));
  const goalPos = useMemo(() => new THREE.Vector3(), []);
  const goalLook = useMemo(() => new THREE.Vector3(), []);
  const offset = useRef({ x: 0, y: 0 });
  const lastRoom = useRef(room);

  useFrame((state, delta) => {
    const { camera, size, pointer } = state;
    if (size.height === 0 || size.width === 0) return;
    const dt = touch ? Math.min(delta, 0.05) : delta;

    // Appena attraversata la porta (a schermo nero) si riparte dalla soglia della nuova stanza.
    if (lastRoom.current !== room) {
      lastRoom.current = room;
      const entry = ROOM_POSES[room].entry;
      camera.position.set(...entry.position);
      look.current.set(...entry.target);
      yaw.current = 0;
    }

    const aspect = size.width / size.height;
    const narrow = aspect < NARROW_ASPECT;
    const sheet = compact && size.height >= size.width;
    const pose = phase === "intro" ? INTRO_POSE : poseFor(room, focus, narrow);
    goalPos.set(...pose.position);
    goalLook.set(...pose.target);

    if (focus !== null) {
      yaw.current = THREE.MathUtils.damp(yaw.current, 0, 4, dt);
    }
    if (phase === "room" && Math.abs(yaw.current) > 0.0005) {
      lookDir.subVectors(goalLook, goalPos).applyAxisAngle(THREE.Object3D.DEFAULT_UP, yaw.current);
      goalLook.copy(goalPos).add(lookDir);
    }

    if (!reduced && !touch && phase === "room") {
      if (focus === null) {
        goalPos.x += pointer.x * 0.35;
        goalPos.y += pointer.y * 0.12;
      } else {
        goalLook.x += pointer.x * 0.05;
        goalLook.y += pointer.y * 0.03;
      }
    }

    if (reduced) {
      camera.position.copy(goalPos);
      look.current.copy(goalLook);
    } else {
      const smooth = touch ? (phase === "entering" ? 0.56 : 0.32) : (phase === "entering" ? 1.15 : 0.55);
      easing.damp3(camera.position, goalPos, smooth, dt);
      easing.damp3(look.current, goalLook, smooth * 0.9, dt);
    }
    camera.lookAt(look.current);

    const perspective = camera as THREE.PerspectiveCamera;
    const overview = phase === "room" && !focus;
    const baseFov = fovFor(aspect, narrow);
    const fov = sheet && overview ? Math.min(59, baseFov) : baseFov;
    if (Math.abs(perspective.fov - fov) > 0.015) {
      if (reduced || !compact) perspective.fov = fov;
      else easing.damp(perspective, "fov", fov, 0.32, dt);
      perspective.updateProjectionMatrix();
    }

    // Con il pannello aperto spostiamo il centro ottico, invece della camera,
    // così l'oggetto a fuoco resta nella parte di schermo libera.
    const panelOpen = phase === "room" && focus !== null && !getHotspot(focus).leadsTo;
    const panelWidth = compact
      ? Math.min(COMPACT_PANEL_MAX_WIDTH, size.width * COMPACT_PANEL_WIDTH_RATIO)
      : Math.min(PANEL_MAX_WIDTH, size.width * PANEL_WIDTH_RATIO);
    const goalX = panelOpen && !sheet ? panelWidth / 2 : 0;
    const goalY = sheet ? size.height * (panelOpen ? SHEET_HEIGHT_RATIO / 2 : overview ? 0.065 : 0) : 0;
    if (reduced) {
      offset.current.x = goalX;
      offset.current.y = goalY;
    } else {
      easing.damp(offset.current, "x", goalX, 0.3, dt);
      easing.damp(offset.current, "y", goalY, 0.3, dt);
    }
    if (Math.abs(offset.current.x) < 0.5 && Math.abs(offset.current.y) < 0.5) {
      if (perspective.view?.enabled) perspective.clearViewOffset();
    } else if (!perspective.view?.enabled
      || perspective.view.fullWidth !== size.width || perspective.view.fullHeight !== size.height
      || Math.abs(perspective.view.offsetX - offset.current.x) > 0.05
      || Math.abs(perspective.view.offsetY - offset.current.y) > 0.05) {
      perspective.setViewOffset(size.width, size.height, offset.current.x, offset.current.y, size.width, size.height);
    }

    if (phase === "entering" && camera.position.distanceTo(goalPos) < ARRIVAL_DISTANCE) {
      arrive();
    }
    // La camera richiede altri fotogrammi soltanto mentre raggiunge l'inquadratura.
    if (touch && (phase === "entering"
      || camera.position.distanceToSquared(goalPos) > 0.000001
      || look.current.distanceToSquared(goalLook) > 0.000001
      || Math.abs(offset.current.x - goalX) > 0.2 || Math.abs(offset.current.y - goalY) > 0.2
      || Math.abs(perspective.fov - fov) > 0.025)) state.invalidate();
  });

  return null;
}
