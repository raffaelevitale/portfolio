"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { INTRO_POSE, type RoomId } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";
import CameraRig from "./CameraRig";
import Effects from "./Effects";
import { HoverLight } from "./Lights";
import MobileFrames from "./MobileFrames";
import DarkroomRoom from "./rooms/DarkroomRoom";
import StudioRoom from "./rooms/StudioRoom";
import { prepareFonts } from "./textures";

/** Atmosfera di ogni stanza: il nero della camera oscura è rosso, quello dello studio è caldo. */
const ATMOSPHERE: Record<RoomId, { background: string; fog: string }> = {
  darkroom: { background: "#060304", fog: "#080405" },
  studio: { background: "#0b0806", fog: "#0e0a07" },
};

/** Segnala allo shell che tutto (font, texture, ritratto) è pronto: l'otturatore può aprirsi. */
function Ready() {
  const markSceneReady = useDarkroom((s) => s.markSceneReady);
  useEffect(() => {
    markSceneReady();
  }, [markSceneReady]);
  return null;
}

function CursorSync() {
  const hovered = useDarkroom((s) => s.hovered);
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);
  return null;
}

function ContextRecovery({ onUnavailable }: { onUnavailable: () => void }) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    canvas.addEventListener("webglcontextlost", onUnavailable);
    return () => canvas.removeEventListener("webglcontextlost", onUnavailable);
  }, [canvas, onUnavailable]);
  return null;
}

export default function Scene({ compact, touch, onUnavailable }: {
  compact: boolean; touch: boolean; onUnavailable: () => void;
}) {
  const [fontsReady, setFontsReady] = useState(false);
  const room = useDarkroom((s) => s.room);
  const atmosphere = ATMOSPHERE[room];

  useEffect(() => {
    let alive = true;
    prepareFonts().then(() => {
      if (alive) setFontsReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Canvas
      className="dr-canvas"
      shadows={!touch}
      frameloop={touch ? "demand" : "always"}
      dpr={touch ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: touch, powerPreference: touch ? "default" : "high-performance", stencil: false }}
      camera={{ fov: 46, near: 0.05, far: 30, position: [...INTRO_POSE.position] }}
    >
      <color attach="background" args={[atmosphere.background]} />
      <fog attach="fog" args={[atmosphere.fog, 7, 14]} />
      <ContextRecovery onUnavailable={onUnavailable} />
      {fontsReady && (
        <Suspense fallback={null}>
          {room === "darkroom" ? <DarkroomRoom /> : <StudioRoom />}
          <Ready />
        </Suspense>
      )}
      <CameraRig compact={compact} touch={touch} />
      {touch ? <MobileFrames /> : <><HoverLight /><CursorSync /><Effects /></>}
    </Canvas>
  );
}
