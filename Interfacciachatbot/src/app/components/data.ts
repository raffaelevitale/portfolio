export type ModuleType = 'chat' | 'settings' | 'files' | 'dashboard';

export type Module = {
  id: string;
  name: string;
  type: ModuleType;
  purchased: boolean;
  active: boolean;
  description?: string;
  lockedInfo?: { title: string; subtitle: string; description: string };
};

export type Funzione = {
  id: string;
  name: string;
  modules: Module[];
};

export type Ambito = {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  iconName: string;
  funzioni: Funzione[];
};

export const ambiti: Ambito[] = [
  {
    id: 'aegis',
    name: 'AEGIS',
    subtitle: 'Data Governance & Secure AI Layer',
    color: '#1B3A6B',
    iconName: 'shield',
    funzioni: [
      {
        id: 'aegis-produzione',
        name: 'Produzione',
        modules: [
          {
            id: 'M093',
            name: 'MOTORE DI INSTRADAMENTO SEMANTICO',
            type: 'chat',
            purchased: true,
            active: true,
            description: 'Orchestrazione intelligente delle richieste verso i sistemi AI piu competenti.',
          },
        ],
      },
      {
        id: 'aegis-utility',
        name: 'Utility',
        modules: [
          {
            id: 'M010',
            name: 'NORMALIZZA DATI',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Trasforma input eterogenei in dati strutturati pronti per i moduli AI.',
          },
          {
            id: 'M011',
            name: 'SMISTAMENTO EMAIL AUTOMATICO',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Analizza e assegna automaticamente le email al reparto corretto.',
          },
          {
            id: 'M012',
            name: "ORDINAMENTO PRIORITA' AUTOMATICA",
            type: 'dashboard',
            purchased: true,
            active: false,
            description: 'Riordina automaticamente le richieste in base a criteri di priorita.',
          },
          {
            id: 'M013',
            name: 'EMAIL ACTION',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Trasforma email classificate in azioni operative tracciabili.',
          },
          {
            id: 'M021',
            name: 'Estrazione dati da documenti',
            type: 'files',
            purchased: true,
            active: false,
            description: 'Estrae automaticamente campi strutturati da documenti aziendali.',
          },
          {
            id: 'M024',
            name: 'Accesso Servizi Web tramite API',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Interazione automatica con servizi web esterni tramite API ufficiali.',
          },
          {
            id: 'M025',
            name: 'Accesso Servizi Web tramite RPA',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Automazione browser per siti senza API disponibili.',
          },
          {
            id: 'M026',
            name: 'Agente Web Operativo',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Agente AI che esegue operazioni su piattaforme web in autonomia.',
          },
          {
            id: 'M027',
            name: 'WEB CONTENT CONTROL',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Modifica diretta dei contenuti web tramite chatbot conversazionale.',
          },
          {
            id: 'M101',
            name: 'Server MCP Aziendale',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Espone sistemi aziendali ad agenti esterni tramite protocollo MCP.',
          },
        ],
      },
    ],
  },
  {
    id: 'orion',
    name: 'ORION',
    subtitle: 'Predictive Strategy Engine',
    color: '#F97316',
    iconName: 'compass',
    funzioni: [
      {
        id: 'orion-direzione',
        name: 'Direzione',
        modules: [
          {
            id: 'M001',
            name: "SCOPRI L'AI COSA DICE DI TE",
            type: 'dashboard',
            purchased: true,
            active: true,
            description: 'Fotografia reputazionale aziendale su web, media, social e motori AI.',
          },
        ],
      },
      {
        id: 'orion-intelligence',
        name: 'Intelligence',
        modules: [
          {
            id: 'M022',
            name: 'Analisi Sito Web',
            type: 'dashboard',
            purchased: true,
            active: false,
            description: 'Analisi automatica del sito con sintesi strutturata dei contenuti.',
          },
          {
            id: 'M023',
            name: 'Profilazione Azienda',
            type: 'chat',
            purchased: true,
            active: false,
            description: 'Chatbot che raccoglie informazioni e compila campi CRM predefiniti.',
          },
          {
            id: 'M051',
            name: 'Trascrizione e sintesi riunioni',
            type: 'files',
            purchased: true,
            active: false,
            description: 'Trasforma meeting e call in report operativi riutilizzabili.',
          },
          {
            id: 'M081',
            name: 'Monitoraggio competitor automatico',
            type: 'dashboard',
            purchased: true,
            active: false,
            description: 'Analisi continua delle attivita dei concorrenti.',
          },
          {
            id: 'M091',
            name: 'Analisi automatica KPI aziendali',
            type: 'dashboard',
            purchased: true,
            active: false,
            description: 'Genera insight dai dati aziendali in tempo reale.',
          },
          {
            id: 'M092',
            name: 'Assistente Intelligence Aziendale',
            type: 'chat',
            purchased: true,
            active: false,
            description: 'Raccoglie e analizza informazioni su aziende e mercati.',
          },
          {
            id: 'M998',
            name: 'TREND & TOPIC DI SETTORE',
            type: 'dashboard',
            purchased: true,
            active: false,
            description: 'Individua trend di settore e opportunita di contenuto.',
          },
        ],
      },
    ],
  },
  {
    id: 'goji',
    name: 'GOJI',
    subtitle: 'Conversational Sales Agent',
    color: '#10B981',
    iconName: 'target',
    funzioni: [
      {
        id: 'goji-sales',
        name: 'Vendita Conversazionale',
        modules: [
          {
            id: 'M041',
            name: 'Generazione automatica preventivi',
            type: 'chat',
            purchased: true,
            active: true,
            description: 'Crea preventivi commerciali rapidi con supporto AI.',
          },
          {
            id: 'M062',
            name: 'Qualificazione automatica lead',
            type: 'chat',
            purchased: true,
            active: true,
            description: 'Valuta automaticamente qualita e priorita dei lead in ingresso.',
          },
        ],
      },
    ],
  },
  {
    id: 'enso',
    name: 'ENSO',
    subtitle: 'The Circle of Continuous Learning',
    color: '#8B5CF6',
    iconName: 'cog',
    funzioni: [
      {
        id: 'enso-learning',
        name: 'Knowledge e Formazione',
        modules: [
          {
            id: 'M014',
            name: 'ANALISI COERENZA DOCUMENTALE',
            type: 'files',
            purchased: true,
            active: true,
            description: 'Rileva incoerenze e discordanze nella documentazione aziendale.',
          },
          {
            id: 'M031',
            name: 'Assistente interno di conoscenza',
            type: 'chat',
            purchased: true,
            active: false,
            description: 'Chat aziendale che interroga documenti e know-how interno.',
          },
        ],
      },
    ],
  },
  {
    id: 'luma',
    name: 'LUMA',
    subtitle: 'Multimodal Lead Generator',
    color: '#F59E0B',
    iconName: 'sun',
    funzioni: [
      {
        id: 'luma-marketing',
        name: 'Marketing',
        modules: [
          {
            id: 'M071',
            name: 'Creazione contenuti assistita',
            type: 'chat',
            purchased: true,
            active: true,
            description: 'Supporto AI alla produzione di contenuti marketing.',
          },
        ],
      },
    ],
  },
  {
    id: 'sonny',
    name: 'SONNY',
    subtitle: 'Vertical Knowledge AI',
    color: '#2563EB',
    iconName: 'wrench',
    funzioni: [
      {
        id: 'sonny-supporto',
        name: 'Supporto operativo specialistico',
        modules: [
          {
            id: 'M002',
            name: 'ASSISTENTE INFORMATIVO SPECIALISTICO',
            type: 'chat',
            purchased: true,
            active: true,
            description: 'Assistente conversazionale basato su RAG verticalizzato.',
          },
        ],
      },
    ],
  },
  {
    id: 'kora',
    name: 'KORA',
    subtitle: 'Post-Sales Knowledge Assistant',
    color: '#06B6D4',
    iconName: 'heart',
    funzioni: [
      {
        id: 'kora-post-sales',
        name: 'Post-vendita',
        modules: [
          {
            id: 'M061',
            name: 'Analisi conversazioni clienti',
            type: 'dashboard',
            purchased: true,
            active: true,
            description: 'Analisi qualitativa delle comunicazioni con i clienti.',
          },
        ],
      },
    ],
  },
];

