"use client";

import Image from "next/image";
import { SOCIALS } from "@/lib/content";
import { useDarkroom } from "@/lib/darkroom/store";
import { useLive } from "@/lib/live/useLive";
import { NOW, nowLines } from "@/lib/now";
import { type Photo, PHOTOS } from "@/lib/photos";

const INSTAGRAM = SOCIALS.find((s) => s.label === "Instagram");

function photoMeta(photo: Photo): string {
  return [photo.place, photo.date, photo.camera].filter(Boolean).join(" · ");
}

function InstagramLink({ label }: { label: string }) {
  if (!INSTAGRAM) return null;
  return (
    <a className="dr-link" href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer">
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

/** Le mie fotografie: una grande, le altre come provini da scegliere. */
export function PhotoPanel() {
  const selected = useDarkroom((s) => s.selectedPhoto);
  const selectPhoto = useDarkroom((s) => s.selectPhoto);

  if (PHOTOS.length === 0) {
    return (
      <>
        <p className="dr-panel__lead">Le stampe sono ancora nella bacinella: sto scegliendo quali appendere.</p>
        <p className="dr-panel__text">Intanto, eventi, ritratti e shooting sono sul mio profilo.</p>
        <InstagramLink label="Le foto su Instagram" />
      </>
    );
  }

  const index = selected !== null && selected < PHOTOS.length ? selected : 0;
  const photo = PHOTOS[index];
  const portrait = photo.orientation === "portrait";
  const meta = photoMeta(photo);

  return (
    <>
      <p className="dr-panel__lead">Scattate da me. Scegli un provino per vederlo grande.</p>
      <figure className={`dr-photo${portrait ? " dr-photo--portrait" : ""}`}>
        <Image src={photo.src} alt={photo.title} width={portrait ? 640 : 960} height={portrait ? 960 : 640} sizes="(max-width: 760px) 92vw, 420px" className="dr-photo__image" />
        <figcaption>
          <span className="dr-photo__title">{photo.title}</span>
          {meta && <span className="dr-photo__meta">{meta}</span>}
          {photo.caption && <p className="dr-photo__caption">{photo.caption}</p>}
        </figcaption>
      </figure>
      {PHOTOS.length > 1 && (
        <ul className="dr-photo-strip" aria-label="Provini">
          {PHOTOS.map((p, i) => (
            <li key={p.src}>
              <button type="button" aria-pressed={i === index} aria-label={p.title} onClick={() => selectPhoto(i)}>
                <Image src={p.src} alt="" width={120} height={80} sizes="120px" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <InstagramLink label="Altre su Instagram" />
    </>
  );
}

/** La lavagnetta: cosa sto facendo adesso, scritto a mano, più l'ascolto in diretta. */
export function NowPanel() {
  const spotify = useLive("spotify");
  const lines = nowLines(spotify?.data);
  return (
    <>
      <p className="dr-panel__lead">La lavagnetta accanto alla scrivania. La aggiorno a mano quando cambia qualcosa.</p>
      <dl className="dr-now-list">
        {lines.map((line) => (
          <div key={line.label}>
            <dt>{line.label}</dt>
            <dd>{line.text}</dd>
          </div>
        ))}
      </dl>
      <p className="dr-now-list__stamp">Aggiornata a {NOW.updated.toLowerCase()} · l&apos;ascolto arriva da Spotify in diretta</p>
    </>
  );
}
