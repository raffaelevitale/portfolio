/**
 * Contenuti del portfolio, condivisi tra la camera oscura 3D e la versione editoriale /lavori.
 * Allineati al CV 2026 (v3). Modifica qui: entrambe le esperienze si aggiornano insieme.
 */

export const PERSON = {
  name: "Raffaele Vitale",
  headline: "Sviluppatore Web",
  focus: "Web, AI e automazione per le aziende",
  email: "raffa.vitale26@gmail.com",
  location: "Savigliano (CN), Italia",
  cvUrl: "/CV_Raffaele_Vitale.pdf",
  portrait: "/camera-oscura/ritratto.jpg",
  availability: "Disponibile per nuovi ruoli",
  lookingFor: "Cerco un ruolo da sviluppatore o da tecnico commerciale / sales engineer.",
  roles: ["Sviluppatore Web", "Web, AI e automazione", "Sales engineer", "Fotografo & Videomaker"],
  tagline:
    "Costruisco applicazioni web e interfacce usate da persone reali — e so portarle davanti al cliente.",
} as const;

export const SOCIALS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/vitaleraffaele/" },
  { label: "GitHub", url: "https://github.com/raffaelevitale" },
  { label: "Instagram", url: "https://www.instagram.com/josh63.exe/" },
] as const;

export type Project = {
  slug: string;
  /** Numero di fotogramma sul rullino, stile bordo pellicola. */
  frame: string;
  name: string;
  role: string;
  period: string;
  /** Anno breve per la didascalia a matita sotto la stampa. */
  year: string;
  /** Il numero che conta, in evidenza. */
  metric?: string;
  summary: string;
  /** Caso di studio: il problema di partenza. Se manca, il progetto mostra solo il riassunto. */
  problem?: string;
  /** "Cosa ho fatto": le scelte concrete. */
  highlights: readonly string[];
  /** Caso di studio: com'è andata a finire, con un numero quando c'è. */
  outcome?: string;
  url: string;
  urlLabel: string;
  tags: readonly string[];
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "orario-vallauri",
    frame: "01A",
    name: "ORARIO VALLAURI",
    role: "PWA con app Android e iOS — progetto d'esame in coppia",
    period: "Ott 2025 — oggi",
    year: "2025",
    metric: "≈ 1.500 utenti attivi al giorno",
    summary:
      "L'orario scolastico dell'IIS Vallauri, usato ogni giorno da studenti e docenti. Ho curato frontend, interfaccia e design system mobile-first.",
    highlights: [
      "Viste per studenti e docenti, orario giornaliero e settimanale, countdown della lezione in tempo reale",
      "PWA offline con Service Worker, notifiche push, onboarding e import CSV",
      "Accesso Google limitato al dominio dell'istituto, dark mode e accessibilità",
    ],
    problem:
      "Studenti e docenti dell'istituto consultano l'orario ogni giorno, quasi sempre dal telefono: serviva qualcosa di rapido da aprire, da leggere e utilizzabile anche senza rete.",
    outcome:
      "Consegnato all'IIS Vallauri come progetto d'esame e usato ogni giorno: circa 1.500 utenti attivi al giorno, area amministrativa esclusa.",
    url: "https://orario.vallauri.edu",
    urlLabel: "orario.vallauri.edu",
    tags: ["PWA", "Node.js", "Fastify", "MySQL", "Service Worker", "PM2", "Sentry"],
  },
  {
    slug: "crybu-control-center",
    frame: "02A",
    name: "CRYBU CONTROL CENTER",
    role: "Frontend della piattaforma clienti — Crybu.io, startup AI",
    period: "Feb — Set 2026",
    year: "2026",
    summary:
      "La piattaforma web con cui i clienti di Crybu.io attivano e seguono i moduli AI. Dal prototipo in Figma Make al design system, fino all'implementazione in Next.js.",
    highlights: [
      "Componenti UI, dashboard, chat, workspace analytics, backoffice, AI Hub e “Da Fare Oggi”",
      "Onboarding guidato: Quickstart con avanzamento persistente e attivazione di un servizio in 3 step",
      "Ambiente demo usato nelle presentazioni commerciali",
    ],
    problem:
      "I clienti di Crybu.io dovevano poter attivare e seguire i moduli AI da soli, e il team commerciale aveva bisogno di un prodotto da mostrare dal vivo.",
    outcome:
      "Dal prototipo in Figma Make all'implementazione in Next.js: la piattaforma dei clienti, con l'attivazione di un servizio in 3 step e un ambiente demo usato nelle presentazioni commerciali.",
    url: "https://crybu.io",
    urlLabel: "crybu.io",
    tags: ["Next.js", "TypeScript", "Figma Make", "Design system", "Onboarding"],
  },
  {
    slug: "fotografia",
    frame: "03A",
    name: "FOTOGRAFIA & VIDEO",
    role: "Fotografo e videomaker freelance — @josh63.exe",
    period: "Mar 2023 — oggi",
    year: "2023",
    metric: "Oltre 30 servizi",
    summary:
      "Eventi, ritratti e shooting commerciali, seguendo il cliente dalla consulenza iniziale alla consegna.",
    highlights: ["Post-produzione con Lightroom e Photoshop", "Grafiche e contenuti per i social"],
    url: "https://www.instagram.com/josh63.exe/",
    urlLabel: "@josh63.exe",
    tags: ["Eventi", "Ritratti", "Commerciale", "Lightroom", "Photoshop"],
  },
];

