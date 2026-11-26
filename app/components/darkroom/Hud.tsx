"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PERSON } from "@/lib/content";
import { getHotspot, HOTSPOTS, type HotspotId } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";
import CompactNav, { flipSafelight } from "./CompactNav";
import { playAdvance } from "./sound";

/** Intestazione, didascalia dell'oggetto sotto il puntatore e la striscia di pellicola per navigare. */
export default function Hud({ compact, touch }: { compact: boolean; touch: boolean }) {
  const phase = useDarkroom((s) => s.phase);
  const focus = useDarkroom((s) => s.focus);
  const hovered = useDarkroom((s) => s.hovered);
  const soundOn = useDarkroom((s) => s.soundOn);
  const safelight = useDarkroom((s) => s.safelight);
  const setFocus = useDarkroom((s) => s.setFocus);
  const setGuideOpen = useDarkroom((s) => s.setGuideOpen);
  const toggleSound = useDarkroom((s) => s.toggleSound);

  const film = useRef<HTMLOListElement>(null);

  // Il fotogramma attivo resta sempre visibile anche quando la pellicola è stretta.
  useEffect(() => {
    film.current?.querySelector(".is-active")?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [focus]);

  const hoveredMeta = hovered && !focus && !touch ? getHotspot(hovered) : null;

  const go = (id: HotspotId) => {
    if (soundOn) playAdvance();
    setFocus(id);
  };

  return (
    <div className="dr-hud">
      <header className="dr-hud__top">
        <button type="button" className="dr-hud__brand" onClick={() => setFocus(null)}>
          <span className="dr-hud__name">{PERSON.name}</span>
          <span className="dr-hud__room">{safelight ? "Camera oscura" : "Studio"}</span>
        </button>
        <nav className="dr-hud__links" aria-label="Sito">
          <Link href="/lavori">Provini</Link>
          {!compact && (
            <button type="button" onClick={flipSafelight} aria-pressed={safelight} className="dr-safelight-toggle">
              <span className="dr-safelight-toggle__bulb" aria-hidden="true" />
              Luce rossa
            </button>
          )}
          {!compact && <button type="button" onClick={() => setGuideOpen(true)}>
            Guida
          </button>}
          {!compact && <button type="button" onClick={toggleSound} aria-pressed={soundOn} className="dr-hud__sound">
            <span className={`dr-bars${soundOn ? " is-on" : ""}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            Suono
          </button>}
        </nav>
      </header>

      <p className={`dr-hud__caption${hoveredMeta ? " is-visible" : ""}`} aria-hidden="true">
        {hoveredMeta && (
          <>
            <span className="dr-hud__caption-object">{hoveredMeta.object}</span>
            <span className="dr-hud__caption-hint">{hoveredMeta.hint}</span>
          </>
        )}
      </p>

      {!focus && touch && phase === "room" && (
        <p className="dr-hud__drag" aria-hidden="true">
          Tocca un oggetto · trascina per guardarti intorno
        </p>
      )}

      {compact ? (!focus && phase === "room" && <CompactNav frames={HOTSPOTS} onSelect={go} />) : (
      <nav className="dr-film" aria-label="Oggetti nello studio">
        <ol ref={film} className="dr-film__frames">
          {HOTSPOTS.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                className={`dr-film__frame${focus === h.id ? " is-active" : ""}`}
                aria-current={focus === h.id ? "true" : undefined}
                onClick={() => go(h.id)}
                onPointerEnter={() => !touch && !focus && useDarkroom.getState().setHovered(h.id)}
                onPointerLeave={() => useDarkroom.getState().setHovered(null)}
              >
                <span className="dr-film__num">{h.frame}A</span>
                <span className="dr-film__label">{h.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>)}
    </div>
  );
}
