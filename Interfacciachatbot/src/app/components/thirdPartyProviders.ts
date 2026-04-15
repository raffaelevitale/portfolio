export type ThirdPartySection = 'internal' | 'third-party';

export type ThirdPartyProviderId = 'chatgpt' | 'claude' | 'gemini' | 'grok';

export interface ThirdPartyProvider {
    id: ThirdPartyProviderId;
    name: string;
    vendor: string;
    tagline: string;
    authLabel: 'OAuth' | 'API Key';
    connected: boolean;
    subscriptionPlanName: string;
    subscriptionMonthlyUsd: number;
    includedInputTokens: number;
    includedOutputTokens: number;
    variableUsageCostUsd: number;
    inputTokens: number;
    outputTokens: number;
    avgLatencyMs: number;
    modelFamilies: string[];
    chatUrl: string;
    loginUrl: string;
    pressKitUrl: string;
    brandGuidelinesUrl?: string;
    brandGradient: [string, string];
    accentColor: string;
}

export const initialThirdPartyProviders: ThirdPartyProvider[] = [
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        vendor: 'OpenAI',
        tagline: 'General purpose assistant and API reasoning',
        authLabel: 'OAuth',
        connected: true,
        subscriptionPlanName: 'Team Workspace',
        subscriptionMonthlyUsd: 119.00,
        includedInputTokens: 8_000_000,
        includedOutputTokens: 3_000_000,
        variableUsageCostUsd: 363.37,
        inputTokens: 9_800_000,
        outputTokens: 4_240_000,
        avgLatencyMs: 1420,
        modelFamilies: ['GPT-5.3', 'o4-mini', 'Realtime'],
        chatUrl: 'https://chatgpt.com/',
        loginUrl: 'https://platform.openai.com/login',
        pressKitUrl: 'https://openai.com/brand/',
        brandGuidelinesUrl: 'https://openai.com/it-IT/brand/#usage-terms',
        brandGradient: ['#101010', '#2A2A2A'],
        accentColor: '#11A37F',
    },
    {
        id: 'claude',
        name: 'Claude',
        vendor: 'Anthropic',
        tagline: 'Long-context analysis and enterprise workflows',
        authLabel: 'API Key',
        connected: false,
        subscriptionPlanName: 'Pro Seat + API',
        subscriptionMonthlyUsd: 79.00,
        includedInputTokens: 4_500_000,
        includedOutputTokens: 2_000_000,
        variableUsageCostUsd: 239.04,
        inputTokens: 6_340_000,
        outputTokens: 2_180_000,
        avgLatencyMs: 1550,
        modelFamilies: ['Opus 4.6', 'Sonnet 4.6', 'Haiku'],
        chatUrl: 'https://claude.ai/new',
        loginUrl: 'https://console.anthropic.com/',
        pressKitUrl: 'https://www.anthropic.com/press-kit',
        brandGuidelinesUrl: 'https://www.anthropic.com/news',
        brandGradient: ['#151311', '#3A2E26'],
        accentColor: '#D97745',
    },
    {
        id: 'gemini',
        name: 'Gemini',
        vendor: 'Google',
        tagline: 'Multimodal stack for search, docs and code',
        authLabel: 'OAuth',
        connected: true,
        subscriptionPlanName: 'Business Standard',
        subscriptionMonthlyUsd: 99.00,
        includedInputTokens: 6_000_000,
        includedOutputTokens: 2_500_000,
        variableUsageCostUsd: 172.92,
        inputTokens: 7_120_000,
        outputTokens: 2_760_000,
        avgLatencyMs: 1310,
        modelFamilies: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'],
        chatUrl: 'https://gemini.google.com/app',
        loginUrl: 'https://aistudio.google.com/',
        pressKitUrl: 'https://blog.google/press/',
        brandGuidelinesUrl: 'https://about.google/brand-resource-center/',
        brandGradient: ['#1B2430', '#27354A'],
        accentColor: '#5C86FF',
    },
    {
        id: 'grok',
        name: 'Grok',
        vendor: 'xAI',
        tagline: 'Real-time web context and social signal analysis',
        authLabel: 'OAuth',
        connected: false,
        subscriptionPlanName: 'Grok Premium',
        subscriptionMonthlyUsd: 40.00,
        includedInputTokens: 1_900_000,
        includedOutputTokens: 600_000,
        variableUsageCostUsd: 86.11,
        inputTokens: 2_140_000,
        outputTokens: 760_000,
        avgLatencyMs: 1680,
        modelFamilies: ['Grok 4', 'Grok Vision'],
        chatUrl: 'https://grok.com/',
        loginUrl: 'https://grok.com/sign-in',
        pressKitUrl: 'https://about.x.com/en/who-we-are/brand-toolkit.html',
        brandGuidelinesUrl: 'https://about.x.com/content/dam/about-twitter/x/brand-toolkit/x-brand-guidelines.pdf',
        brandGradient: ['#0C0C0C', '#232323'],
        accentColor: '#FFFFFF',
    },
];