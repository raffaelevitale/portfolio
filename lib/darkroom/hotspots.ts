/**
 * Punti interattivi delle due stanze. Ogni oggetto illuminato è una sezione del portfolio.
 * Le pose camera sono in metri, nello spazio della propria stanza: entrambe le stanze hanno
 * la stessa pianta (x -2.6…2.6, z -2…6.5) e vengono montate una alla volta.
 */

export type RoomId = "darkroom" | "studio";

export type HotspotId =
  | "lavori"
  | "processo"
  | "servizi"
  | "chi-sono"
  | "cv"
  | "contatti"
  | "porta-studio"
  | "libreria"
  | "musica"
  | "scrivania"
  | "vetrina"
  | "gioco"
  | "cinema"
  | "porta-camera";

export type Vec3 = readonly [number, number, number];

export interface CameraPose {
  position: Vec3;
  target: Vec3;
}

export interface HotspotMeta {
  id: HotspotId;
  room: RoomId;
  /** Numero di fotogramma: le due stanze sono lo stesso rullino (01–06, 07–12). */
  frame: string;
  label: string;
  object: string;
  hint: string;
  pose: CameraPose;
  /** Posa alternativa per schermi stretti (portrait). */
  narrowPose?: CameraPose;
  /** Se presente, l'oggetto è una porta: invece di aprire un pannello porta in un'altra stanza. */
  leadsTo?: RoomId;
}

interface RoomPoses {
  wide: CameraPose;
  narrow: CameraPose;
  /** Dove si trova la camera appena attraversata la porta, prima di avanzare nella stanza. */
  entry: CameraPose;
}

export const ROOM_POSES: Record<RoomId, RoomPoses> = {
  darkroom: {
    wide: { position: [0, 1.68, 4.1], target: [0, 1.22, -0.6] },
    narrow: { position: [0, 1.7, 4.4], target: [0, 1.4, -0.6] },
    entry: { position: [-1.3, 1.6, -0.6], target: [1, 1.3, 1.5] },
  },
  studio: {
    wide: { position: [0, 1.62, 4.0], target: [0, 1.15, -0.6] },
    narrow: { position: [0, 1.65, 4.4], target: [0, 1.3, -0.6] },
    entry: { position: [1.3, 1.6, -0.6], target: [-1, 1.3, 1.5] },
  },
};

/** Posa iniziale, prima che l'otturatore si apra: vicinissimi alla soglia. */
export const INTRO_POSE: CameraPose = {
  position: [0, 1.6, 6.2],
  target: [0, 1.5, 0],
};

