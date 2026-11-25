"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { SKILLS } from "@/lib/content";
import type { LiveDataMap, LiveEnvelope, LiveKind } from "@/lib/live/types";
import { useLive } from "@/lib/live/useLive";
import { relativeTime } from "@/lib/rome-time";
import { SHOW_DRAFTS } from "@/lib/studio-content";

/** Testi per quando un servizio non è collegato o non risponde: chi visita vede solo una frase tranquilla. */
const IDLE: Record<LiveKind, { quiet: string; setup: string }> = {
  spotify: { quiet: "Il giradischi è in pausa.", setup: "SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET e SPOTIFY_REFRESH_TOKEN" },
  github: { quiet: "Il monitor è in standby.", setup: "GITHUB_USERNAME (e GITHUB_TOKEN per il grafico)" },
  steam: { quiet: "Il televisore è spento.", setup: "STEAM_API_KEY e STEAM_ID" },
  letterboxd: { quiet: "Il proiettore è spento.", setup: "LETTERBOXD_USERNAME" },
};

interface LiveProps<K extends LiveKind> {
  kind: K;
  lead: string;
  children: (data: LiveDataMap[K]) => ReactNode;
}

function Live<K extends LiveKind>({ kind, lead, children }: LiveProps<K>) {
  const entry: LiveEnvelope<LiveDataMap[K]> | undefined = useLive(kind);
  return (
    <>
      <p className="dr-panel__lead">{lead}</p>
      {!entry && <p className="dr-live-status">Collegamento in corso…</p>}
      {entry && !entry.data && (
        <p className="dr-live-status">
          {IDLE[kind].quiet}
          {SHOW_DRAFTS && !entry.configured && (
            <span className="dr-draft">Sviluppo: imposta {IDLE[kind].setup} in .env.local</span>
          )}
          {SHOW_DRAFTS && entry.configured && entry.error && (
            <span className="dr-draft">Sviluppo: il servizio non risponde, guarda il terminale</span>
          )}
        </p>
      )}
      {entry?.data && children(entry.data)}
      {entry?.data && <p className="dr-live-stamp">Aggiornato {relativeTime(entry.fetchedAt)}</p>}
    </>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <span className="dr-stars" aria-label={`${rating} stelle su 5`}>
      {"★".repeat(full)}
      {rating - full >= 0.5 ? "½" : ""}
    </span>
  );
}

