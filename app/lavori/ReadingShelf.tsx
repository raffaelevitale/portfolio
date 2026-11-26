"use client";

import { useState } from "react";
import Bookshelf from "@/app/components/bookshelf/Bookshelf";
import { StudioImage } from "@/app/components/StudioImage";
import { shelfLabelOf, shelve } from "@/lib/bookshelf";
import type { Book } from "@/lib/studio-content";

type View = "shelf" | "list";

/** Link alla scheda del libro, solo se punta a Open Library. */
function bookUrl(book: Book): string | null {
  return book.coverSource?.startsWith("https://openlibrary.org/") ? book.coverSource : null;
}

function Detail({ book, onClose }: { book: Book; onClose: () => void }) {
  const url = bookUrl(book);
  return (
    <article className="bs-detail" aria-live="polite">
      <StudioImage
        src={book.cover} alt={`Copertina di ${book.title}`} width={92} height={138} className="bs-detail__cover"
        fallback={<span className="bs-detail__spine" style={{ background: book.color }} aria-hidden="true" />}
      />
      <div>
        <p className="bs-detail__author">{book.author}</p>
        <h4 className="bs-detail__title">{book.title}</h4>
        <p className="bs-detail__meta">
          {book.tag} · {shelfLabelOf(book)}
        </p>
        {book.comment && <p className="bs-detail__comment">{book.comment}</p>}
        {url && (
          <a className="bs-detail__link" href={url} target="_blank" rel="noopener noreferrer">
            Scheda del libro <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
      <button type="button" className="bs-detail__close" onClick={onClose} aria-label="Chiudi la scheda">
        ×
      </button>
    </article>
  );
}

function List({ books }: { books: readonly Book[] }) {
  return (
    <div className="bs-list">
      {shelve(books).map(({ group, books: items }) => (
        <section key={group.id} className="bs-list__group" aria-label={group.label}>
          <h4 className="bs-list__label">{group.label}</h4>
          <ul>
            {items.map(({ book }) => (
              <li key={book.title}>
                <StudioImage
                  src={book.cover} alt={`Copertina di ${book.title}`} width={56} height={84} className="bs-list__cover"
                  fallback={<span className="bs-list__spine" style={{ background: book.color }} aria-hidden="true" />}
                />
                <div>
                  <p className="bs-list__author">{book.author}</p>
                  <p className="bs-list__title">{book.title}</p>
                  <p className="bs-list__meta">{book.comment ?? book.tag}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** La libreria di /lavori: scaffale con le coste o elenco con le copertine, a scelta. */
export default function ReadingShelf({ books }: { books: readonly Book[] }) {
  const [view, setView] = useState<View>("shelf");
  const [selected, setSelected] = useState<number | null>(null);
  const book = selected !== null ? books[selected] : null;

  return (
    <div className="pv-reading">
      <div className="bs-views" role="group" aria-label="Vista della libreria">
        <button type="button" aria-pressed={view === "shelf"} onClick={() => setView("shelf")}>
          Scaffale
        </button>
        <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>
          Elenco
        </button>
      </div>
      {view === "shelf" ? (
        <>
          <Bookshelf books={books} selected={selected} onSelect={setSelected} tone="paper" label="Libreria" />
          {book && <Detail book={book} onClose={() => setSelected(null)} />}
        </>
      ) : (
        <List books={books} />
      )}
    </div>
  );
}