/** Il fotogramma della stampa ancora "latente", subito dopo l'ultimo progetto. */
export const NEXT_FRAME = `${String(PROJECTS.length + 1).padStart(2, "0")}A`;
/** Slug della stampa latente sul filo: il "prossimo progetto". */
export const LATENT_SLUG = "next";

export type Service = { num: string; title: string; desc: string; tools: readonly string[] };

export const SERVICES: readonly Service[] = [
  {
    num: "01",
    title: "Sviluppo web & app",
    desc: "Applicazioni web e PWA, dall'interfaccia al backend: React, Next.js, Node.js. Pensate per essere usate davvero, anche da mobile e offline.",
    tools: ["TypeScript", "Next.js", "Node.js", "MySQL"],
  },
  {
    num: "02",
    title: "AI e automazione",
    desc: "Moduli e flussi AI dentro i processi aziendali: scoring, analisi delle call, onboarding guidato, CRM allineato.",
    tools: ["AI workflow", "Baserow", "Automazioni"],
  },
  {
    num: "03",
    title: "Consulenza tecnico-commerciale",
    desc: "Qualificazione dei lead, analisi dei bisogni, demo e onboarding: traduco la tecnologia in valore per chi la compra.",
    tools: ["Demo", "Onboarding", "Rete consulenti"],
  },
  {
    num: "04",
    title: "Brand, foto e video",
    desc: "Identità visiva, brand guidelines e template commerciali; servizi fotografici e video con post-produzione.",
    tools: ["Figma", "Lightroom", "Photoshop"],
  },
];

/** Il processo di lavoro, raccontato come i quattro bagni della stampa in camera oscura. */
export type ProcessStep = { step: string; bath: string; title: string; desc: string; tint: string };

export const PROCESS: readonly ProcessStep[] = [
  {
    step: "01",
    bath: "Sviluppo",
    title: "Scoperta",
    desc: "Ascolto chi userà il prodotto, analizzo i bisogni e il contesto. L'immagine latente comincia ad affiorare.",
    tint: "#c9b48a",
  },
  {
    step: "02",
    bath: "Arresto",
    title: "Strategia",
    desc: "Definisco priorità, architettura e roadmap. Si ferma il processo nel punto giusto, prima di scrivere codice inutile.",
    tint: "#d8c46a",
  },
  {
    step: "03",
    bath: "Fissaggio",
    title: "Design e sviluppo",
    desc: "Prototipo, design system e codice, iterati con chi li userà davvero. Quello che resta, resta per sempre.",
    tint: "#b9c4c8",
  },
  {
    step: "04",
    bath: "Lavaggio",
    title: "Lancio",
    desc: "Demo, onboarding e supporto dopo il rilascio. La stampa è pronta per essere appesa.",
    tint: "#9fb7c9",
  },
];