export const HOTSPOTS: readonly HotspotMeta[] = [
  {
    id: "lavori",
    room: "darkroom",
    frame: "01",
    label: "Lavori",
    object: "Le stampe appese",
    hint: "I progetti, appesi ad asciugare.",
    pose: { position: [0.18, 1.8, 1.55], target: [0.18, 1.74, -1.9] },
    narrowPose: { position: [0.18, 1.8, 2.2], target: [0.18, 1.74, -1.9] },
  },
  {
    id: "processo",
    room: "darkroom",
    frame: "02",
    label: "Processo",
    object: "Le quattro bacinelle",
    hint: "Come lavoro, bagno dopo bagno.",
    pose: { position: [0, 1.72, -0.1], target: [0, 0.9, -1.62] },
    narrowPose: { position: [0, 1.95, 0.7], target: [0, 0.9, -1.62] },
  },
  {
    id: "servizi",
    room: "darkroom",
    frame: "03",
    label: "Servizi",
    object: "Il tavolo luminoso",
    hint: "Cosa faccio, su un foglio di provini.",
    pose: { position: [-1.0, 1.72, 0.32], target: [-2.05, 0.95, 0.2] },
    narrowPose: { position: [-0.5, 1.95, 0.4], target: [-2.05, 0.95, 0.2] },
  },
  {
    id: "chi-sono",
    room: "darkroom",
    frame: "04",
    label: "Chi sono",
    object: "La mensola e la Polaroid",
    hint: "Chi c'è dietro l'obiettivo.",
    pose: { position: [0.5, 1.6, 0.0], target: [2.45, 1.45, -0.15] },
    narrowPose: { position: [0.2, 1.65, 0.6], target: [2.45, 1.45, -0.15] },
  },
  {
    id: "cv",
    room: "darkroom",
    frame: "05",
    label: "CV",
    object: "La busta sul bancone",
    hint: "Il percorso completo, e una copia da portare via.",
    pose: { position: [1.15, 1.55, 1.25], target: [2.05, 0.92, 0.45] },
    narrowPose: { position: [0.6, 1.7, 1.9], target: [2.05, 0.92, 0.45] },
  },
  {
    id: "contatti",
    room: "darkroom",
    frame: "06",
    label: "Contatti",
    object: "Il telefono a muro",
    hint: "Alza la cornetta: parliamone.",
    pose: { position: [1.2, 1.45, 1.65], target: [2.46, 1.36, 0.88] },
    narrowPose: { position: [0.6, 1.5, 2.3], target: [2.46, 1.36, 0.88] },
  },
  {
    id: "porta-studio",
    room: "darkroom",
    frame: "→",
    label: "Studio",
    object: "La porta girevole",
    hint: "Di là c'è lo studio: codice, musica e passioni.",
    pose: { position: [-1.0, 1.55, -0.4], target: [-2.05, 1.2, -1.5] },
    leadsTo: "studio",
  },
  {
    id: "libreria",
    room: "studio",
    frame: "07",
    label: "Libreria",
    object: "La libreria",
    hint: "Libri e idee che mi interessano.",
    pose: { position: [-0.9, 1.45, 1.2], target: [-0.9, 1.3, -1.8] },
    narrowPose: { position: [-0.9, 1.5, 2.2], target: [-0.9, 1.3, -1.8] },
  },
  {
    id: "musica",
    room: "studio",
    frame: "08",
    label: "Musica",
    object: "Il giradischi",
    hint: "Cosa sto ascoltando, in diretta da Spotify.",
    pose: { position: [0.95, 1.4, -0.5], target: [1.06, 0.72, -1.72] },
    narrowPose: { position: [0.9, 1.7, 0.1], target: [1.06, 0.72, -1.72] },
  },
  {
    id: "cinema",
    room: "studio",
    frame: "09",
    label: "Cinema",
    object: "Le locandine",
    hint: "Gli ultimi film visti, da Letterboxd.",
    pose: { position: [1.06, 1.6, 0.0], target: [1.06, 1.68, -1.97] },
    narrowPose: { position: [1.06, 1.6, 0.8], target: [1.06, 1.68, -1.97] },
  },
  {
    id: "scrivania",
    room: "studio",
    frame: "10",
    label: "Scrivania",
    object: "La scrivania e il monitor",
    hint: "Dove scrivo codice: attività live da GitHub.",
    pose: { position: [-0.85, 1.42, -0.35], target: [-2.45, 1.05, -0.4] },
    narrowPose: { position: [-0.3, 1.5, 0.3], target: [-2.45, 1.05, -0.4] },
  },
  {
    id: "vetrina",
    room: "studio",
    frame: "11",
    label: "Vetrina",
    object: "Orologi e modellini",
    hint: "Le passioni: orologi e auto.",
    pose: { position: [0.85, 1.3, -0.35], target: [2.42, 1.15, -0.4] },
    narrowPose: { position: [0.3, 1.4, 0.3], target: [2.42, 1.15, -0.4] },
  },
  {
    id: "gioco",
    room: "studio",
    frame: "12",
    label: "Gioco",
    object: "Il televisore",
    hint: "A cosa sto giocando, da Steam.",
    pose: { position: [1.05, 1.15, 1.6], target: [2.4, 0.85, 0.95] },
    narrowPose: { position: [0.5, 1.25, 2.3], target: [2.4, 0.85, 0.95] },
  },
  {
    id: "porta-camera",
    room: "studio",
    frame: "←",
    label: "Camera oscura",
    object: "La porta girevole",
    hint: "Si torna nella luce rossa.",
    pose: { position: [1.0, 1.55, -0.4], target: [2.05, 1.2, -1.5] },
    leadsTo: "darkroom",
  },
];

export function getHotspot(id: HotspotId): HotspotMeta {
  const found = HOTSPOTS.find((h) => h.id === id);
  if (!found) {
    throw new Error(`Hotspot sconosciuto: ${id}`);
  }
  return found;
}

/** Oggetti di una stanza che aprono un pannello (porte escluse). */
export function hotspotsIn(room: RoomId): readonly HotspotMeta[] {
  return HOTSPOTS.filter((h) => h.room === room && !h.leadsTo);
}

/** La porta che dalla stanza indicata porta all'altra. */
export function doorOf(room: RoomId): HotspotMeta {
  const door = HOTSPOTS.find((h) => h.room === room && h.leadsTo);
  if (!door) {
    throw new Error(`Nessuna porta nella stanza: ${room}`);
  }
  return door;
}

export function poseFor(room: RoomId, id: HotspotId | null, narrow: boolean): CameraPose {
  if (id === null) {
    return narrow ? ROOM_POSES[room].narrow : ROOM_POSES[room].wide;
  }
  const meta = getHotspot(id);
  return narrow && meta.narrowPose ? meta.narrowPose : meta.pose;
}
