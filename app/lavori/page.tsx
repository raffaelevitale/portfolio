import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ABOUT,
  EXPERIENCE,
  NEXT_FRAME,
  PERSON,
  PROCESS,
  PROJECTS,
  SERVICES,
  SKILLS,
  SOCIALS,
} from "@/lib/content";
import { NOW } from "@/lib/now";
import { PHOTOS } from "@/lib/photos";
import { BOOKS, visible } from "@/lib/studio-content";
import LiveStrip from "./LiveStrip";
import ReadingShelf from "./ReadingShelf";
import "./lavori.css";
import "./lavori-studio.css";

export const metadata: Metadata = {
  title: "Provini",
  description:
    "La versione stampata dello studio di Raffaele Vitale, sviluppatore web: progetti, servizi, percorso e contatti, senza 3D.",
  alternates: { canonical: "/lavori" },
};

interface SectionHeadProps {
  num: string;
  title: string;
  id: string;
}

function SectionHead({ num, title, id }: SectionHeadProps) {
  return (
    <header className="pv-section__head">
      <span className="pv-section__num">{num}</span>
      <h2 id={id} className="pv-section__title">
        {title}
      </h2>
    </header>
  );
}

export default function Provini() {
  const books = visible(BOOKS);

  return (
    <div className="pv">
      <header className="pv-top">
        <Link href="/" className="pv-top__back">
          ← Torna nello studio
        </Link>
        <span className="pv-top__roll">Provini · Roll 2026</span>
      </header>

      <main>
        <section className="pv-hero" aria-labelledby="pv-title">
          <p className="pv-eyebrow">
            {PERSON.name} — {PERSON.headline}
          </p>
          <h1 id="pv-title" className="pv-hero__title">
            Provini <em>scelti.</em>
          </h1>
          <p className="pv-hero__lead">{PERSON.tagline}</p>
          <p className="pv-hero__roles">
            {PERSON.focus} · {PERSON.location}
          </p>
        </section>

        <section className="pv-section" aria-labelledby="pv-lavori">
          <SectionHead num="01" title="Lavori" id="pv-lavori" />
          <ol className="pv-works">
            {PROJECTS.map((p) => (
              <li key={p.slug} className="pv-work">
                <span className="pv-work__frame">{p.frame}</span>
                <div className="pv-work__body">
                  <h3 className="pv-work__name">{p.name}</h3>
                  <p className="pv-work__role">{p.role}</p>
                  {p.metric && <p className="pv-work__metric">{p.metric}</p>}
                  <p className="pv-work__summary">{p.summary}</p>
                  {p.problem && (
                    <>
                      <h4 className="pv-case__label">Il problema</h4>
                      <p className="pv-case__text">{p.problem}</p>
                    </>
                  )}
                  {(p.problem || p.outcome) && <h4 className="pv-case__label">Cosa ho fatto</h4>}
                  <ul className="pv-work__points">
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  {p.outcome && (
                    <>
                      <h4 className="pv-case__label">Il risultato</h4>
                      <p className="pv-case__text">{p.outcome}</p>
                    </>
                  )}
                  <ul className="pv-tags" aria-label="Competenze">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="pv-work__side">
                  <span className="pv-work__year">{p.period}</span>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="pv-link">
                    {p.urlLabel} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            ))}
            <li className="pv-work pv-work--latent">
              <span className="pv-work__frame">{NEXT_FRAME}</span>
              <div className="pv-work__body">
                <h3 className="pv-work__name">Il prossimo è il tuo?</h3>
                <p className="pv-work__summary">L&apos;ultima stampa è ancora bianca. {PERSON.lookingFor}</p>
              </div>
              <div className="pv-work__side">
                <a href={`mailto:${PERSON.email}`} className="pv-link">
                  Scrivimi <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          </ol>
        </section>

        <section className="pv-section pv-section--dark" aria-labelledby="pv-servizi">
          <SectionHead num="02" title="Servizi" id="pv-servizi" />
          <ol className="pv-strip">
            {SERVICES.map((s) => (
              <li key={s.num} className="pv-strip__frame">
                <span className="pv-strip__num">{s.num}</span>
                <h3 className="pv-strip__title">{s.title}</h3>
                <p>{s.desc}</p>
                <ul className="pv-tags pv-tags--dark" aria-label="Strumenti">
                  {s.tools.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="pv-section" aria-labelledby="pv-processo">
          <SectionHead num="03" title="Processo" id="pv-processo" />
          <ol className="pv-baths">
            {PROCESS.map((s) => (
              <li key={s.step} className="pv-bath" style={{ "--tint": s.tint } as CSSProperties}>
                <span className="pv-bath__swatch" aria-hidden="true" />
                <span className="pv-bath__step">
                  {s.step} · {s.bath}
                </span>
                <h3 className="pv-bath__title">{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="pv-section" aria-labelledby="pv-percorso">
          <SectionHead num="04" title="Percorso" id="pv-percorso" />
          <ol className="pv-timeline">
            {EXPERIENCE.map((e) => (
              <li key={e.role} className="pv-timeline__item">
                <span className="pv-timeline__period">{e.period}</span>
                <div>
                  <h3 className="pv-timeline__role">{e.role}</h3>
                  <p className="pv-timeline__org">{e.org}</p>
                  <ul className="pv-work__points">
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="pv-section" aria-labelledby="pv-chi">
          <SectionHead num="05" title="Chi sono" id="pv-chi" />
          <div className="pv-about">
            <figure className="pv-polaroid">
              <Image src={PERSON.portrait} alt={`Ritratto di ${PERSON.name}`} width={512} height={512} sizes="240px" />
              <figcaption>Raffaele, 2026</figcaption>
            </figure>
            <div>
              {ABOUT.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="pv-about__text">
                  {p}
                </p>
              ))}
              <div className="pv-skills">
                {SKILLS.map((group) => (
                  <div key={group.label}>
                    <span className="pv-skills__label">{group.label}</span>
                    <ul className="pv-tags">
                      {group.items.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <dl className="pv-facts">
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
              </dl>
            </div>
          </div>
        </section>

        <section className="pv-section" aria-labelledby="pv-fuori">
          <SectionHead num="06" title="Fuori orario" id="pv-fuori" />
          <p className="pv-fuori__lead">
            Lo studio, in versione stampata: cosa sto facendo adesso, i libri che mi interessano e le mie fotografie.
          </p>
          <LiveStrip />
          <h3 className="pv-fuori__title">Adesso</h3>
          <dl className="pv-now">
            {NOW.items.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
          <p className="pv-now__stamp">Aggiornato a {NOW.updated.toLowerCase()}</p>
          <h3 className="pv-fuori__title">Libreria</h3>
          <ReadingShelf books={books} />
          {PHOTOS.length > 0 && (
            <>
              <h3 className="pv-fuori__title">Fotografie</h3>
              <ul className="pv-photos">
                {PHOTOS.map((photo) => (
                  <li key={photo.src}>
                    <figure>
                      <Image
                        src={photo.src} alt={photo.title} sizes="(max-width: 760px) 50vw, 300px"
                        width={photo.orientation === "portrait" ? 400 : 600} height={photo.orientation === "portrait" ? 600 : 400}
                      />
                      <figcaption>
                        {photo.title}
                        {photo.place && <span> · {photo.place}</span>}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="pv-section pv-contact" aria-labelledby="pv-contatti">
          <SectionHead num="07" title="Contatti" id="pv-contatti" />
          <p className="pv-contact__lead">{PERSON.lookingFor}</p>
          <a href={`mailto:${PERSON.email}`} className="pv-contact__email">
            {PERSON.email}
          </a>
          <div className="pv-contact__row">
            <a href={PERSON.cvUrl} download className="pv-button">
              Scarica il CV
            </a>
            <ul className="pv-socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="pv-footer">
        <span>© 2026 {PERSON.name}</span>
        <Link href="/crediti">Crediti immagini e modelli</Link>
        <span>
          {PERSON.availability} · {PERSON.location}
        </span>
      </footer>
    </div>
  );
}
