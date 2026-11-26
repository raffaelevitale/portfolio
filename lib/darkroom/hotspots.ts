/**
 * Punti interattivi dello studio: ogni oggetto illuminato è una sezione del portfolio.
 * Le pose camera sono in metri. Pianta: x -2.6…2.6 (parete sinistra…destra),
 * z -2…6.5 (parete di fondo…dietro la camera), y 0…2.85.
 *
 * La fotografia attraversa la stanza: il filo delle stampe sopra la libreria (i lavori),
 * l'angolo della camera oscura in fondo a destra (servizi e processo), la mensola con la
 * macchina e la Polaroid sopra la scrivania (chi sono).
 */

export type HotspotId =
  | "lavori"
  | "scrivania"
  | "servizi"
  | "chi-sono"
  | "cv"
  | "contatti"
  | "adesso"
  | "libreria"
  | "musica"
  | "cinema"
  | "fotografie"
  | "gioco";

export type Vec3 = readonly [number, number, number];

export interface CameraPose {
  position: Vec3;
  target: Vec3;
}

export interface HotspotMeta {
  id: HotspotId;
  /** Numero di fotogramma sul rullino (01–12), mostrato nella pellicola. */
  frame: string;
  label: string;
  object: string;
  hint: string;
  pose: CameraPose;
  /** Posa alternativa per schermi stretti (portrait). */
  narrowPose?: CameraPose;
}

/** Vista d'insieme dello studio, larga e stretta. */
export const STUDIO_POSES: { wide: CameraPose; narrow: CameraPose } = {
  wide: { position: [0, 1.62, 4.0], target: [0, 1.2, -0.6] },
  narrow: { position: [0, 1.65, 4.4], target: [0, 1.35, -0.6] },
};

/** Posa iniziale, prima che l'otturatore si apra: vicinissimi alla soglia. */
export const INTRO_POSE: CameraPose = {
  position: [0, 1.6, 6.2],
  target: [0, 1.5, 0],
};

/** L'ordine segue il percorso di chi valuta un profilo: lavori, codice, servizi, persona, contatti, poi le passioni. */
export const HOTSPOTS: readonly HotspotMeta[] = [
  {
    id: "lavori",
    frame: "01",
    label: "Lavori",
    object: "Le stampe appese",
    hint: "I progetti, appesi ad asciugare sopra la libreria.",
    // Leggermente a sinistra: la lampada a sospensione resta dietro il pannello, non sopra le stampe.
    pose: { position: [-0.95, 1.72, 1.5], target: [-0.75, 2.33, -1.5] },
    narrowPose: { position: [-0.65, 1.75, 2.9], target: [-0.65, 2.3, -1.5] },
  },
  {
    id: "scrivania",
    frame: "02",
    label: "Codice",
    object: "La scrivania e il monitor",
    hint: "Dove scrivo codice: l'ultimo commit e i contributi, in diretta da GitHub.",
    pose: { position: [-0.7, 1.52, -0.3], target: [-2.45, 1.3, -0.4] },
    narrowPose: { position: [-0.3, 1.5, 0.3], target: [-2.45, 1.05, -0.4] },
  },
  {
    id: "servizi",
    frame: "03",
    label: "Servizi",
    object: "L'angolo della camera oscura",
    hint: "Cosa faccio e come lavoro, sul tavolo luminoso.",
    pose: { position: [1.45, 1.72, -0.15], target: [1.86, 0.98, -1.66] },
    narrowPose: { position: [1.2, 1.95, 0.55], target: [1.86, 0.98, -1.66] },
  },
  {
    id: "chi-sono",
    frame: "04",
    label: "Chi sono",
    object: "La mensola e la Polaroid",
    hint: "Chi c'è dietro l'obiettivo.",
    pose: { position: [-0.6, 1.55, -0.35], target: [-2.5, 1.5, -0.6] },
    narrowPose: { position: [-0.3, 1.6, 0.3], target: [-2.5, 1.5, -0.6] },
  },
  {
    id: "cv",
    frame: "05",
    label: "CV",
    object: "La busta sulla scrivania",
    hint: "Il percorso completo, e una copia da portare via.",
    pose: { position: [-1.25, 1.45, 0.95], target: [-2.13, 0.75, 0.12] },
    narrowPose: { position: [-0.8, 1.7, 1.5], target: [-2.13, 0.75, 0.12] },
  },
  {
    id: "contatti",
    frame: "06",
    label: "Contatti",
    object: "Il telefono a muro",
    hint: "Alza la cornetta: parliamone.",
    pose: { position: [-1.15, 1.45, 1.55], target: [-2.46, 1.36, 0.62] },
    narrowPose: { position: [-0.6, 1.5, 2.2], target: [-2.46, 1.36, 0.62] },
  },
  {
    id: "adesso",
    frame: "07",
    label: "Adesso",
    object: "La lavagnetta",
    hint: "Cosa sto facendo in questo periodo, scritto a gesso.",
    pose: { position: [-1.45, 1.47, 1.36], target: [-2.58, 1.42, 1.24] },
    narrowPose: { position: [-0.85, 1.5, 1.9], target: [-2.58, 1.42, 1.24] },
  },
  {
    id: "libreria",
    frame: "08",
    label: "Libreria",
    object: "La libreria",
    hint: "Libri e idee che mi interessano.",
    pose: { position: [-0.9, 1.45, 1.2], target: [-0.9, 1.3, -1.8] },
    narrowPose: { position: [-0.9, 1.5, 2.2], target: [-0.9, 1.3, -1.8] },
  },
  {
    id: "musica",
    frame: "09",
    label: "Musica",
    object: "Il giradischi",
    hint: "Cosa sto ascoltando, in diretta da Spotify.",
    pose: { position: [0.95, 1.45, -0.45], target: [1.06, 0.9, -1.8] },
    narrowPose: { position: [0.9, 1.7, 0.1], target: [1.06, 0.9, -1.8] },
  },
  {
    id: "cinema",
    frame: "10",
    label: "Cinema",
    object: "Le locandine",
    hint: "Gli ultimi film visti, da Letterboxd.",
    pose: { position: [1.06, 1.6, 0.0], target: [1.06, 1.68, -1.97] },
    narrowPose: { position: [1.06, 1.6, 0.8], target: [1.06, 1.68, -1.97] },
  },
  {
    id: "fotografie",
    frame: "11",
    label: "Fotografie",
    object: "La parete delle stampe",
    hint: "Le mie fotografie, appese ad asciugare.",
    pose: { position: [0.9, 1.55, -0.35], target: [2.6, 1.55, -0.45] },
    narrowPose: { position: [0.25, 1.6, -0.15], target: [2.6, 1.55, -0.45] },
  },
  {
    id: "gioco",
    frame: "12",
    label: "Gioco",
    object: "Il televisore",
    hint: "A cosa sto giocando, da Steam.",
    pose: { position: [1.05, 1.15, 1.6], target: [2.4, 0.85, 0.95] },
    narrowPose: { position: [0.5, 1.25, 2.3], target: [2.4, 0.85, 0.95] },
  },
];

export function getHotspot(id: HotspotId): HotspotMeta {
  const found = HOTSPOTS.find((h) => h.id === id);
  if (!found) {
    throw new Error(`Hotspot sconosciuto: ${id}`);
  }
  return found;
}

export function poseFor(id: HotspotId | null, narrow: boolean): CameraPose {
  if (id === null) {
    return narrow ? STUDIO_POSES.narrow : STUDIO_POSES.wide;
  }
  const meta = getHotspot(id);
  return narrow && meta.narrowPose ? meta.narrowPose : meta.pose;
}
