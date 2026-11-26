import { create } from "zustand";
import type { HotspotId } from "./hotspots";

/**
 * intro    → otturatore chiuso, la scena si carica dietro
 * entering → l'otturatore si apre e la camera entra nella stanza
 * room     → esplorazione libera
 */
export type Phase = "intro" | "entering" | "room";

interface DarkroomState {
  phase: Phase;
  sceneReady: boolean;
  focus: HotspotId | null;
  hovered: HotspotId | null;
  guideOpen: boolean;
  soundOn: boolean;
  /** true quando le luci calde sono spente e lo studio è illuminato solo dalla luce di sicurezza. */
  safelight: boolean;
  /** Indice del libro estratto dallo scaffale, o null. */
  selectedBook: number | null;
  /** Slug della stampa cliccata sul filo dei lavori, per aprire il pannello sul suo caso. */
  selectedPrint: string | null;
  /** Indice della fotografia cliccata sulla parete. */
  selectedPhoto: number | null;
  enter: () => void;
  arrive: () => void;
  markSceneReady: () => void;
  setFocus: (id: HotspotId | null) => void;
  setHovered: (id: HotspotId | null) => void;
  setGuideOpen: (open: boolean) => void;
  toggleSound: () => void;
  toggleSafelight: () => void;
  selectBook: (index: number | null) => void;
  selectPrint: (slug: string | null) => void;
  selectPhoto: (index: number | null) => void;
}

export const useDarkroom = create<DarkroomState>((set, get) => ({
  phase: "intro",
  sceneReady: false,
  focus: null,
  hovered: null,
  guideOpen: false,
  soundOn: true,
  safelight: false,
  selectedBook: null,
  selectedPrint: null,
  selectedPhoto: null,
  enter: () => {
    if (get().phase === "intro") set({ phase: "entering" });
  },
  arrive: () => {
    if (get().phase === "entering") set({ phase: "room" });
  },
  markSceneReady: () => set({ sceneReady: true }),
  setFocus: (id) => set({ focus: id, hovered: null, guideOpen: false, selectedBook: null, selectedPrint: null, selectedPhoto: null }),
  setHovered: (id) => set({ hovered: id }),
  setGuideOpen: (open) => set({ guideOpen: open }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  toggleSafelight: () => set((s) => ({ safelight: !s.safelight })),
  selectBook: (index) => set({ selectedBook: index }),
  selectPrint: (slug) => set({ selectedPrint: slug }),
  selectPhoto: (index) => set({ selectedPhoto: index }),
}));
