"use client";

import { ArrowRight, Compass, Lightbulb, LightbulbOff, Volume2, VolumeX, X } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import type { HotspotMeta } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";
import { playSwitch } from "./sound";

/** Accende o spegne la luce di sicurezza, con lo scatto dell'interruttore se il suono è attivo. */
export function flipSafelight(): void {
  const { safelight, soundOn, toggleSafelight } = useDarkroom.getState();
  if (soundOn) playSwitch(!safelight);
  toggleSafelight();
}

export default function CompactNav({ frames, onSelect }: {
  frames: readonly HotspotMeta[];
  onSelect: (id: HotspotMeta["id"]) => void;
}) {
  const menu = useRef<HTMLDialogElement>(null);
  const soundOn = useDarkroom((state) => state.soundOn);
  const safelight = useDarkroom((state) => state.safelight);
  const setGuideOpen = useDarkroom((state) => state.setGuideOpen);
  const toggleSound = useDarkroom((state) => state.toggleSound);

  function dismissBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
      event.currentTarget.close();
    }
  }

  return (
    <>
      <nav className="dr-compact-nav" aria-label="Esplorazione dello studio">
        <button type="button" onClick={() => menu.current?.showModal()} aria-haspopup="dialog" aria-controls="dr-explore">
          <Compass size={17} aria-hidden="true" />
          Esplora
        </button>
        <button type="button" onClick={flipSafelight} aria-pressed={safelight} className="dr-safelight-toggle">
          {safelight ? <LightbulbOff size={17} aria-hidden="true" /> : <Lightbulb size={17} aria-hidden="true" />}
          Luce rossa
        </button>
      </nav>
      <dialog id="dr-explore" ref={menu} className="dr-explore" aria-labelledby="dr-explore-title" onClick={dismissBackdrop}>
        <header className="dr-explore__head">
          <h2 id="dr-explore-title">Lo studio</h2>
          <button type="button" className="dr-icon-button" onClick={() => menu.current?.close()} aria-label="Chiudi Esplora" autoFocus>
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <ul className="dr-explore__list">
          {frames.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => { menu.current?.close(); onSelect(item.id); }}>
                {item.label}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <footer className="dr-explore__tools">
          <button type="button" onClick={() => { menu.current?.close(); setGuideOpen(true); }}>Guida</button>
          <button type="button" onClick={toggleSound} aria-pressed={soundOn}>
            {soundOn ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
            Suono
          </button>
        </footer>
      </dialog>
    </>
  );
}
