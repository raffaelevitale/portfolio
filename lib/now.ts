/**
 * La lavagnetta "Adesso" accanto alla scrivania: cosa sto facendo in questo periodo.
 * Aggiornala a mano ogni tanto (e cambia `updated`). La riga su cosa sto ascoltando
 * si aggiunge da sola, in diretta da Spotify.
 */

import type { SpotifyData } from "./live/types";

export interface NowItem {
  /** Il verbo, scritto piccolo: "Costruisco", "Leggo", "Imparo"… */
  label: string;
  text: string;
}

export const NOW: { updated: string; items: readonly NowItem[] } = {
  updated: "Novembre 2026",
  items: [
    { label: "Costruisco", text: "questo studio, un oggetto alla volta" },
    { label: "Cerco", text: "un ruolo da sviluppatore o sales engineer" },
  ],
};

/** La riga in diretta: il brano in ascolto o appena ascoltato, altrimenti l'album del mese. */
export function listeningLine(data: SpotifyData | null | undefined): NowItem | null {
  if (data?.track) return { label: "Ascolto", text: `${data.track.title} — ${data.track.artist}` };
  const top = data?.topAlbums[0];
  return top ? { label: "Ascolto", text: `${top.name} — ${top.artist}` } : null;
}

/** Le righe della lavagnetta, con l'ascolto in diretta quando c'è. */
export function nowLines(data: SpotifyData | null | undefined): readonly NowItem[] {
  const live = listeningLine(data);
  return live ? [...NOW.items, live] : NOW.items;
}
