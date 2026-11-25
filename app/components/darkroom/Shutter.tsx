"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PERSON } from "@/lib/content";
import { useDarkroom } from "@/lib/darkroom/store";

const BLADES = 8;
const F_STOPS = ["1.4", "2", "2.8", "4", "5.6", "8", "11", "16"];
const UNMOUNT_AFTER_MS = 1600;
const COMPACT_UNMOUNT_MS = 850;

interface ShutterProps {
  /** null finché non sappiamo se il browser supporta WebGL. */
  webgl: boolean | null;
  compact: boolean;
  onEnter: () => void;
}

/** Diaframma a lamelle: le lamelle scivolano verso l'esterno e aprono il foro centrale. */
function Iris() {
  // Spicchio di ~55°: con 8 lamelle a 45° si sovrappongono e chiudono del tutto il foro.
  const blade = "M100 100 L100 -40 L215 20 Z";
  return (
    <svg className="dr-iris" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <clipPath id="dr-iris-clip">
          <circle cx="100" cy="100" r="92" />
        </clipPath>
        <linearGradient id="dr-blade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2c2a2b" />
          <stop offset="1" stopColor="#121112" />
        </linearGradient>
        <path id="dr-ring-path" d="M100 100 m-98 0 a98 98 0 1 1 196 0 a98 98 0 1 1 -196 0" />
      </defs>
      <g clipPath="url(#dr-iris-clip)">
        {Array.from({ length: BLADES }, (_, i) => (
          <g key={i} style={{ "--i": i } as CSSProperties} className="dr-iris__blade-wrap">
            <path d={blade} className="dr-iris__blade" fill="url(#dr-blade)" />
          </g>
        ))}
      </g>
      <circle cx="100" cy="100" r="92" className="dr-iris__rim" />
      <text className="dr-iris__stops">
        <textPath href="#dr-ring-path" startOffset="4%">
          {F_STOPS.map((s) => `f/${s}`).join("    ")}
        </textPath>
      </text>
    </svg>
  );
}

export default function Shutter({ webgl, compact, onEnter }: ShutterProps) {
  const phase = useDarkroom((s) => s.phase);
  const sceneReady = useDarkroom((s) => s.sceneReady);
  const [peek, setPeek] = useState(false);
  const [mounted, setMounted] = useState(true);
  const root = useRef<HTMLElement>(null);
  const irisWrap = useRef<HTMLDivElement>(null);

  // Il foro nel velo nero deve stare esattamente al centro del diaframma.
  useLayoutEffect(() => {
    const update = () => {
      const r = irisWrap.current?.getBoundingClientRect();
      const host = root.current;
      if (!r || !host) return;
      host.style.setProperty("--cx", `${r.left + r.width / 2}px`);
      host.style.setProperty("--cy", `${r.top + r.height / 2}px`);
    };
    update();
    const host = root.current;
    window.addEventListener("resize", update);
    host?.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      host?.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    if (phase === "intro") return;
    const t = setTimeout(() => setMounted(false), compact ? COMPACT_UNMOUNT_MS : UNMOUNT_AFTER_MS);
    return () => clearTimeout(t);
  }, [phase, compact]);

  if (!mounted) return null;

  const opening = phase !== "intro";
  const canEnter = webgl === true && sceneReady;
  const status =
    webgl === false
      ? "Il tuo browser non supporta il 3D"
      : canEnter
        ? (compact ? "Pronto" : "Pronto · 36 pose")
        : "Sviluppo della stanza…";

  return (
    <section
      ref={root}
      className={`dr-shutter${opening ? " is-opening" : ""}${peek && !opening ? " is-peeking" : ""}`}
      aria-labelledby="dr-title"
      aria-hidden={opening || undefined}
      inert={opening}
    >
      <div className="dr-shutter__veil" />
      <div className="dr-viewfinder" aria-hidden="true">
        <span className="dr-viewfinder__corner dr-viewfinder__corner--tl" />
        <span className="dr-viewfinder__corner dr-viewfinder__corner--tr" />
        <span className="dr-viewfinder__corner dr-viewfinder__corner--bl" />
        <span className="dr-viewfinder__corner dr-viewfinder__corner--br" />
      </div>

      <header className="dr-shutter__top">
        <span>{PERSON.name.toUpperCase()}</span>
        <span>ROLL 2026 · CAMERA OSCURA</span>
      </header>

      <div className="dr-shutter__poster dr-shutter__poster--left" aria-hidden="true">
        <span>Luce,</span>
        <span>tempo,</span>
        <span>sguardo.</span>
      </div>
      <dl className="dr-shutter__poster dr-shutter__poster--right">
        <div>
          <dt>Diaframma</dt>
          <dd>f/2.8</dd>
        </div>
        <div>
          <dt>Tempo</dt>
          <dd>1/60</dd>
        </div>
        <div>
          <dt>Sensibilità</dt>
          <dd>ISO 400</dd>
        </div>
      </dl>

      <div className="dr-shutter__center">
        <div ref={irisWrap} className="dr-shutter__iris-wrap">
          <Iris />
        </div>
        <div className="dr-shutter__copy">
          <h1 id="dr-title" className="dr-shutter__title">
            {PERSON.name}
          </h1>
          <p className="dr-shutter__roles">{PERSON.roles.join(" · ")}</p>
          <p className="dr-shutter__tagline">{PERSON.tagline}</p>
          {webgl === false ? (
            <Link href="/lavori" className="dr-button dr-button--primary">
              Sfoglia i provini
            </Link>
          ) : (
            <button
              type="button"
              className="dr-button dr-button--primary"
              onClick={onEnter}
              onPointerEnter={compact ? undefined : () => setPeek(true)}
              onPointerLeave={() => setPeek(false)}
              onFocus={() => setPeek(true)}
              onBlur={() => setPeek(false)}
              disabled={!canEnter || opening}
            >
              <span className="dr-button__dot" aria-hidden="true" />
              Apri l&apos;otturatore
            </button>
          )}
          {webgl !== false && <Link href="/lavori" className="dr-shutter__alt">
            {compact ? "Versione senza 3D" : "Preferisci la versione senza 3D? Sfoglia i provini →"}
          </Link>}
        </div>
      </div>

      <footer className="dr-shutter__lcd" aria-live="polite">
        <span className={`dr-shutter__led${canEnter ? " is-ready" : ""}`} aria-hidden="true" />
        <span>{status}</span>
      </footer>
    </section>
  );
}
