import type { Metadata } from "next";
import Link from "next/link";
import { ALBUMS, BOOKS, visible } from "@/lib/studio-content";
import "../lavori/lavori.css";

export const metadata: Metadata = { title: "Crediti", description: "Fonti e attribuzioni delle immagini e dei modelli dello studio.", alternates: { canonical: "/crediti" } };

interface Credit {
  title: string;
  type: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
  source?: string;
  changes?: string;
}

export default function Credits() {
  const entries: Credit[] = [
    ...visible(BOOKS).filter((book) => book.cover).map((book) => ({
      title: book.title, type: "Copertina", credit: book.coverCredit, license: "Diritti dei rispettivi titolari · licenza non dichiarata", source: book.coverSource,
    })),
    ...ALBUMS.filter((album) => album.cover).map((album) => ({
      title: album.title, type: "Copertina album", credit: `${album.artist} (artista) · Spotify (fonte)`, license: "Diritti dei rispettivi titolari · licenza non dichiarata", source: album.spotifyUrl,
    })),
  ];
  return (
    <div className="pv">
      <header className="pv-top"><Link href="/lavori" className="pv-top__back">← Torna ai provini</Link><span className="pv-top__roll">Crediti</span></header>
      <main>
        <section className="pv-hero"><h1 className="pv-hero__title">Crediti.</h1><p className="pv-hero__lead">Immagini e modelli di terzi utilizzati nello studio, con le rispettive attribuzioni.</p></section>
        <section className="pv-section" aria-label="Attribuzioni">
          {entries.length ? <ul className="pv-credit-list">{entries.map((entry) => (
            <li key={`${entry.type}-${entry.title}`}>
              <h3>{entry.title} — {entry.type}</h3>
              <p>
                {entry.credit ?? "Autore da verificare"} · {entry.licenseUrl ? <a href={entry.licenseUrl} target="_blank" rel="noreferrer">{entry.license}</a> : entry.license ?? "Licenza da verificare"}
                {entry.changes && ` · ${entry.changes}`}
              </p>
              {entry.source && <a className="pv-link" href={entry.source} target="_blank" rel="noreferrer">Fonte originale ↗</a>}
            </li>
          ))}</ul> : <p>Non sono ancora presenti asset statici di terzi nello studio.</p>}
          <p>Le copertine live degli album sono fornite da <a href="https://open.spotify.com/" target="_blank" rel="noreferrer">Spotify</a> e appartengono ai rispettivi titolari dei diritti.</p>
        </section>
      </main>
    </div>
  );
}
