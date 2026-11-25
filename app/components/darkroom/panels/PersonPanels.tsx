"use client";

import Image from "next/image";
import { useState } from "react";
import { ABOUT, EXPERIENCE, PERSON, SKILLS, SOCIALS } from "@/lib/content";

const COPY_FEEDBACK_MS = 2000;

export function AboutPanel() {
  return (
    <>
      <figure className="dr-polaroid">
        <Image src={PERSON.portrait} alt={`Ritratto di ${PERSON.name}`} width={512} height={512} sizes="200px" />
        <figcaption>Raffaele, 2026</figcaption>
      </figure>
      {ABOUT.paragraphs.map((p) => (
        <p key={p.slice(0, 24)} className="dr-panel__text">
          {p}
        </p>
      ))}
      <h3 className="dr-panel__subtitle">I rullini sulla mensola</h3>
      <div className="dr-skills">
        {SKILLS.map((group) => (
          <div key={group.label} className="dr-skills__group">
            <span className="dr-skills__label">{group.label}</span>
            <ul className="dr-tags">
              {group.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <dl className="dr-facts">
        <div>
          <dt>Formazione</dt>
          <dd>{ABOUT.education}</dd>
        </div>
        <div>
          <dt>Certificazioni</dt>
          <dd>{ABOUT.certifications.join(" · ")}</dd>
        </div>
        <div>
          <dt>Lingue</dt>
          <dd>{ABOUT.languages}</dd>
        </div>
        <div>
          <dt>Base</dt>
          <dd>{PERSON.location}</dd>
        </div>
        <div>
          <dt>Stato</dt>
          <dd>
            <span className="dr-live" aria-hidden="true" /> {PERSON.availability}
          </dd>
        </div>
      </dl>
    </>
  );
}

export function CvPanel() {
  return (
    <>
      <p className="dr-panel__lead">Dentro la busta c&apos;è il percorso completo. {PERSON.lookingFor}</p>
      <div className="dr-cv">
        <a className="dr-button dr-button--primary" href={PERSON.cvUrl} download>
          Scarica il CV (PDF)
        </a>
        <a className="dr-link" href={PERSON.cvUrl} target="_blank" rel="noopener noreferrer">
          Aprilo nel browser <span aria-hidden="true">↗</span>
        </a>
      </div>
      <h3 className="dr-panel__subtitle">Esperienze</h3>
      <ol className="dr-timeline">
        {EXPERIENCE.map((e) => (
          <li key={e.role} className="dr-timeline__item">
            <span className="dr-timeline__period">{e.period}</span>
            <h4 className="dr-timeline__role">{e.role}</h4>
            <p className="dr-timeline__org">{e.org}</p>
            <ul className="dr-timeline__points">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <dl className="dr-facts">
        <div>
          <dt>Formazione</dt>
          <dd>{ABOUT.education}</dd>
        </div>
        <div>
          <dt>Certificazioni</dt>
          <dd>{ABOUT.certifications.join(" · ")}</dd>
        </div>
      </dl>
    </>
  );
}

export function ContactPanel() {
  const [copied, setCopied] = useState<"idle" | "ok" | "error">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PERSON.email);
      setCopied("ok");
    } catch {
      setCopied("error");
    }
    setTimeout(() => setCopied("idle"), COPY_FEEDBACK_MS);
  };

  return (
    <>
      <p className="dr-panel__lead">
        Alza la cornetta. Hai un progetto o un ruolo in mente? Parliamone: rispondo sempre.
      </p>
      <p className="dr-contact__email">{PERSON.email}</p>
      <div className="dr-contact__actions">
        <a className="dr-button dr-button--primary" href={`mailto:${PERSON.email}`}>
          Scrivimi una mail
        </a>
        <button type="button" className="dr-button dr-button--ghost" onClick={copy}>
          {copied === "ok" ? "Copiata ✓" : copied === "error" ? "Copia non riuscita" : "Copia indirizzo"}
        </button>
      </div>
      <p className="dr-sr" aria-live="polite">
        {copied === "ok" ? "Indirizzo email copiato" : copied === "error" ? "Non sono riuscito a copiare l'indirizzo" : ""}
      </p>
      <ul className="dr-socials">
        {SOCIALS.map((s) => (
          <li key={s.label}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label} <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="dr-facts__inline">
        <span className="dr-live" aria-hidden="true" /> {PERSON.availability} · {PERSON.location}
      </p>
    </>
  );
}
