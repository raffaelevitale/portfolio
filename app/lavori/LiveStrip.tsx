"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useLive } from "@/lib/live/useLive";
import { relativeTime } from "@/lib/rome-time";

interface CardProps {
  label: string;
  image?: string | null;
  title: string;
  meta: string;
  href?: string | null;
}

function Card({ label, image, title, meta, href }: CardProps) {
  const body: ReactNode = (
    <>
      {image && <Image src={image} alt="" width={64} height={64} className="pv-live__img" />}
      <span className="pv-live__text">
        <span className="pv-live__label">{label}</span>
        <span className="pv-live__title">{title}</span>
        <span className="pv-live__meta">{meta}</span>
      </span>
    </>
  );
  return (
    <li className="pv-live__card">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {body}
        </a>
      ) : (
        <div>{body}</div>
      )}
    </li>
  );
}

/**
 * La stessa attività live dello studio 3D, in forma di schede.
 * Mostra solo i servizi collegati e con dati: niente schede vuote.
 */
export default function LiveStrip() {
  const spotify = useLive("spotify")?.data;
  const github = useLive("github")?.data;
  const steam = useLive("steam")?.data;
  const letterboxd = useLive("letterboxd")?.data;

  const track = spotify?.track;
  const repo = github?.repos[0];
  const game = steam?.games[0];
  const film = letterboxd?.films[0];

  if (!track && !repo && !game && !film) return null;

  return (
    <ul className="pv-live" aria-label="Attività recente">
      {track && (
        <Card
          label={track.isPlaying ? "● In ascolto ora" : "Ultimo ascolto"}
          image={track.coverUrl}
          title={track.title}
          meta={track.artist}
          href={track.url}
        />
      )}
      {repo && (
        <Card
          label="Ultimo commit"
          title={repo.name}
          meta={`${repo.lastCommit?.message ?? repo.language ?? ""} · ${relativeTime(repo.pushedAt)}`}
          href={repo.lastCommit?.url ?? repo.url}
        />
      )}
      {game && (
        <Card
          label={steam?.nowPlaying ? "● In gioco ora" : "Ultima partita"}
          image={game.imageUrl}
          title={steam?.nowPlaying ?? game.name}
          meta={`${game.hoursTotal} h in totale`}
          href={game.storeUrl}
        />
      )}
      {film && (
        <Card
          label="Ultimo film visto"
          image={film.posterUrl}
          title={film.title}
          meta={film.year ?? ""}
          href={film.url}
        />
      )}
    </ul>
  );
}
