"use client";

import { useEffect } from "react";
import { create } from "zustand";
import type { LiveDataMap, LiveEnvelope, LiveKind } from "./types";

/** Ogni quanto il client richiede di nuovo i dati (la CDN fa da cuscinetto). */
const REFRESH_MS: Record<LiveKind, number> = {
  spotify: 30_000,
  github: 600_000,
  steam: 120_000,
  letterboxd: 600_000,
};

type Entries = { [K in LiveKind]?: LiveEnvelope<LiveDataMap[K]> };

interface LiveStore {
  entries: Entries;
  put: <K extends LiveKind>(kind: K, value: LiveEnvelope<LiveDataMap[K]>) => void;
}

const useLiveStore = create<LiveStore>((set) => ({
  entries: {},
  put: (kind, value) => set((s) => ({ entries: { ...s.entries, [kind]: value } })),
}));

const subscribers: Record<LiveKind, number> = { spotify: 0, github: 0, steam: 0, letterboxd: 0 };
const timers: Partial<Record<LiveKind, ReturnType<typeof setInterval>>> = {};

async function load<K extends LiveKind>(kind: K): Promise<void> {
  const { put } = useLiveStore.getState();
  try {
    const res = await fetch(`/api/live/${kind}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    put(kind, (await res.json()) as LiveEnvelope<LiveDataMap[K]>);
  } catch {
    // Teniamo gli ultimi dati validi, se ci sono: un errore di rete non deve svuotare la stanza.
    if (!useLiveStore.getState().entries[kind]) {
      put(kind, { configured: true, data: null, error: "network", fetchedAt: new Date().toISOString() });
    }
  }
}

function isStale(kind: LiveKind): boolean {
  const entry = useLiveStore.getState().entries[kind];
  return !entry || Date.now() - Date.parse(entry.fetchedAt) > REFRESH_MS[kind];
}

/**
 * Dati live condivisi: più componenti sulla stessa fonte fanno una sola richiesta,
 * e il polling si ferma quando nessuno li sta più guardando.
 */
export function useLive<K extends LiveKind>(kind: K): LiveEnvelope<LiveDataMap[K]> | undefined {
  useEffect(() => {
    subscribers[kind] += 1;
    if (subscribers[kind] === 1) {
      if (isStale(kind)) void load(kind);
      timers[kind] = setInterval(() => void load(kind), REFRESH_MS[kind]);
    }
    return () => {
      subscribers[kind] -= 1;
      if (subscribers[kind] === 0) {
        clearInterval(timers[kind]);
        delete timers[kind];
      }
    };
  }, [kind]);

  return useLiveStore((s) => s.entries[kind]) as LiveEnvelope<LiveDataMap[K]> | undefined;
}
