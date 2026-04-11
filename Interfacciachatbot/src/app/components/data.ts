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
    id: 'direzione', name: 'Direzione', subtitle: 'Strategia e decisioni', color: '#1B3A6B', iconName: 'compass',
    funzioni: [
      {
        id: 'dir-strategia', name: 'Strategia',
        modules: [
          { id: 'dir-analisi-strategica', name: 'Analisi Strategica', type: 'chat', purchased: true, active: true, description: 'Analisi strategica con AI per decisioni data-driven' },
          { id: 'dir-forecast', name: 'Forecast Aziendale', type: 'dashboard', purchased: true, active: false, description: 'Previsioni e scenari futuri' },
        ],
      },
      {
        id: 'dir-intelligence', name: 'Intelligence',
        modules: [
          { id: 'dir-analisi-competitor', name: 'Analisi Competitor', type: 'dashboard', purchased: false, active: false, lockedInfo: { title: 'Analisi Competitor', subtitle: 'Intelligence competitiva', description: 'Monitora i competitor in tempo reale con analisi automatiche di mercato, prezzi e posizionamento.' } },
        ],
      },
    ],
  },
  {
    id: 'organizzazione', name: 'Organizzazione', subtitle: 'Processi e formazione', color: '#8B5CF6', iconName: 'cog',
    funzioni: [
      {
        id: 'org-hr', name: 'Risorse Umane',
        modules: [
          { id: 'org-onboarding', name: 'Onboarding Dipendenti', type: 'settings', purchased: true, active: true, description: 'Automazione processo di onboarding' },
          { id: 'org-formazione', name: 'Formazione Continua', type: 'files', purchased: true, active: true, description: 'Knowledge base e materiali formativi' },
        ],
      },
      {
        id: 'org-processi', name: 'Processi',
        modules: [
          { id: 'org-workflow', name: 'Automazione Processi', type: 'settings', purchased: false, active: false, lockedInfo: { title: 'ENSO', subtitle: 'Circle of Continuous Learning', description: 'Il sistema ENSO (Formazione continua e allineamento) non è incluso nel tuo piano attuale. Contattaci per scoprire come attivarlo.' } },
        ],
      },
    ],
  },
  {
    id: 'amministrazione', name: 'Amministrazione', subtitle: 'Compliance e governance', color: '#6B7280', iconName: 'shield',
    funzioni: [
      {
        id: 'amm-contabilita', name: 'Contabilità',
        modules: [
          { id: 'amm-fatturazione', name: 'Fatturazione', type: 'settings', purchased: true, active: true, description: 'Gestione automatica fatturazione' },
          { id: 'amm-smistamento-email', name: 'Smistamento Email', type: 'settings', purchased: true, active: false, description: 'Smistamento automatico email in arrivo' },
        ],
      },
      {
        id: 'amm-compliance', name: 'Compliance',
        modules: [
          { id: 'amm-gdpr', name: 'Compliance GDPR', type: 'files', purchased: false, active: false, lockedInfo: { title: 'Compliance GDPR', subtitle: 'Protezione dati automatica', description: 'Gestisci la conformità GDPR con audit automatici, registro trattamenti e gestione consensi.' } },
        ],
      },
    ],
  },
  {
    id: 'produzione', name: 'Produzione', subtitle: 'Workflow e qualità', color: '#D97706', iconName: 'wrench',
    funzioni: [
      {
        id: 'prod-qualita', name: 'Qualità',
        modules: [
          { id: 'prod-controllo', name: 'Controllo Qualità', type: 'dashboard', purchased: true, active: true, description: 'Monitoraggio metriche qualità in tempo reale' },
        ],
      },
      {
        id: 'prod-workflow', name: 'Workflow',
        modules: [
          { id: 'prod-gestione-workflow', name: 'Gestione Workflow', type: 'settings', purchased: true, active: false, description: 'Configura e ottimizza i flussi di lavoro' },
        ],
      },
    ],
  },
  {
    id: 'marketing', name: 'Marketing', subtitle: 'Lead e campagne', color: '#F59E0B', iconName: 'sun',
    funzioni: [
      {
        id: 'mkt-acquisizione', name: 'Acquisizione',
        modules: [
          { id: 'mkt-lead-gen', name: 'Lead Generation', type: 'chat', purchased: true, active: true, description: 'Genera e qualifica lead con chatbot intelligente' },
          { id: 'mkt-campagne-email', name: 'Campagne Email', type: 'settings', purchased: true, active: false, description: 'Automazione campagne email marketing' },
        ],
      },
      {
        id: 'mkt-analisi', name: 'Analisi',
        modules: [
          { id: 'mkt-analytics', name: 'Marketing Analytics', type: 'dashboard', purchased: false, active: false, lockedInfo: { title: 'Marketing Analytics', subtitle: 'Analisi performance campagne', description: 'Dashboard avanzata per monitorare ROI, conversioni e performance di tutti i canali marketing.' } },
        ],
      },
    ],
  },
  {
    id: 'vendita', name: 'Vendita', subtitle: 'Pipeline e conversione', color: '#10B981', iconName: 'target',
    funzioni: [
      {
        id: 'ven-assistenza', name: 'Assistenza Vendita',
        modules: [
          { id: 'ven-chatbot', name: 'Chatbot Assistenza Vendita', type: 'chat', purchased: true, active: true, description: 'Assistente AI per supporto processo di vendita' },
          { id: 'ven-qualifica', name: 'Qualifica Lead', type: 'chat', purchased: true, active: true, description: 'Qualificazione automatica dei lead in ingresso' },
        ],
      },
      {
        id: 'ven-pipeline', name: 'Pipeline',
        modules: [
          { id: 'ven-gestione-pipeline', name: 'Gestione Pipeline', type: 'dashboard', purchased: true, active: true, description: 'Visualizza e gestisci la pipeline commerciale' },
        ],
      },
    ],
  },
  {
    id: 'assistenza', name: 'Assistenza', subtitle: 'Supporto pre/post vendita', color: '#06B6D4', iconName: 'heart',
    funzioni: [
      {
        id: 'ass-supporto', name: 'Supporto',
        modules: [
          { id: 'ass-ticket', name: 'Gestione Ticket', type: 'settings', purchased: true, active: true, description: 'Smistamento e categorizzazione automatica ticket' },
          { id: 'ass-chatbot', name: 'Chatbot Supporto', type: 'chat', purchased: true, active: true, description: 'Chatbot per supporto pre e post vendita' },
        ],
      },
      {
        id: 'ass-knowledge', name: 'Knowledge',
        modules: [
          { id: 'ass-faq', name: 'FAQ e Knowledge Base', type: 'files', purchased: true, active: true, description: 'Gestione FAQ e documenti knowledge base' },
          { id: 'ass-report', name: 'Report Assistenza', type: 'dashboard', purchased: true, active: false, description: 'Dashboard metriche e analytics assistenza' },
        ],
      },
    ],
  },
];

