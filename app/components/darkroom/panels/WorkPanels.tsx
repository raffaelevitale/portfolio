"use client";

import type { CSSProperties } from "react";
import { NEXT_FRAME, PROCESS, PROJECTS, SERVICES } from "@/lib/content";
import { useDarkroom } from "@/lib/darkroom/store";

export function WorkPanel() {
  const setFocus = useDarkroom((s) => s.setFocus);
  return (
    <>
      <p className="dr-panel__lead">Stampe appese ad asciugare. Ognuna è un progetto: alcune finite, una ancora latente.</p>
      <ol className="dr-prints">
        {PROJECTS.map((p) => (
          <li key={p.slug} className="dr-print">
            <div className="dr-print__meta">
              <span>{p.frame}</span>
              <span>{p.period}</span>
            </div>
            <h3 className="dr-print__name">{p.name}</h3>
            <p className="dr-print__role">{p.role}</p>
            {p.metric && <p className="dr-print__metric">{p.metric}</p>}
            <p className="dr-print__summary">{p.summary}</p>
            <ul className="dr-print__points">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <ul className="dr-tags" aria-label="Competenze">
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a className="dr-link" href={p.url} target="_blank" rel="noopener noreferrer">
              Visita {p.urlLabel} <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
        <li className="dr-print dr-print--latent">
          <div className="dr-print__meta">
            <span>{NEXT_FRAME}</span>
            <span>In sviluppo</span>
          </div>
          <h3 className="dr-print__name">Il prossimo è il tuo?</h3>
          <p className="dr-print__summary">
            L&apos;ultima stampa è ancora bianca. Se hai un progetto, o un ruolo da sviluppatore o sales engineer, è il momento giusto per svilupparla insieme.
          </p>
          <button type="button" className="dr-link" onClick={() => setFocus("contatti")}>
            Alza la cornetta <span aria-hidden="true">→</span>
          </button>
        </li>
      </ol>
    </>
  );
}

export function ProcessPanel() {
  return (
    <>
      <p className="dr-panel__lead">Quattro bagni, sempre in quest&apos;ordine. Nessuno si salta.</p>
      <ol className="dr-baths">
        {PROCESS.map((s) => (
          <li key={s.step} className="dr-bath" style={{ "--tint": s.tint } as CSSProperties}>
            <span className="dr-bath__step">
              {s.step} · {s.bath}
            </span>
            <h3 className="dr-bath__title">{s.title}</h3>
            <p>{s.desc}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

export function ServicesPanel() {
  return (
    <>
      <p className="dr-panel__lead">Due strisce di negativo sul tavolo luminoso. Quattro fotogrammi, quattro cose che so fare.</p>
      <ol className="dr-negatives">
        {SERVICES.map((s) => (
          <li key={s.num} className="dr-negative">
            <span className="dr-negative__num">{s.num}</span>
            <div>
              <h3 className="dr-negative__title">{s.title}</h3>
              <p>{s.desc}</p>
              <ul className="dr-tags" aria-label="Strumenti">
                {s.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
