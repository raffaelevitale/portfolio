export type ModuleType = 'chat' | 'settings' | 'files' | 'dashboard';

export type Module = {
  id: string;
  name: string;
  type: ModuleType;
  purchased: boolean;
  active: boolean;
  description?: string;
  knowledge?: {
    brief?: string;
    costEur?: number;
    benefits?: string[];
    trigger?: string;
    input?: string;
    automatedAction?: string;
    output?: string;
    errorHandling?: string;
    include?: string;
  };
  lockedInfo?: { title: string; subtitle: string; description: string };
};

export type Funzione = {
  id: string;
  name: string;
  modules: Module[];
};

export type Ambito = {
  id: string;
  systemCode?: string;
  name: string;
  subtitle: string;
  declaredModuleCount?: number;
  color: string;
  iconName: string;
  funzioni: Funzione[];
};

export const ambiti: Ambito[] = [
  {
    id: 'aegis',
    systemCode: 'SIS1',
    name: 'Amministrazione',
    subtitle: 'Sistema AEGIS - Data Governance & Secure AI Layer',
    declaredModuleCount: 8,
    color: '#E8920C',
    iconName: 'shield',
    funzioni: [
      {
        id: 'aegis-produzione',
        name: 'Produzione',
        modules: [
          {
            id: 'M093',
            name: 'Motore di instradamento semantico',
            type: 'chat',
            purchased: true,
            active: true,
            description: 'Orchestratore semantico che classifica la richiesta e la instrada verso il motore AI piu competente.',
            knowledge: {
              brief: 'Orchestrazione intelligente delle richieste verso i sistemi AI piu competenti.',
              costEur: 12,
              benefits: [
                'Riduzione errori AI',
                'Maggiore accuratezza delle risposte',
                'Riduzione costi di inference',
                'Scalabilita multi-AI',
                'Governance intelligente delle richieste',
                'Migliore user experience interna',
              ],
              trigger: 'Richiesta utente / Evento sistema / Query API',
              input: 'Query utente, documento, prompt interno o evento workflow',
              automatedAction: 'Analisi semantica -> classificazione -> routing -> attivazione motore competente',
              output: 'Conferma routing verso il RAG verticalizzato piu pertinente',
              errorHandling: 'In caso di routing non corretto: feedback@crybu.io. Il modulo resta operativo.',
              include: 'Training iniziale knowledge specialistica, setup orchestrazione e miglioramento progressivo del routing.',
            },
          },
        ],
      },
      {
        id: 'aegis-utility',
        name: 'Utility',
        modules: [
          {
            id: 'M010',
            name: 'Normalizza dati',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Acquisisce input eterogenei e li converte in dati strutturati pronti per elaborazioni AI.',
            knowledge: {
              brief: 'Standardizza formati e struttura dei dati per alimentare moduli AI, workflow e integrazioni.',
              costEur: 5,
              benefits: [
                'Riduce errori e duplicati',
                'Migliora qualita e governance dei dati',
                'Abilita integrazione tra sistemi',
                'Riduce interventi manuali e costi operativi',
              ],
              trigger: 'Ricezione di dati non strutturati o non conformi da input, documenti o sistemi',
              input: 'Dati testuali o strutturati da utente e sistemi aziendali',
              automatedAction: 'Input grezzo -> analisi -> estrazione -> normalizzazione -> validazione -> output',
              output: 'Dati coerenti e strutturati secondo schema predefinito',
              errorHandling: 'In caso di errore usare feedback modulo o feedback@crybu.io con dettaglio tecnico.',
              include: 'Setup guidato, integrazione strumenti esistenti, report utilizzo e supporto implementazione.',
            },
          },
          {
            id: 'M011',
            name: 'Smistamento email automatico',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Classifica semanticamente le email e le instrada al reparto o alla coda operativa corretta.',
            knowledge: {
              brief: 'Analizza contenuto email, identifica intento e instrada automaticamente la richiesta.',
              benefits: [
                'Riduce il tempo di gestione email',
                'Elimina email perse o non gestite',
                'Accelera la presa in carico delle richieste',
                'Riduce il carico operativo del team',
              ],
              trigger: 'Ricezione email ad indirizzi predefiniti',
              input: 'Oggetto, corpo, mittente, metadata messaggio, allegati, thread e priorita implicita',
              automatedAction: 'Analisi -> normalizzazione -> classificazione -> decision gate -> instradamento -> logging',
              output: 'Instradamento corretto verso reparto o workflow',
              include: 'Classificatore NLP/LLM, confidence score, fallback revisione manuale e regole routing configurabili.',
            },
          },
          {
            id: 'M012',
            name: "Ordinamento priorita automatica",
            type: 'dashboard',
            purchased: true,
            active: false,
            description: 'Genera uno score di priorita e riordina automaticamente richieste, task e code operative.',
            knowledge: {
              brief: 'Riordina le attivita in base a urgenza, impatto, valore strategico e criteri SLA configurati.',
              benefits: [
                'Focalizza il team sulle attivita piu importanti',
                'Riduce ritardi operativi',
                'Migliora produttivita e controllo delle code',
                'Riduce discrezionalita nella prioritizzazione',
              ],
              input: 'Dati da CRM, ticketing, ERP, documentali e metadati operativi',
              automatedAction: 'Analisi semantica -> estrazione segnali -> scoring multi-criterio -> ranking dinamico',
              output: 'Lista ordinata per priorita con livelli configurabili',
              include: 'Motore regole configurabile, integrazione SLA/task management, logging e audit trail.',
            },
          },
          {
            id: 'M013',
            name: 'Email action',
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
            name: 'Web content control',
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
    systemCode: 'SIS2',
    name: 'Direzione',
    subtitle: 'Sistema ORION - Predictive Strategy Engine',
    declaredModuleCount: 11,
    color: '#5B4E8A',
    iconName: 'compass',
    funzioni: [
      {
        id: 'orion-direzione',
        name: 'Direzione',
        modules: [
          {
            id: 'M001',
            name: 'AI Reputation Scan',
            type: 'dashboard',
            purchased: true,
            active: true,
            description: 'Report reputazionale trimestrale su web, media, social e percezione generata dai principali sistemi AI.',
            knowledge: {
              brief: 'Fotografia reputazionale dell azienda per migliorare posizionamento, comunicazione e fiducia.',
              costEur: 39,
              benefits: [
                'Analisi reputazionale su web, media, social e AI',
                'Identificazione punti di forza e debolezze',
                'Monitoraggio evoluzione nel tempo',
                'Supporto alle decisioni strategiche',
              ],
              trigger: 'Avvio schedulato o manuale',
              input: 'Partita IVA',
              automatedAction: 'Raccolta fonti pubbliche -> normalizzazione -> validazione -> sintesi strutturata',
              output: 'Documento reputazionale con criticita, coerenza narrativa e trend emergenti',
              errorHandling: 'Il report segnala dati mancanti/ambigui e il livello di affidabilita delle fonti.',
              include: 'Consulenza trimestrale per lettura guidata del report.',
            },
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
            name: 'Trend & topic di settore',
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
    systemCode: 'SIS6',
    name: 'Vendite',
    subtitle: 'Sistema GOJI - Conversational Sales Agent',
    declaredModuleCount: 7,
    color: '#3A6B8A',
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
    systemCode: 'SIS5',
    name: 'Organizzazione',
    subtitle: 'Sistema ENSO - The Circle of Continuous Learning',
    declaredModuleCount: 9,
    color: '#D94F6B',
    iconName: 'cog',
    funzioni: [
      {
        id: 'enso-learning',
        name: 'Knowledge e Formazione',
        modules: [
          {
            id: 'M014',
            name: 'Analisi coerenza documentale',
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
    systemCode: 'SIS3',
    name: 'Marketing',
    subtitle: 'Sistema LUMA - Multimodal Lead Generator',
    declaredModuleCount: 8,
    color: '#9B6B7A',
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
    id: 'sophia',
    systemCode: 'SIS7',
    name: 'Produzione',
    subtitle: 'Sistema SOPHIA - Vertical Knowledge AI',
    declaredModuleCount: 9,
    color: '#2B77AE',
    iconName: 'wrench',
    funzioni: [
      {
        id: 'sophia-supporto',
        name: 'Supporto operativo specialistico',
        modules: [
          {
            id: 'M002',
            name: 'Assistente informativo specialistico',
            type: 'chat',
            purchased: true,
            active: true,
            description: 'Assistente conversazionale basato su RAG verticalizzati per ambito tecnico e normativo.',
            knowledge: {
              brief: 'Assistente esperto sempre attivo su materie specialistiche, orchestrato con motore semantico.',
              costEur: 10,
              benefits: [
                'Risposte precise e contestualizzate',
                'Riduzione allucinazioni rispetto ad AI generiche',
                'Accesso rapido a normative e standard',
                'Supporto operativo 24/7',
              ],
              trigger: 'Domanda utente su materia tecnica o normativa specialistica',
              input: 'Query in linguaggio naturale, documenti, riferimenti tecnici o normativi',
              automatedAction: 'Selezione RAG per ambito -> retrieval semantico -> risposta grounding-based',
              output: 'Risposta contestualizzata con riferimenti a fonti pertinenti',
              errorHandling: 'Se risposta non coerente con archivio, segnalazione a feedback@crybu.io.',
              include: 'Addestramento specialistico iniziale, normalizzazione corpus e configurazione assistente conversazionale.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'talos',
    systemCode: 'SIS8',
    name: 'Organizzazione',
    subtitle: 'Sistema TALOS - Operational Execution & Process Compliance Engine',
    declaredModuleCount: 10,
    color: '#1FA89A',
    iconName: 'shield',
    funzioni: [
      {
        id: 'talos-operativita',
        name: 'Execution & Compliance',
        modules: [
          {
            id: 'M201',
            name: 'Controllo esecuzione processi',
            type: 'dashboard',
            purchased: true,
            active: false,
            description: 'Monitora in continuo l esecuzione dei processi e segnala deviazioni operative.',
          },
          {
            id: 'M202',
            name: 'Richiamo automatico procedure',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Attiva richiami automatici a persone e task quando mancano step critici.',
          },
          {
            id: 'M203',
            name: 'Conformita operativa',
            type: 'files',
            purchased: true,
            active: false,
            description: 'Verifica coerenza tra processi previsti, evidenze e output eseguiti.',
          },
        ],
      },
    ],
  },
  {
    id: 'sentra',
    systemCode: 'SIS9',
    name: 'Trasversale',
    subtitle: 'Sistema SENTRA - Cybersecurity & Access Governance',
    declaredModuleCount: 3,
    color: '#5C79EA',
    iconName: 'compass',
    funzioni: [
      {
        id: 'sentra-cyber',
        name: 'Cybersecurity & Access Governance',
        modules: [
          {
            id: 'M301',
            name: 'Governance accessi intelligenti',
            type: 'settings',
            purchased: true,
            active: false,
            description: 'Gestisce accessi e permessi con policy dinamiche basate su ruoli e rischio.',
          },
          {
            id: 'M302',
            name: 'Monitoraggio sicurezza continuo',
            type: 'dashboard',
            purchased: true,
            active: false,
            description: 'Rileva anomalie di sicurezza e comportamenti sospetti in tempo reale.',
          },
          {
            id: 'M303',
            name: 'Audit trail compliance',
            type: 'files',
            purchased: true,
            active: false,
            description: 'Consolida evidenze e tracciabilita operativa per audit e conformita.',
          },
        ],
      },
    ],
  },
  {
    id: 'kora',
    systemCode: 'SIS4',
    name: 'Assistenza',
    subtitle: 'Sistema KORA - Post-Sales Knowledge Assistant',
    declaredModuleCount: 9,
    color: '#9B8A2E',
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
  M010: ['Schema dati canonico', 'Mostra campi non normalizzati', 'Avvia normalizzazione batch'],
  M011: ['Smista email adesso', 'Mostra code per reparto', 'Apri log instradamenti'],
  M012: ['Ordina per urgenza', 'Mostra score priorita', 'Attiva regole SLA'],
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
  M010: [
    'Normalizzazione completata: i dati sono ora coerenti con lo schema canonico e pronti per i workflow AI.',
    'Posso evidenziare i record anomali e applicare una validazione incrementale prima della pubblicazione.',
  ],
  M011: [
    'Smistamento email eseguito: ogni richiesta e stata classificata e assegnata alla coda operativa corretta.',
    'Posso attivare un fallback umano solo per i messaggi con confidenza bassa o ambiguita semantica.',
  ],
  M012: [
    'Prioritizzazione aggiornata: le richieste sono ordinate per impatto, urgenza e vincoli SLA.',
    'Se vuoi, applico una vista per reparto con soglie differenti e regole di escalation automatica.',
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