export const quickRepliesMap: Record<string, string[]> = {
  'dir-analisi-strategica': ['Analisi SWOT', 'KPI direzione', 'Piano strategico Q2'],
  'mkt-lead-gen': ['Segmenta lead per priorità', 'Scrivi messaggio primo contatto', 'Definisci piano nurturing 7 giorni'],
  'ven-chatbot': ['Gestione obiezioni', 'Script vendita', 'Proposta commerciale'],
  'ven-qualifica': ['Criteri qualifica', 'Scoring lead', 'Template follow-up'],
  'ass-chatbot': ['Gestione ticket', 'FAQ aggiornate', 'Report assistenza'],
  default: ['Come posso aiutarti?', 'Mostra esempi reali', 'Panoramica funzionalità'],
};

export const botResponsesMap: Record<string, string[]> = {
  'ass-chatbot': [
    'Ecco come configurare la categorizzazione automatica:\n• **Definisci le categorie** — Crea 5-8 categorie basate sui ticket più frequenti.\n• **Imposta le regole** — Definisci parole chiave per lo smistamento automatico.\n• **Priorità intelligente** — Attiva il sistema che analizza urgenza e impatto.',
    'Il report assistenza mostra: **142 ticket** risolti questa settimana, tempo medio di risposta **2.3 ore**, satisfaction score **4.6/5**.',
  ],
  'dir-analisi-strategica': [
    'Ho analizzato i dati strategici. Ecco i punti chiave:\n• **Crescita revenue** — +12% vs previsioni Q1\n• **Market share** — Stabile al 23% nel segmento target\n• **Efficienza operativa** — Migliorata del 8% grazie alle automazioni',
  ],
  'mkt-lead-gen': [
    'Modalità Lead Generation attiva. Posso aiutarti a segmentare contatti e costruire messaggi per conversione.\n• **Lead scoring** — Analisi automatica del potenziale\n• **Nurturing** — Sequenze personalizzate per fase del funnel',
  ],
  'ven-chatbot': [
    'Posso aiutarti con il processo di vendita:\n• **Obiezioni comuni** — Script personalizzati per ogni obiezione\n• **Proposta commerciale** — Template ottimizzati per conversione\n• **Follow-up** — Sequenze automatiche post-meeting',
  ],
  default: [
    'Ho elaborato la tua richiesta. Ecco cosa posso suggerirti basandomi sui dati disponibili. Vuoi approfondire qualche aspetto?',
  ],
};
