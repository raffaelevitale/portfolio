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
    color: '#5823AE',
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
    color: '#B422B4',
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
    color: '#0F73D6',
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
    color: '#D01A66',
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
    color: '#E93465',
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
    color: '#15C199',
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
    color: '#1A29B7',
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
    color: '#0BB8DB',
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
    color: '#33CA25',
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
  M071: ['Post LinkedIn lancio prodotto', 'Newsletter aprile', 'Bozza ad copy Facebook'],
  M061: ['Top 3 feedback della settimana', 'Riassunto sentiment ultime 48h', 'Categorie dominanti'],
  M014: ['Verifica contratto ultimo caricato', 'Trova clausole mancanti', 'Confronto versioni documento'],
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
  M071: [
    'Bozza pronta: ho generato il pezzo rispettando tono di voce, target e limiti di lunghezza del canale.',
    'Posso proporre 3 varianti A/B con differenti hook e call-to-action, pronte per la validazione editoriale.',
  ],
  M061: [
    'Ho sintetizzato le conversazioni degli ultimi 7 giorni evidenziando temi ricorrenti, sentiment e richieste non soddisfatte.',
    'Trend positivo su qualita servizio (+12%), attenzione su tempi di risposta (segnalati 9 volte questa settimana).',
  ],
  M014: [
    'Analisi completata: ho confrontato il documento con il template di riferimento e segnalato le clausole mancanti o anomale.',
    'Posso produrre un report PDF con le differenze evidenziate e una proposta di riscrittura delle sezioni critiche.',
  ],
  default: [
    'Ho elaborato la tua richiesta. Ecco cosa posso suggerirti basandomi sui dati disponibili. Vuoi approfondire qualche aspetto?',
  ],
};

export type ChatSeedMessage = { sender: 'bot' | 'user'; content: string; time: string };

export const chatSeedConversations: Record<string, ChatSeedMessage[]> = {
  M093: [
    { sender: 'bot', content: 'Sono il **Motore di instradamento semantico**. Classifico ogni richiesta in ingresso e la inoltro al modulo AI piu competente.', time: '09:02' },
    { sender: 'user', content: 'Mostrami lo stato del routing oggi', time: '09:03' },
    { sender: 'bot', content: '**247 richieste** smistate oggi. Distribuzione: 38% Assistenza, 26% Vendite, 19% Marketing, 17% Direzione. Confidenza media **94.2%** — nessun fallback verso operatore.', time: '09:03' },
    { sender: 'user', content: 'Quali domini sono attualmente disponibili?', time: '09:05' },
    { sender: 'bot', content: 'Sto orchestrando: Assistenza, Vendite, Marketing, Organizzazione, Produzione, Direzione. Posso attivare nuovi domini o regole custom a caldo senza riavvio.', time: '09:05' },
  ],
  M041: [
    { sender: 'bot', content: 'Sono il **Generatore automatico di preventivi**. Basta un brief sintetico e produco una proposta commerciale coerente con i tuoi listini.', time: '10:14' },
    { sender: 'user', content: 'Preventivo per un cliente enterprise, 250 postazioni, supporto 24/7, onboarding incluso.', time: '10:14' },
    { sender: 'bot', content: '**Preventivo BU-2026-417 generato.**\n\n- Licenze enterprise × 250: € 37.500 / anno\n- Supporto 24/7 premium: € 8.400\n- Onboarding + training: € 2.900\n\n**Totale: € 48.800 / anno** — margine stimato **34%**. Posso esportare in PDF brandizzato o inviarlo al CRM.', time: '10:14' },
  ],
  M062: [
    { sender: 'bot', content: 'Sono il **Qualificatore automatico dei lead**. Analizzo ogni contatto in ingresso e gli assegno uno score da 0 a 100.', time: '08:47' },
    { sender: 'user', content: 'Lead top della settimana', time: '08:48' },
    { sender: 'bot', content: 'Oggi **34 lead qualificati**. Top 3:\n\n1. **Studio Marelli SRL** — score **92** (PMI, budget confermato, timing Q2)\n2. **Ferrari Components** — score **88** (sector fit, multi-stakeholder engaged)\n3. **Bianchi Retail** — score **84** (warm referral, decision maker diretto)\n\nVuoi che ordini la coda per scadenza o per fit commerciale?', time: '08:48' },
  ],
  M002: [
    { sender: 'bot', content: 'Sono l\' **Assistente informativo specialistico**. Rispondo basandomi solo su fonti aziendali verificate, con riferimenti tracciabili.', time: '11:22' },
    { sender: 'user', content: 'Qual e la nostra policy di reso per ordini B2B oltre 10.000€?', time: '11:22' },
    { sender: 'bot', content: 'Secondo la policy interna **POL-RESI-2026 v3.2** (sez. 4.2):\n\n- Reso consentito entro **30 giorni** dalla consegna\n- Obbligo di RMA formale per ordini > € 10.000\n- Penale logistica del **3%** sul valore reso\n- Riaccredito entro **14 gg lavorativi**\n\n**Fonti consultate:** POL-RESI-2026.pdf · Manuale_Commerciale_Q1.pdf', time: '11:23' },
  ],
  M071: [
    { sender: 'bot', content: 'Sono il **Creatore di contenuti assistito**. Scrivo post, newsletter e ad copy coerenti con il tono di voce del brand.', time: '14:08' },
    { sender: 'user', content: 'Post LinkedIn per lancio del nuovo modulo Crybu Agents', time: '14:08' },
    { sender: 'bot', content: '**Bozza LinkedIn — Lancio Crybu Agents**\n\n> Abbiamo chiesto ai nostri clienti: cosa ti manca per automatizzare davvero i processi?\n>\n> La risposta era chiara: non chatbot, ma **agenti AI** che eseguono.\n>\n> Oggi presentiamo **Crybu Agents** — moduli AI che agiscono sui tuoi sistemi, non solo rispondono.\n>\n> Scopri la demo: crybu.io/agents\n\n**Tono:** diretto, professionale. **CTA:** chiara. **Lunghezza ottimale:** 540 caratteri. Posso generarne 2 varianti alternative.', time: '14:09' },
  ],
};