export type Experience = {
  role: string;
  org: string;
  period: string;
  points: readonly string[];
};

export const EXPERIENCE: readonly Experience[] = [
  {
    role: "Responsabile Consulenti e Vendite",
    org: "Crybu.io — startup AI, Cuneo · prima Brand Manager e Chief of Staff",
    period: "Feb — Set 2026",
    points: [
      "Percorso commerciale B2B: qualificazione dei lead, analisi dei bisogni, demo e follow-up",
      "Frontend del Crybu Control Center, dalla prototipazione all'implementazione in Next.js",
      "Partner Program per i consulenti, con flusso AI per lo scoring dei candidati e l'analisi delle call",
      "Sito web completo per un cliente: hosting su Vercel, WordPress, SEO/GEO",
      "Identità visiva, brand guidelines, template commerciali, grafiche per le fiere e 5 video",
    ],
  },
  {
    role: "Fotografo e videomaker freelance",
    org: "@josh63.exe",
    period: "Mar 2023 — oggi",
    points: ["Oltre 30 servizi tra eventi, ritratti e shooting commerciali, dalla consulenza alla consegna"],
  },
  {
    role: "Stage PCTO — sviluppo, dati e supporto IT",
    org: "Cassa di Risparmio di Fossano · IIS Vallauri",
    period: "2024 — 2025",
    points: [
      "Test di app iOS, Android, web e ATM con bug report e valutazione di accessibilità WCAG",
      "Script Python per scraping e migrazione dei contenuti su un nuovo CMS",
      "Oltre 150 programmi Python con SQL per estrazione e analisi di dati bancari",
      "Cablaggio e test LAN di un laboratorio, configurazione di PC e LIM",
    ],
  },
  {
    role: "Chef de Rang e cameriere",
    org: "Da Vincenzo · Palazzo Righini",
    period: "Ago 2022 — Ago 2026",
    points: ["Coordinamento della sala, formazione dei nuovi collaboratori e gestione diretta dei clienti, tra fine dining ed eventi"],
  },
];

export type SkillGroup = { label: string; items: readonly string[] };

export const SKILLS: readonly SkillGroup[] = [
  {
    label: "Sviluppo",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "C#", "React", "Next.js", "Tailwind CSS", "Node.js (Fastify)", "MySQL"],
  },
  { label: "Infrastruttura", items: ["Vercel", "Reti LAN e cablaggio (Cisco)", "Hardware e sistemi"] },
  { label: "Web & strumenti", items: ["Figma", "GitHub", "WordPress", "SEO/GEO", "ClickUp", "Baserow"] },
  { label: "Commerciale", items: ["Consulenza tecnico-commerciale", "Qualificazione lead", "Demo", "Onboarding clienti"] },
  { label: "Design & creatività", items: ["Brand identity", "UI/UX", "Design system", "Lightroom", "Photoshop", "Video"] },
];

export const ABOUT = {
  paragraphs: [
    "Sviluppatore web, diplomato in Informatica all'IIS Vallauri nel 2026. Costruisco applicazioni web e interfacce usate da persone reali, e so portarle davanti al cliente.",
    "In Crybu.io, startup AI di Cuneo, ho progettato il frontend della piattaforma clienti e seguito il percorso commerciale B2B: demo, onboarding, rete di consulenti.",
    "Fuori dallo schermo fotografo e giro video dal 2023. E quattro anni in sala, tra fine dining ed eventi, mi hanno insegnato a gestire i clienti e a formare le persone.",
  ],
  education: "Diploma tecnico in Informatica — IIS “G. Vallauri”, Fossano (2026)",
  certifications: [
    "Cisco CCNA: Introduction to Networks",
    "Career Essentials in Generative AI — Microsoft & LinkedIn (2025)",
  ],
  languages: "Italiano madrelingua · Inglese",
} as const;