export const quickRepliesMap: Record<string, string[]> = {
  M093: ['Routing semantico: stato', 'Mostra domini disponibili', 'Regole di instradamento correnti'],
  M002: ['Mostra fonti consultate', 'Rispondi su normativa tecnica', 'Apri riepilogo riferimenti'],
  M001: ['Report reputazionale trimestrale', 'Punti di forza/debolezza', 'Confronto percezione mese su mese'],
  M041: ['Genera preventivo base', 'Template preventivo enterprise', 'Ricalcola margine'],
  M062: ['Scoring lead', 'Lead ad alta priorita', 'Prossime azioni consigliate'],
  default: ['Come posso aiutarti?', 'Mostra esempi reali', 'Panoramica funzionalità'],
};

export const botResponsesMap: Record<string, string[]> = {
  M093: [
    'Instradamento completato: richiesta classificata su dominio corretto e inoltrata al motore specialistico con confidenza alta.',
    'Posso attivare disambiguazione su richieste multi-dominio e applicare fallback verso RAG generalista controllato.',
  ],
  M002: [
    'Ho costruito una risposta grounding-based sulle fonti specialistiche disponibili, con priorita ai riferimenti normativi aggiornati.',
    'Per aumentare accuratezza posso restringere il retrieval a uno specifico ambito tecnico o normativa.',
  ],
  M001: [
    'Sintesi percezione aziendale pronta: evidenziati punti di forza, criticita e coerenza narrativa sui canali pubblici.',
    'Posso confrontare l\'ultimo report con il trimestre precedente per mostrare trend reputazionali e segnali emergenti.',
  ],
  M041: [
    'Preventivo generato: struttura commerciale pronta con voci, condizioni e range economico configurabile.',
    'Posso esportare una versione breve per primo contatto o una versione completa con allegati tecnici.',
  ],
  M062: [
    'Lead qualificato automaticamente: score assegnato in base a fit, interesse e urgenza commerciale.',
    'Se vuoi, ordino la coda lead per priorita e suggerisco le prossime azioni operative.',
  ],
  default: [
    'Ho elaborato la tua richiesta. Ecco cosa posso suggerirti basandomi sui dati disponibili. Vuoi approfondire qualche aspetto?',
  ],
};
