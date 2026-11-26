"use client";

import Image from "next/image";
import { type CSSProperties, useMemo } from "react";
import { type ShelvedBook, shelve, spineAuthor, spineMetrics } from "@/lib/bookshelf";
import type { Book } from "@/lib/studio-content";
import "./bookshelf.css";

/** Le copertine in piedi sono un po' più basse delle coste: occupano più spazio in larghezza. */
const COVER_HEIGHT_RATIO = 0.86;

interface BookshelfProps {
  books: readonly Book[];
  /** Indice (nella lista `books`) del libro scelto, o null. */
  selected: number | null;
  onSelect: (index: number | null) => void;
  /** "dark" nel pannello dello studio, "paper" su /lavori. */
  tone: "dark" | "paper";
  /** Fattore di scala di coste e ripiani. */
  scale?: number;
  label: string;
}

interface BookButtonProps {
  item: ShelvedBook;
  last: boolean;
  selected: boolean;
  onSelect: (index: number | null) => void;
}

/** Un libro di costa: colore, altezza, spessore e carattere propri, come uno scaffale vero. */
function Spine({ item, last, selected, onSelect }: BookButtonProps) {
  const { book, index } = item;
  const m = spineMetrics(book, last);
  const style = {
    "--bg": book.color,
    "--ink": book.ink,
    "--h": `${m.height}px`,
    "--w": `${m.thickness}px`,
  } as CSSProperties;
  return (
    <button
      type="button"
      className={`bs-spine bs-spine--${m.face}${m.lean ? " is-leaning" : ""}${selected ? " is-selected" : ""}`}
      style={style}
      aria-pressed={selected}
      aria-label={`${book.title}, ${book.author}`}
      title={`${book.title} — ${book.author}`}
      onClick={() => onSelect(selected ? null : index)}
    >
      <span className="bs-spine__title">{book.title}</span>
      <span className="bs-spine__author">{spineAuthor(book.author)}</span>
    </button>
  );
}

/** Un libro esposto di copertina, con la copertina vera. */
function Cover({ item, selected, onSelect }: BookButtonProps) {
  const { book, index } = item;
  const m = spineMetrics(book, false);
  return (
    <button
      type="button"
      className={`bs-cover${selected ? " is-selected" : ""}`}
      style={{ "--h": `${Math.round(m.height * COVER_HEIGHT_RATIO)}px` } as CSSProperties}
      aria-pressed={selected}
      aria-label={`${book.title}, ${book.author}`}
      title={`${book.title} — ${book.author}`}
      onClick={() => onSelect(selected ? null : index)}
    >
      {/* La cover c'è sempre: le copertine senza file sono disegnate come coste. */}
      <Image src={book.cover as string} alt="" width={140} height={210} sizes="140px" />
    </button>
  );
}

export default function Bookshelf({ books, selected, onSelect, tone, scale = 1, label }: BookshelfProps) {
  const shelves = useMemo(() => shelve(books), [books]);
  return (
    <div className={`bs bs--${tone}`} style={{ "--bs-scale": scale } as CSSProperties} role="group" aria-label={label}>
      {shelves.map(({ group, books: items }) => (
        <section key={group.id} className="bs-bay" aria-label={group.label}>
          <div className="bs-row">
            {items.map((item, i) => {
              const props = { item, last: i === items.length - 1 && items.length > 2, selected: selected === item.index, onSelect };
              return item.book.faceOut && item.book.cover ? (
                <Cover key={item.book.title} {...props} />
              ) : (
                <Spine key={item.book.title} {...props} />
              );
            })}
            <span className="bs-bookend" aria-hidden="true" />
          </div>
          <div className="bs-board">
            <span className="bs-label">{group.label}</span>
          </div>
        </section>
      ))}
    </div>
  );
}
