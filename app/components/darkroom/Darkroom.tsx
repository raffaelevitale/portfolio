"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDarkroom } from "@/lib/darkroom/store";
import Guide from "./Guide";
import Hud from "./Hud";
import Panel from "./Panel";
import SceneBoundary from "./SceneBoundary";
import Shutter from "./Shutter";
import { playShutter, startAmbience } from "./sound";
import { useCompactLayout, useTouchInput } from "./useViewportMode";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const GUIDE_KEY = "dr-guide-seen";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

/** Shell dello studio: monta la scena 3D e tutta l'interfaccia HTML sopra di essa. */
export default function Darkroom() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const compact = useCompactLayout();
  const touch = useTouchInput();
  const onUnavailable = useCallback(() => setWebgl(false), []);
  const phase = useDarkroom((s) => s.phase);
  const soundOn = useDarkroom((s) => s.soundOn);
  const safelight = useDarkroom((s) => s.safelight);

  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  // Esc riporta indietro di un livello: pannello → stanza, guida → stanza.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const { focus, guideOpen, setFocus, setGuideOpen } = useDarkroom.getState();
      if (guideOpen) setGuideOpen(false);
      else if (focus) setFocus(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // La guida si apre da sola solo alla prima visita della sessione.
  useEffect(() => {
    if (phase !== "room" || compact || !webgl) return;
    try {
      if (sessionStorage.getItem(GUIDE_KEY)) return;
      sessionStorage.setItem(GUIDE_KEY, "1");
    } catch {
      // sessionStorage può essere bloccato (modalità privata): mostriamo comunque la guida.
    }
    useDarkroom.getState().setGuideOpen(true);
  }, [phase, compact, webgl]);

  useEffect(() => {
    if (!soundOn || phase === "intro" || !webgl) return;
    return startAmbience();
  }, [soundOn, phase, webgl]);

  const handleEnter = () => {
    if (useDarkroom.getState().soundOn) playShutter();
    useDarkroom.getState().enter();
  };

  return (
    <main className="dr-root" data-phase={phase} data-safelight={safelight || undefined} data-compact={compact || undefined} data-touch={touch || undefined}>
      {webgl && <SceneBoundary onUnavailable={onUnavailable}><Scene compact={compact} touch={touch} onUnavailable={onUnavailable} /></SceneBoundary>}
      <p className="dr-sr" aria-live="polite">
        {phase === "room" ? (safelight ? "Luce di sicurezza accesa: lo studio è diventato una camera oscura." : "Sei nello studio.") : ""}
      </p>
      {phase === "intro" || webgl ? <Shutter webgl={webgl} compact={compact} onEnter={handleEnter} /> : (
        <section className="dr-scene-unavailable">
          <h1>La stanza 3D si è interrotta</h1>
          <Link href="/lavori" className="dr-button dr-button--primary">Sfoglia i provini</Link>
        </section>
      )}
      {phase !== "intro" && webgl && (
        <>
          <Hud compact={compact} touch={touch} />
          <Guide compact={compact} />
          <Panel compact={compact} />
        </>
      )}
    </main>
  );
}
