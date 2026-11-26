"use client";

import { useEffect, useState } from "react";
import { useDarkroom } from "@/lib/darkroom/store";
import { type ClockTime, formatClock, romeTime } from "@/lib/rome-time";
import { BOOKS, CARS, type ShowcaseItem, visible, WATCHES } from "@/lib/studio-content";
import Bookshelf from "@/app/components/bookshelf/Bookshelf";
import { StudioImage } from "@/app/components/StudioImage";
import { PhotoCredit } from "@/app/components/StudioCredit";

const CLOCK_TICK_MS = 10_000;

function DraftBadge() {
  return <span className="dr-draft">Bozza · visibile solo in sviluppo</span>;
}

/** Lo scaffale in miniatura: si sceglie una costa e lo stesso libro esce dallo scaffale 3D. */
export function LibraryPanel({ compact }: { compact: boolean }) {
  const books = visible(BOOKS);
  const selected = useDarkroom((s) => s.selectedBook);
  const selectBook = useDarkroom((s) => s.selectBook);
  const book = selected !== null ? books[selected] : null;

  if (books.length === 0) {
    return <p className="dr-panel__lead">Gli scaffali si stanno ancora riempiendo. Torna presto.</p>;
  }

  return (
    <>
      {!compact && <p className="dr-panel__lead">Libri e idee che mi interessano: business, design, codice, psicologia, auto e orologi. Scegline uno: esce dallo scaffale.</p>}
      {!compact && (
        <Bookshelf books={books} selected={selected} onSelect={selectBook} tone="dark" scale={0.62} label="Libri sullo scaffale" />
      )}
      {book ? (
        <>
          {compact && selected !== null && (
            <nav className="dr-book-actions" aria-label="Cambia libro">
              <button type="button" onClick={() => selectBook(null)}>Scaffale</button>
              <button type="button" aria-label="Libro precedente" disabled={selected === 0} onClick={() => selectBook(selected - 1)}>←</button>
              <button type="button" aria-label="Libro successivo" disabled={selected === books.length - 1} onClick={() => selectBook(selected + 1)}>→</button>
            </nav>
          )}
          <article className={`dr-book${book.cover ? " dr-book--illustrated" : ""}`} style={{ borderColor: book.color }}>
            {book.cover && <StudioImage src={book.cover} alt={`Copertina di ${book.title}`} width={compact ? 84 : 160} height={compact ? 123 : 235} className="dr-book__cover" fallback={null} />}
            <div>
              <span className="dr-book__tag">{book.tag}</span>
              <h3 className="dr-book__title">{book.title}</h3>
              <p className="dr-book__author">{book.author}</p>
              {book.comment && <p className="dr-book__comment">{book.comment}</p>}
              {book.draft && <DraftBadge />}
            </div>
          </article>
        </>
      ) : (
        // Su desktop lo scaffale è già sopra; su mobile è lui il modo di scegliere un libro.
        compact ? (
          <Bookshelf books={books} selected={selected} onSelect={selectBook} tone="dark" scale={0.66} label="Libri sullo scaffale" />
        ) : (
          <p className="dr-panel__text dr-shelf-hint">Tocca una costa o una copertina per tirare fuori il libro.</p>
        )
      )}
    </>
  );
}

function useRomeClock(): ClockTime | null {
  const [time, setTime] = useState<ClockTime | null>(null);
  useEffect(() => {
    setTime(romeTime());
    const t = setInterval(() => setTime(romeTime()), CLOCK_TICK_MS);
    return () => clearInterval(t);
  }, []);
  return time;
}

function ShowcaseList({ title, items }: { title: string; items: readonly ShowcaseItem[] }) {
  if (items.length === 0) return null;
  return (
    <>
      <h3 className="dr-panel__subtitle">{title}</h3>
      <ul className="dr-showcase">
        {items.map((item) => (
          <li key={item.name} className="dr-showcase__item">
            <StudioImage
              src={item.photo} alt={item.name} width={100} height={80} className="dr-showcase__photo"
              fallback={<span className="dr-showcase__swatch" style={{ background: item.color }} aria-hidden="true" />}
              caption={<PhotoCredit item={item} />}
            />
            <div>
              <p className="dr-showcase__name">{item.name}</p>
              <p className="dr-showcase__detail">{item.detail}</p>
              {item.comment && <p className="dr-showcase__comment">{item.comment}</p>}
              {item.draft && <DraftBadge />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ShowcasePanel() {
  const time = useRomeClock();
  const watches = visible(WATCHES);
  const cars = visible(CARS);
  return (
    <>
      <p className="dr-panel__lead">Due passioni da vicino: la meccanica che sta al polso e quella che sta sotto un cofano. Pezzi che ammiro.</p>
      <p className="dr-clock">
        <span className="dr-clock__label">Le lancette segnano l&apos;ora di Savigliano</span>
        <span className="dr-clock__time">{time ? formatClock(time) : "--:--"}</span>
      </p>
      <ShowcaseList title="Orologi" items={watches} />
      <ShowcaseList title="Auto" items={cars} />
      {watches.length + cars.length === 0 && <p className="dr-panel__text">La vetrina si sta ancora riempiendo.</p>}
    </>
  );
}
