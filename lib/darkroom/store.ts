import { create } from "zustand";
import type { HotspotId, RoomId } from "./hotspots";

/**
 * intro    → otturatore chiuso, la scena si carica dietro
 * entering → l'otturatore si apre e la camera entra nella stanza
 * room     → esplorazione libera
 */
export type Phase = "intro" | "entering" | "room";

/** Tempi della porta girevole: avvicinamento + dissolvenza al nero, poi la nuova stanza. */
export const DOOR_APPROACH_MS = 700;
export const DOOR_FADE_MS = 450;

interface DarkroomState {
  phase: Phase;
  room: RoomId;
  /** true mentre lo schermo è al nero tra una stanza e l'altra. */
  switching: boolean;
  sceneReady: boolean;
  focus: HotspotId | null;
  hovered: HotspotId | null;
  guideOpen: boolean;
  soundOn: boolean;
  /** Indice del libro estratto dallo scaffale, o null. */
  selectedBook: number | null;
  enter: () => void;
  arrive: () => void;
  markSceneReady: () => void;
  setFocus: (id: HotspotId | null) => void;
  setHovered: (id: HotspotId | null) => void;
  setGuideOpen: (open: boolean) => void;
  toggleSound: () => void;
  selectBook: (index: number | null) => void;
  goToRoom: (room: RoomId, door: HotspotId) => void;
}

export const useDarkroom = create<DarkroomState>((set, get) => ({
  phase: "intro",
  room: "darkroom",
  switching: false,
  sceneReady: false,
  focus: null,
  hovered: null,
  guideOpen: false,
  soundOn: true,
  selectedBook: null,
  enter: () => {
    if (get().phase === "intro") set({ phase: "entering" });
  },
  arrive: () => {
    if (get().phase === "entering") set({ phase: "room" });
  },
  markSceneReady: () => set({ sceneReady: true }),
  setFocus: (id) => set({ focus: id, hovered: null, guideOpen: false, selectedBook: null }),
  setHovered: (id) => set({ hovered: id }),
  setGuideOpen: (open) => set({ guideOpen: open }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  selectBook: (index) => set({ selectedBook: index }),
  goToRoom: (room, door) => {
    const state = get();
    if (state.switching || state.room === room || state.focus === door) return;
    // La camera si avvicina alla porta, lo schermo va al nero, poi si cambia stanza.
    set({ focus: door, hovered: null, guideOpen: false, selectedBook: null });
    setTimeout(() => set({ switching: true }), DOOR_APPROACH_MS - DOOR_FADE_MS);
    setTimeout(() => set({ room, focus: null }), DOOR_APPROACH_MS);
    setTimeout(() => set({ switching: false }), DOOR_APPROACH_MS + 120);
  },
}));
