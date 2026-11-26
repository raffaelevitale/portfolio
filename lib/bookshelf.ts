import type { Book, BookTag } from "./studio-content";

/**
 * Lo scaffale dei libri in HTML/CSS (pannello della libreria e /lavori).
 * Le categorie dei libri sono tante e con pochi titoli ciascuna: le raccogliamo in quattro ripiani,
 * così ogni ripiano ha abbastanza libri da sembrare uno scaffale vero.
 */

export interface ShelfGroup {
  id: string;
  label: string;
  tags: readonly BookTag[];
}

export const SHELF_GROUPS: readonly ShelfGroup[] = [
  { id: "business", label: "Business & vendite", tags: ["Business", "Vendita", "Finanza"] },
  { id: "mente", label: "Mente & abitudini", tags: ["Crescita personale", "Psicologia"] },
  { id: "design", label: "Design, codice & AI", tags: ["Design", "Sviluppo", "AI"] },
  { id: "passioni", label: "Passioni", tags: ["Fotografia", "Auto", "Orologi"] },
];

/** Ripiano di riserva per categorie aggiunte in futuro e non ancora assegnate a un gruppo. */
const OTHER: ShelfGroup = { id: "altro", label: "Altro", tags: [] };

export interface ShelvedBook {
  book: Book;
  /** Posizione del libro nella lista visibile: è lo stesso indice usato dallo scaffale 3D. */
  index: number;
}

export interface FilledShelf {
  group: ShelfGroup;
  books: readonly ShelvedBook[];
}

export function shelve(books: readonly Book[]): readonly FilledShelf[] {
  const groupOf = (tag: BookTag) => SHELF_GROUPS.find((g) => g.tags.includes(tag)) ?? OTHER;
  return [...SHELF_GROUPS, OTHER]
    .map((group) => ({
      group,
      books: books.map((book, index) => ({ book, index })).filter((item) => groupOf(item.book.tag).id === group.id),
    }))
    .filter((shelf) => shelf.books.length > 0);
}

export function shelfLabelOf(book: Book): string {
  return (SHELF_GROUPS.find((g) => g.tags.includes(book.tag)) ?? OTHER).label;
}

export type SpineFace = "serif" | "sans" | "mono";

export interface SpineMetrics {
  /** Altezza e spessore in px alla scala 1. */
  height: number;
  thickness: number;
  face: SpineFace;
  /** L'ultimo libro di un ripiano si appoggia agli altri, inclinato. */
  lean: boolean;
}

const MIN_HEIGHT = 150;
const HEIGHT_RANGE = 52;
const MIN_THICKNESS = 18;
const THICKNESS_RANGE = 13;

/** Hash FNV-1a: misure diverse per ogni titolo, ma sempre le stesse a ogni visita. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const FACE_BY_TAG: Partial<Record<BookTag, SpineFace>> = {
  Design: "serif",
  Fotografia: "serif",
  Orologi: "serif",
  Sviluppo: "mono",
  AI: "mono",
  Business: "sans",
  Vendita: "sans",
  Finanza: "sans",
};

export function spineMetrics(book: Book, isLastOnShelf: boolean): SpineMetrics {
  const h = hash(book.title);
  const faces: readonly SpineFace[] = ["serif", "sans", "mono"];
  return {
    height: MIN_HEIGHT + (h % HEIGHT_RANGE),
    thickness: MIN_THICKNESS + ((h >>> 8) % THICKNESS_RANGE),
    face: FACE_BY_TAG[book.tag] ?? faces[(h >>> 16) % faces.length],
    lean: isLastOnShelf,
  };
}

/** Il cognome sulla costa, come sui libri veri ("Hunt & Thomas" resta intero). */
export function spineAuthor(author: string): string {
  return author.includes("&") ? author : author.split(" ").slice(-1)[0];
}