export type DashboardMetric = {
  label: string;
  value: string;
  change: string;
  up: boolean;
  iconName: 'trending-up' | 'trending-down' | 'bar-chart' | 'clock' | 'users' | 'check' | 'activity' | 'sparkles' | 'target' | 'zap';
};

export type DashboardPreset = {
  summaryTitle: string;
  summaryBlurb: string;
  metrics: DashboardMetric[];
  chartTitle: string;
  chartData: number[];
  chartLabels?: string[];
  accentColor: string;
  activityFeed: { action: string; detail: string; time: string }[];
};

export const dashboardPresetsMap: Record<string, DashboardPreset> = {
  M001: {
    summaryTitle: 'Reputazione aziendale sotto controllo',
    summaryBlurb: 'Monitoraggio continuo di 12 fonti tra social, press e review. Sentiment medio positivo, nessun picco critico rilevato nelle ultime 48h.',
    metrics: [
      { label: 'Sentiment medio', value: '+68', change: '+6 pt', up: true, iconName: 'trending-up' },
      { label: 'Menzioni 7gg', value: '312', change: '+18%', up: true, iconName: 'activity' },
      { label: 'Review positive', value: '89%', change: '+3%', up: true, iconName: 'check' },
      { label: 'Alert critici', value: '0', change: '-2', up: true, iconName: 'target' },
    ],
    chartTitle: 'Sentiment ultimi 12 mesi',
    chartData: [52, 58, 55, 61, 64, 60, 67, 65, 71, 68, 74, 72],
    accentColor: '#8B5CF6',
    activityFeed: [
      { action: 'Menzione rilevante', detail: 'Articolo positivo su IlSole24Ore — sentiment alto', time: 'adesso' },
      { action: 'Review chiusa', detail: 'Recensione Trustpilot 5★ pubblicata con risposta AI', time: '14 min fa' },
      { action: 'Trend settimanale', detail: 'Hashtag #CrybuAI cresciuto del 22% su LinkedIn', time: '2 ore fa' },
    ],
  },
  M061: {
    summaryTitle: 'Cosa dicono davvero i tuoi clienti',
    summaryBlurb: 'Analisi automatica di 1.284 conversazioni della settimana: temi ricorrenti, soddisfazione, richieste non coperte. Pronto da condividere con marketing e direzione.',
    metrics: [
      { label: 'Conversazioni analizzate', value: '1.284', change: '+9%', up: true, iconName: 'activity' },
      { label: 'CSAT estratto', value: '4.6/5', change: '+0.2', up: true, iconName: 'trending-up' },
      { label: 'Temi emergenti', value: '7', change: '+2', up: true, iconName: 'sparkles' },
      { label: 'Richieste non coperte', value: '19', change: '-4', up: true, iconName: 'target' },
    ],
    chartTitle: 'Volume conversazioni ultime 12 settimane',
    chartData: [820, 910, 870, 950, 1020, 1080, 1140, 1190, 1210, 1235, 1260, 1284],
    accentColor: '#EC4899',
    activityFeed: [
      { action: 'Insight estratto', detail: '32 conversazioni menzionano tempi di consegna — cluster emergente', time: 'adesso' },
      { action: 'Tema ricorrente', detail: '"Integrazione fatturazione" citata 18 volte questa settimana', time: '22 min fa' },
      { action: 'Sentiment positivo', detail: 'Picco +12% sul tema "assistenza via chat"', time: '3 ore fa' },
    ],
  },
  M041: {
    summaryTitle: 'Pipeline preventivi in autonomia',
    summaryBlurb: 'Il modulo produce proposte commerciali coerenti con i listini e le policy di margine. Taglia il tempo di preparazione da ore a minuti.',
    metrics: [
      { label: 'Preventivi generati oggi', value: '9', change: '+3', up: true, iconName: 'check' },
      { label: 'Valore totale', value: '€ 287K', change: '+22%', up: true, iconName: 'bar-chart' },
      { label: 'Tempo medio stesura', value: '2.4 min', change: '-18 min', up: true, iconName: 'clock' },
      { label: 'Margine medio', value: '34%', change: '+1.8%', up: true, iconName: 'trending-up' },
    ],
    chartTitle: 'Preventivi per mese',
    chartData: [42, 48, 55, 51, 67, 72, 78, 85, 91, 88, 96, 104],
    accentColor: '#F59E0B',
    activityFeed: [
      { action: 'Preventivo inviato', detail: 'BU-2026-417 — Studio Marelli · € 48.800', time: 'adesso' },
      { action: 'Margine ricalcolato', detail: 'Listino Q2 applicato a 12 offerte in bozza', time: '18 min fa' },
      { action: 'Proposta accettata', detail: 'BU-2026-401 firmata dal cliente — € 22.500', time: '1 ora fa' },
    ],
  },
  M062: {
    summaryTitle: 'Lead qualificati in tempo reale',
    summaryBlurb: 'Ogni lead in ingresso riceve automaticamente uno score commerciale da 0 a 100, con prossima azione consigliata per il sales.',
    metrics: [
      { label: 'Lead qualificati oggi', value: '34', change: '+12', up: true, iconName: 'users' },
      { label: 'Score medio', value: '72', change: '+4 pt', up: true, iconName: 'target' },
      { label: 'Conversione prevista', value: '28%', change: '+5%', up: true, iconName: 'trending-up' },
      { label: 'Tempo risposta medio', value: '1.8 min', change: '-42 min', up: true, iconName: 'clock' },
    ],
    chartTitle: 'Lead qualificati ultimi 12 giorni',
    chartData: [18, 22, 25, 21, 28, 32, 29, 34, 31, 36, 38, 34],
    accentColor: '#3B82F6',
    activityFeed: [
      { action: 'Lead top', detail: 'Studio Marelli SRL qualificato con score 92', time: 'adesso' },
      { action: 'Escalation', detail: 'Ferrari Components assegnato a sales senior', time: '25 min fa' },
      { action: 'Coda riordinata', detail: '12 lead ripriorizzati in base a urgenza commerciale', time: '1 ora fa' },
    ],
  },
};

export type FilesPreset = {
  summaryTitle: string;
  summaryBlurb: string;
  files: { name: string; size: string; status: 'trained' | 'processing' | 'pending'; date: string }[];
};

export const filesPresetsMap: Record<string, FilesPreset> = {
  M014: {
    summaryTitle: 'Documenti analizzati in autonomia',
    summaryBlurb: 'Ogni contratto, policy o allegato viene confrontato con i template di riferimento. Il modulo evidenzia clausole mancanti e anomalie.',
    files: [
      { name: 'Contratto_FornituraB2B_MarelliSRL_v4.pdf', size: '1.8 MB', status: 'trained', date: '20 Apr 2026' },
      { name: 'NDA_Progetto_Atlas_firmato.pdf', size: '640 KB', status: 'trained', date: '18 Apr 2026' },
      { name: 'Policy_Resi_2026_v3.docx', size: '212 KB', status: 'trained', date: '15 Apr 2026' },
      { name: 'Accordo_Distribuzione_FerrariComponents.pdf', size: '2.3 MB', status: 'processing', date: '22 Apr 2026' },
      { name: 'Clausole_Privacy_GDPR_aggiornate.docx', size: '148 KB', status: 'pending', date: '22 Apr 2026' },
    ],
  },
};
