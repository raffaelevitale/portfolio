"use client";

import { useEffect, useRef } from "react";
import { HOTSPOTS } from "@/lib/darkroom/hotspots";
import { useDarkroom } from "@/lib/darkroom/store";

/** Il biglietto di benvenuto: cosa c'è nello studio e dove cominciare. */
export default function Guide({ compact }: { compact: boolean }) {
  const open = useDarkroom((s) => s.guideOpen);
  const setGuideOpen = useDarkroom((s) => s.setGuideOpen);
  const setFocus = useDarkroom((s) => s.setFocus);
  const primary = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) primary.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="dr-guide" role="dialog" aria-modal="true" aria-labelledby="dr-guide-title">
      <div className="dr-guide__card">
        <p className="dr-eyebrow">Benvenuto</p>
        <h2 id="dr-guide-title" className="dr-guide__title">
          Questo è il mio studio.
        </h2>
        <p className="dr-guide__lead">
          {compact
            ? "Tocca gli oggetti per aprirli, oppure trascina la scena per guardarti intorno."
            : "Qui scrivo codice, tengo le cose che amo e sviluppo le mie fotografie. Tutto ciò che ha un puntino si può toccare; alcuni oggetti sono collegati dal vivo."}
        </p>
        {!compact && (
          <ul className="dr-guide__list">
            {HOTSPOTS.map((h) => (
              <li key={h.id}>
                <span className="dr-guide__object">{h.object}</span>
                <span className="dr-guide__hint">{h.hint}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="dr-guide__tip">
          {compact
            ? "Con Esplora raggiungi ogni oggetto. Prova anche la luce rossa."
            : "Usa la pellicola in basso per spostarti, Esc per tornare indietro. E prova ad accendere la luce rossa."}
        </p>
        <div className="dr-guide__actions">
          <button ref={primary} type="button" className="dr-button dr-button--primary" onClick={() => setFocus(HOTSPOTS[0].id)}>
            Comincia dalle stampe
          </button>
          <button type="button" className="dr-button dr-button--ghost" onClick={() => setGuideOpen(false)}>
            Esplora da solo
          </button>
        </div>
      </div>
    </div>
  );
}
