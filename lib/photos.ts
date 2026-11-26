/**
 * Le mie fotografie, appese alla parete destra dello studio e mostrate nei provini.
 *
 * Per aggiungerne una: metti il file in public/studio/photos/ (un JPG lungo 2000 px basta,
 * il sito lo ridimensiona da solo) e aggiungi una voce qui sotto. L'ordine è quello sulla
 * parete, da sinistra a destra e dall'alto in basso. Finché la lista è vuota la parete mostra
 * stampe ancora "latenti".
 */

export type PhotoOrientation = "landscape" | "portrait";

export interface Photo {
  /** Percorso dentro public/, per esempio "/studio/photos/langhe.jpg". */
  src: string;
  title: string;
  place?: string;
  /** Data libera, per esempio "Ottobre 2025". */
  date?: string;
  camera?: string;
  caption?: string;
  /** Formato della stampa sulla parete: orizzontale se non indicato. */
  orientation?: PhotoOrientation;
}

export const PHOTOS: readonly Photo[] = [];

/** Le stampe che la parete può ospitare: oltre questo numero le altre restano solo nei pannelli. */
export const WALL_SLOTS = 9;