export function MusicPanel() {
  return (
    <Live kind="spotify" lead="Il disco gira quando sto ascoltando qualcosa su Spotify. Sotto, gli album che consumo di più.">
      {(data) => (
        <>
          {data.track && (
            <article className="dr-track">
              {data.track.coverUrl && (
                <Image src={data.track.coverUrl} alt={`Copertina di ${data.track.album}`} width={120} height={120} className="dr-track__cover" />
              )}
              <div>
                <span className={`dr-track__state${data.track.isPlaying ? " is-live" : ""}`}>
                  {data.track.isPlaying
                    ? "In ascolto ora"
                    : data.track.playedAt
                      ? `Ultimo ascolto · ${relativeTime(data.track.playedAt)}`
                      : "Ultimo ascolto"}
                </span>
                <h3 className="dr-track__title">{data.track.title}</h3>
                <p className="dr-track__artist">{data.track.artist}</p>
                {data.track.url && (
                  <a className="dr-link" href={data.track.url} target="_blank" rel="noopener noreferrer">
                    Apri su Spotify <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          )}
          {data.topAlbums.length > 0 && (
            <>
              <h3 className="dr-panel__subtitle">In rotazione questo mese</h3>
              <ul className="dr-albums">
                {data.topAlbums.map((a) => (
                  <li key={`${a.name}-${a.artist}`}>
                    <a href={a.url ?? undefined} target="_blank" rel="noopener noreferrer">
                      {a.coverUrl && <Image src={a.coverUrl} alt="" width={160} height={160} />}
                      <span className="dr-albums__name">{a.name}</span>
                      <span className="dr-albums__artist">{a.artist}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </Live>
  );
}

export function CinemaPanel() {
  return (
    <Live kind="letterboxd" lead="Le locandine cambiano da sole: sono gli ultimi film che ho segnato su Letterboxd.">
      {(data) => (
        <>
          <ul className="dr-films">
            {data.films.map((f) => (
              <li key={`${f.title}-${f.watchedDate}`} className="dr-film-card">
                {f.posterUrl && <Image src={f.posterUrl} alt={`Locandina di ${f.title}`} width={70} height={105} />}
                <div>
                  <h3 className="dr-film-card__title">
                    {f.url ? (
                      <a href={f.url} target="_blank" rel="noopener noreferrer">
                        {f.title}
                      </a>
                    ) : (
                      f.title
                    )}
                    {f.year && <span className="dr-film-card__year"> {f.year}</span>}
                  </h3>
                  <p className="dr-film-card__meta">
                    {f.rating !== null && <Stars rating={f.rating} />}
                    {f.liked && <span aria-label="Mi è piaciuto"> ♥</span>}
                    {f.watchedDate && <span> · visto il {new Date(f.watchedDate).toLocaleDateString("it-IT")}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <a className="dr-link" href={data.profileUrl} target="_blank" rel="noopener noreferrer">
            Il diario completo su Letterboxd <span aria-hidden="true">↗</span>
          </a>
        </>
      )}
    </Live>
  );
}

const HEAT = ["#1d1a18", "#0e4429", "#006d32", "#26a641", "#39d353"];

export function DeskPanel() {
  const stack = SKILLS.find((s) => s.label === "Sviluppo")?.items ?? [];
  return (
    <Live kind="github" lead="Qui scrivo codice. Il monitor mostra la mia attività su GitHub, aggiornata da sola.">
      {(data) => {
        const weeks = data.weeks?.slice(-26) ?? null;
        const max = weeks ? Math.max(1, ...weeks.flat()) : 1;
        return (
          <>
            {weeks && (
              <figure className="dr-heat">
                <div className="dr-heat__grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
                  {weeks.map((week, wi) =>
                    week.map((count, di) => (
                      <span
                        key={`${wi}-${di}`}
                        style={{ background: HEAT[count === 0 ? 0 : Math.min(4, Math.ceil((count / max) * 4))], gridColumn: wi + 1, gridRow: di + 1 }}
                      />
                    )),
                  )}
                </div>
                <figcaption>{data.totalContributions} contributi nell&apos;ultimo anno · ultimi sei mesi</figcaption>
              </figure>
            )}
            <h3 className="dr-panel__subtitle">Repository aggiornati di recente</h3>
            <ul className="dr-repos">
              {data.repos.map((r) => (
                <li key={r.name}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="dr-repos__name">
                    {r.name}
                  </a>
                  <span className="dr-repos__meta">
                    {r.language ?? "—"} · {relativeTime(r.pushedAt)}
                  </span>
                  {r.description && <p className="dr-repos__desc">{r.description}</p>}
                  {r.lastCommit && (
                    <a className="dr-repos__commit" href={r.lastCommit.url} target="_blank" rel="noopener noreferrer">
                      └ {r.lastCommit.message}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <ul className="dr-tags">
              {stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a className="dr-link" href={data.profileUrl} target="_blank" rel="noopener noreferrer">
              Il profilo GitHub <span aria-hidden="true">↗</span>
            </a>
          </>
        );
      }}
    </Live>
  );
}

export function GamingPanel() {
  return (
    <Live kind="steam" lead="Quando stacco dal codice. Il televisore mostra cosa sto giocando su Steam.">
      {(data) => (
        <>
          {data.nowPlaying && <p className="dr-now">● In gioco ora: {data.nowPlaying}</p>}
          <h3 className="dr-panel__subtitle">{data.allTime ? "I più giocati" : "Ultime due settimane"}</h3>
          <ul className="dr-games">
            {data.games.map((g) => (
              <li key={g.appId}>
                <a href={g.storeUrl} target="_blank" rel="noopener noreferrer">
                  <Image src={g.imageUrl} alt="" width={184} height={86} />
                  <span className="dr-games__name">{g.name}</span>
                  <span className="dr-games__hours">
                    {g.hoursRecent !== null ? `${g.hoursRecent} h nelle ultime 2 settimane · ` : ""}
                    {g.hoursTotal} h in totale
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {data.profileUrl && (
            <a className="dr-link" href={data.profileUrl} target="_blank" rel="noopener noreferrer">
              Il profilo Steam <span aria-hidden="true">↗</span>
            </a>
          )}
        </>
      )}
    </Live>
  );
}
