"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { type HotspotId, getHotspot, hotspotsIn } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";
import { CinemaPanel, DeskPanel, GamingPanel, MusicPanel } from "./panels/LivePanels";
import { AboutPanel, ContactPanel, CvPanel } from "./panels/PersonPanels";
import { LibraryPanel, ShowcasePanel } from "./panels/StudioPanels";
import { ProcessPanel, ServicesPanel, WorkPanel } from "./panels/WorkPanels";
import { playAdvance } from "./sound";

function PanelBody({ id, compact }: { id: HotspotId; compact: boolean }) {
  switch (id) {
    case "lavori":
      return <WorkPanel />;
    case "processo":
      return <ProcessPanel />;
    case "servizi":
      return <ServicesPanel />;
    case "chi-sono":
      return <AboutPanel />;
    case "cv":
      return <CvPanel />;
    case "contatti":
      return <ContactPanel />;
    case "libreria":
      return <LibraryPanel compact={compact} />;
    case "musica":
      return <MusicPanel />;
    case "cinema":
      return <CinemaPanel />;
    case "scrivania":
      return <DeskPanel />;
    case "vetrina":
      return <ShowcasePanel />;
    case "gioco":
      return <GamingPanel />;
    case "porta-studio":
    case "porta-camera":
      return null;
  }
}

/** Il foglio che scorre sopra la stanza quando un oggetto è a fuoco. */
export default function Panel({ compact }: { compact: boolean }) {
  const focus = useDarkroom((s) => s.focus);
  const room = useDarkroom((s) => s.room);
  const soundOn = useDarkroom((s) => s.soundOn);
  const setFocus = useDarkroom((s) => s.setFocus);
  const mobileBook = useDarkroom((s) => compact ? s.selectedBook : null);
  const heading = useRef<HTMLHeadingElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focus) return;
    body.current?.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, [focus, compact]);

  useEffect(() => {
    if (compact && mobileBook !== null) body.current?.scrollTo({ top: 0 });
  }, [compact, mobileBook]);

  // Le porte non hanno un pannello: portano nell'altra stanza.
  if (!focus || getHotspot(focus).leadsTo) return null;

  const meta = getHotspot(focus);
  const frames = hotspotsIn(room);
  const index = frames.findIndex((h) => h.id === focus);
  const prev = frames[(index - 1 + frames.length) % frames.length];
  const next = frames[(index + 1) % frames.length];

  const go = (id: HotspotId) => {
    if (soundOn) playAdvance();
    setFocus(id);
  };
  const title = <h2 id="dr-panel-title" ref={heading} tabIndex={-1} className="dr-panel__title">{meta.label}</h2>;

  return (
    <aside key={focus} className="dr-panel" aria-labelledby="dr-panel-title">
      <div className="dr-panel__head">
        {compact ? (
          <>
            {title}
            <button type="button" className="dr-icon-button" onClick={() => setFocus(null)} aria-label="Torna alla stanza">
              <X size={20} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <span className="dr-panel__frame">▸ {meta.frame}A</span>
            <button type="button" className="dr-panel__close" onClick={() => setFocus(null)}>
              Torna alla stanza <kbd>Esc</kbd>
            </button>
          </>
        )}
      </div>
      <div ref={body} className="dr-panel__body">
        {!compact && <><p className="dr-eyebrow">{meta.object}</p>{title}</>}
        <PanelBody id={focus} compact={compact} />
      </div>
      {!compact && <nav className="dr-panel__advance" aria-label="Fotogrammi">
        <button type="button" onClick={() => go(prev.id)}>
          ← {prev.label}
        </button>
        <button type="button" onClick={() => go(next.id)}>
          {next.label} →
        </button>
      </nav>}
    </aside>
  );
}
