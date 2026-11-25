"use client";

import { useEffect, useRef } from "react";
import { doorOf, hotspotsIn } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";

const COPY = {
  darkroom: {
    title: "Questa è la mia camera oscura.",
    lead: "Qui la luce è rossa e le immagini prendono forma piano. Tutto ciò che ha un puntino si può toccare.",
    start: "Comincia dalle stampe",
  },
  studio: {
    title: "E questo è lo studio.",
    lead: "Di qua la luce è calda: è dove scrivo codice e dove tengo le cose che amo. Alcuni oggetti sono collegati dal vivo.",
    start: "Comincia dalla libreria",
  },
} as const;

/** Il biglietto di benvenuto di ogni stanza: cosa c'è e dove cominciare. */
export default function Guide({ compact }: { compact: boolean }) {
  const open = useDarkroom((s) => s.guideOpen);
  const room = useDarkroom((s) => s.room);
  const setGuideOpen = useDarkroom((s) => s.setGuideOpen);
  const setFocus = useDarkroom((s) => s.setFocus);
  const primary = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) primary.current?.focus();
  }, [open]);

  if (!open) return null;

  const copy = COPY[room];
  const items = hotspotsIn(room);
  const door = doorOf(room);

  return (
    <div className="dr-guide" role="dialog" aria-modal="true" aria-labelledby="dr-guide-title">
      <div className="dr-guide__card">
        <p className="dr-eyebrow">Benvenuto</p>
        <h2 id="dr-guide-title" className="dr-guide__title">
          {copy.title}
        </h2>
        <p className="dr-guide__lead">{compact ? "Tocca gli oggetti per aprirli, oppure trascina la scena per guardarti intorno." : copy.lead}</p>
        {!compact && <ul className="dr-guide__list">
          {[...items, door].map((h) => (
            <li key={h.id}>
              <span className="dr-guide__object">{h.object}</span>
              <span className="dr-guide__hint">{h.hint}</span>
            </li>
          ))}
        </ul>}
        <p className="dr-guide__tip">{compact ? "Con Esplora puoi raggiungere tutti gli oggetti della stanza." : "Usa la pellicola in basso per spostarti, o premi Esc per tornare indietro."}</p>
        <div className="dr-guide__actions">
          <button ref={primary} type="button" className="dr-button dr-button--primary" onClick={() => setFocus(items[0].id)}>
            {copy.start}
          </button>
          <button type="button" className="dr-button dr-button--ghost" onClick={() => setGuideOpen(false)}>
            Esplora da solo
          </button>
        </div>
      </div>
    </div>
  );
}
