import { ArrowUpRight, BarChart3, CheckCircle2, ExternalLink, KeyRound, Link2, LogIn, LogOut, MessageCircle, Sigma, Wallet } from 'lucide-react';
import type { ThirdPartyProvider, ThirdPartyProviderId } from './thirdPartyProviders';
import { useTheme } from './ThemeContext';
import { EmbeddedChatGPTPanel } from './EmbeddedChatGPTPanel';

interface ThirdPartyHubViewProps {
    providers: ThirdPartyProvider[];
    selectedProviderId: ThirdPartyProviderId;
    onSelectProvider: (providerId: ThirdPartyProviderId) => void;
    onToggleConnection: (providerId: ThirdPartyProviderId) => void;
}

const currencyFormatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat('it-IT', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

const loginLabelByProvider: Record<ThirdPartyProviderId, string> = {
    chatgpt: 'Accedi con OpenAI',
    claude: 'Accedi con Anthropic',
    gemini: 'Accedi con Google',
    grok: 'Accedi con xAI',
};

const loginButtonClassByProvider: Record<ThirdPartyProviderId, string> = {
    chatgpt: 'bg-[#101010] text-white border-white/[0.2] hover:bg-[#1A1A1A]',
    claude: 'bg-[#F6E7D8] text-[#2D1E14] border-[#E3C4A7] hover:bg-[#F1DCC5]',
    gemini: 'bg-white text-[#1F1F1F] border-[#DADCE0] hover:bg-[#F7F9FC]',
    grok: 'bg-[#0B0B0B] text-white border-white/[0.2] hover:bg-[#161616]',
};

const launchButtonClassByProvider: Record<ThirdPartyProviderId, string> = {
    chatgpt: 'bg-[#11A37F] text-[#041C15] border-[#11A37F]/50 hover:bg-[#19BA91]',
    claude: 'bg-[#D97745] text-[#26170F] border-[#D97745]/55 hover:bg-[#E28657]',
    gemini: 'bg-[#5C86FF] text-white border-[#5C86FF]/55 hover:bg-[#749BFF]',
    grok: 'bg-[#EDEDED] text-[#121212] border-[#EDEDED]/80 hover:bg-white',
};

function openExternalUrl(url: string) {
    if (typeof window === 'undefined') return;
    window.open(url, '_blank', 'noopener,noreferrer');
}

function getProviderCostBreakdown(provider: ThirdPartyProvider) {
    const consumedInputTokens = provider.inputTokens;
    const consumedOutputTokens = provider.outputTokens;
    const consumedTokens = consumedInputTokens + consumedOutputTokens;

    const includedInputTokens = provider.includedInputTokens;
    const includedOutputTokens = provider.includedOutputTokens;
    const includedTokens = includedInputTokens + includedOutputTokens;

    const overageInputTokens = Math.max(consumedInputTokens - includedInputTokens, 0);
    const overageOutputTokens = Math.max(consumedOutputTokens - includedOutputTokens, 0);
    const overageTokens = overageInputTokens + overageOutputTokens;

    const subscriptionCostUsd = provider.subscriptionMonthlyUsd;
    const variableUsageCostUsd = provider.variableUsageCostUsd;
    const totalCostUsd = subscriptionCostUsd + variableUsageCostUsd;

    const effectiveCostPerMillionUsd = consumedTokens > 0
        ? totalCostUsd / (consumedTokens / 1_000_000)
        : 0;

    return {
        consumedTokens,
        includedTokens,
        overageTokens,
        subscriptionCostUsd,
        variableUsageCostUsd,
        totalCostUsd,
        effectiveCostPerMillionUsd,
    };
}

function ProviderBadge({ providerId }: { providerId: ThirdPartyProviderId }) {
    if (providerId === 'gemini') {
        return (
            <span className="relative w-4 h-4 shrink-0">
                <span className="absolute w-2 h-2 rounded-full top-0 left-1 bg-[#4285F4]" />
                <span className="absolute w-2 h-2 rounded-full top-1 left-2 bg-[#EA4335]" />
                <span className="absolute w-2 h-2 rounded-full bottom-0 right-1 bg-[#FBBC05]" />
                <span className="absolute w-2 h-2 rounded-full bottom-1 left-0 bg-[#34A853]" />
            </span>
        );
    }

    const styleByProvider: Record<Exclude<ThirdPartyProviderId, 'gemini'>, { className: string; label: string }> = {
        chatgpt: { className: 'bg-[#0E0E0E] text-white border-white/[0.2]', label: 'O' },
        claude: { className: 'bg-[#F6E7D8] text-[#2D1E14] border-[#D7B79A]', label: 'C' },
        grok: { className: 'bg-[#0D0D0D] text-white border-white/[0.2]', label: 'X' },
    };

    const config = styleByProvider[providerId as Exclude<ThirdPartyProviderId, 'gemini'>];
    return <span className={`inline-flex items-center justify-center w-4 h-4 rounded border text-[9px] font-bold ${config.className}`}>{config.label}</span>;
}

export function ThirdPartyHubView({ providers, selectedProviderId, onSelectProvider, onToggleConnection }: ThirdPartyHubViewProps) {
    const { t } = useTheme();

    const selectedProvider = providers.find(provider => provider.id === selectedProviderId) ?? providers[0];
    if (!selectedProvider) return null;

    const selectedProviderCost = getProviderCostBreakdown(selectedProvider);

    const connectedProviders = providers.filter(provider => provider.connected).length;
    const totalTokens = providers.reduce((acc, provider) => acc + provider.inputTokens + provider.outputTokens, 0);
    const totalIncludedTokens = providers.reduce((acc, provider) => acc + provider.includedInputTokens + provider.includedOutputTokens, 0);
    const totalOverageTokens = providers.reduce((acc, provider) => acc + getProviderCostBreakdown(provider).overageTokens, 0);
    const totalSubscriptionCost = providers.reduce((acc, provider) => acc + provider.subscriptionMonthlyUsd, 0);
    const totalVariableUsageCost = providers.reduce((acc, provider) => acc + provider.variableUsageCostUsd, 0);
    const totalCost = totalSubscriptionCost + totalVariableUsageCost;

    const cards = [
        {
            label: 'Provider connessi',
            value: `${connectedProviders}/${providers.length}`,
            detail: 'stato autenticazioni',
            icon: CheckCircle2,
            color: '#10B981',
        },
        {
            label: 'Canoni abbonamento',
            value: currencyFormatter.format(totalSubscriptionCost),
            detail: `${providers.length} piani sottoscritti`,
            icon: KeyRound,
            color: '#5C86FF',
        },
        {
            label: 'Extra consumo token',
            value: currencyFormatter.format(totalVariableUsageCost),
            detail: `${compactFormatter.format(totalOverageTokens)} token oltre piano`,
            icon: Sigma,
            color: '#F73C1C',
        },
        {
            label: 'Totale mese stimato',
            value: currencyFormatter.format(totalCost),
            detail: `${compactFormatter.format(totalTokens)} usati / ${compactFormatter.format(totalIncludedTokens)} inclusi`,
            icon: Wallet,
            color: '#F59E0B',
        },
    ] as const;

    const cardBg = t('bg-[#1A1A1A] border-white/[0.04]', 'bg-white border-black/[0.06]');
    const panelBg = t('bg-[#141414] border-white/[0.05]', 'bg-[#FAFAFA] border-black/[0.08]');
    const tableHead = t('bg-[#1F1F1F]', 'bg-[#F2F2F2]');
    const tableBorder = t('border-white/[0.05]', 'border-black/[0.06]');
    const textMain = t('text-white', 'text-[#111]');
    const textSub = t('text-[#888]', 'text-[#666]');
    const textMuted = t('text-[#666]', 'text-[#999]');
    const hoverBg = t('hover:bg-white/[0.02]', 'hover:bg-black/[0.02]');

    const maxCost = Math.max(...providers.map(provider => getProviderCostBreakdown(provider).totalCostUsd), 1);

    const launchProviderChat = (provider: ThirdPartyProvider) => {
        if (provider.id === 'chatgpt') {
            onSelectProvider('chatgpt');
            if (typeof window !== 'undefined') {
                window.requestAnimationFrame(() => {
                    const panel = document.getElementById('chatgpt-embedded-panel');
                    panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
            return;
        }

        openExternalUrl(provider.chatUrl);
    };

    return (
        <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-6 md:mb-8">
                    <div>
                        <h1 className={`text-[22px] md:text-[28px] font-bold ${textMain}`}>Hub Modelli Terze Parti</h1>
                        <p className={`text-[13px] md:text-[14px] mt-1 ${textSub}`}>
                            Connetti ChatGPT, Claude, Gemini e Grok con login dedicato e monitora costi/token in un'unica dashboard.
                        </p>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${t('border-[#5C86FF]/35 text-[#9DB7FF] bg-[#5C86FF]/10', 'border-[#5C86FF]/30 text-[#3857A6] bg-[#5C86FF]/10')} text-[11px] font-semibold`}>
                        <Link2 size={12} />
                        Fonti brand ufficiali collegate
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                    {cards.map(card => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className={`${cardBg} border rounded-xl p-4`}>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className={`text-[11px] uppercase tracking-[1px] ${textMuted}`}>{card.label}</p>
                                        <p className={`text-[19px] md:text-[22px] font-bold mt-1 ${textMain}`}>{card.value}</p>
                                        <p className={`text-[11px] mt-0.5 ${textSub}`}>{card.detail}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.color}20` }}>
                                        <Icon size={15} style={{ color: card.color }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={`${panelBg} border rounded-xl p-4 md:p-5 mb-4 md:mb-6`}>
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <h2 className={`text-[14px] md:text-[15px] font-semibold ${textMain}`}>Chat launcher multi-provider</h2>
                        <span className={`text-[10px] ${textMuted}`}>brand button + apertura chat reale</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
                        {providers.map(provider => (
                            <button
                                key={`launch-${provider.id}`}
                                onClick={() => launchProviderChat(provider)}
                                className={`inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-[12px] font-semibold transition-colors ${launchButtonClassByProvider[provider.id]}`}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <ProviderBadge providerId={provider.id} />
                                    {provider.id === 'chatgpt' ? `${provider.name} in-app` : provider.name}
                                </span>
                                {provider.id === 'chatgpt' ? <MessageCircle size={13} /> : <ArrowUpRight size={13} />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-4 md:gap-6 mb-4 md:mb-6">
                    <div className={`${panelBg} border rounded-xl p-4 md:p-5`}>
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <h2 className={`text-[14px] md:text-[15px] font-semibold ${textMain}`}>Provider e accessi</h2>
                            <span className={`text-[10px] ${textMuted}`}>login + press kit</span>
                        </div>

                        <div className="space-y-2.5">
                            {providers.map(provider => {
                                const isSelected = provider.id === selectedProvider.id;
                                const providerCost = getProviderCostBreakdown(provider);
                                const totalProviderTokens = providerCost.consumedTokens;

                                return (
                                    <div
                                        key={provider.id}
                                        className={`rounded-xl border p-3 transition-colors ${isSelected
                                            ? t('border-[#F73C1C]/35 bg-[#F73C1C]/[0.05]', 'border-[#F73C1C]/35 bg-[#F73C1C]/[0.05]')
                                            : t('border-white/[0.05] bg-[#111]', 'border-black/[0.08] bg-white')
                                            }`}
                                    >
                                        <button
                                            onClick={() => onSelectProvider(provider.id)}
                                            className="w-full text-left"
                                        >
                                            <div className="rounded-lg px-3 py-2 mb-2" style={{ background: `linear-gradient(135deg, ${provider.brandGradient[0]}, ${provider.brandGradient[1]})` }}>
                                                <div className="flex items-center justify-between gap-2">
                                                    <div>
                                                        <p className="text-[13px] font-semibold text-white">{provider.name}</p>
                                                        <p className="text-[11px] text-white/75">{provider.vendor}</p>
                                                    </div>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${provider.connected ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-white/15 text-white/85'}`}>
                                                        {provider.connected ? 'Connesso' : 'Non connesso'}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>

                                        <p className={`text-[12px] ${textSub}`}>{provider.tagline}</p>

                                        <div className="grid grid-cols-2 gap-2 mt-2.5">
                                            <div className={`rounded-lg px-2.5 py-2 ${t('bg-black/20', 'bg-black/[0.03]')}`}>
                                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Token usati</p>
                                                <p className={`text-[12px] font-semibold ${textMain}`}>{compactFormatter.format(totalProviderTokens)}</p>
                                                <p className={`text-[10px] ${textMuted}`}>inclusi {compactFormatter.format(providerCost.includedTokens)}</p>
                                            </div>
                                            <div className={`rounded-lg px-2.5 py-2 ${t('bg-black/20', 'bg-black/[0.03]')}`}>
                                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Totale mese</p>
                                                <p className={`text-[12px] font-semibold ${textMain}`}>{currencyFormatter.format(providerCost.totalCostUsd)}</p>
                                                <p className={`text-[10px] ${textMuted}`}>canone + extra</p>
                                            </div>
                                        </div>

                                        <p className={`text-[10px] mt-2 ${textMuted}`}>
                                            {provider.subscriptionPlanName} · canone {currencyFormatter.format(providerCost.subscriptionCostUsd)} + extra {currencyFormatter.format(providerCost.variableUsageCostUsd)}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                                            <button
                                                onClick={() => onToggleConnection(provider.id)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${provider.connected
                                                    ? t('bg-[#2B1A17] text-[#ff9b86] hover:bg-[#3A221D]', 'bg-[#FFE9E3] text-[#A3422F] hover:bg-[#FFD8CC]')
                                                    : t('bg-[#1A2C1A] text-[#7FE4AA] hover:bg-[#1F351F]', 'bg-[#E8FAEF] text-[#227A4A] hover:bg-[#D9F5E5]')
                                                    }`}
                                            >
                                                {provider.connected ? <LogOut size={12} /> : <LogIn size={12} />}
                                                {provider.connected ? 'Disconnetti' : 'Connetti'}
                                            </button>

                                            <button
                                                onClick={() => openExternalUrl(provider.loginUrl)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] font-semibold transition-colors ${loginButtonClassByProvider[provider.id]}`}
                                            >
                                                <ProviderBadge providerId={provider.id} />
                                                <KeyRound size={12} />
                                                {loginLabelByProvider[provider.id]}
                                            </button>

                                            <button
                                                onClick={() => launchProviderChat(provider)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] font-semibold transition-colors ${launchButtonClassByProvider[provider.id]}`}
                                            >
                                                <MessageCircle size={12} />
                                                {provider.id === 'chatgpt'
                                                    ? (provider.connected ? 'Apri chat in-app' : 'Connetti e apri in-app')
                                                    : (provider.connected ? `Apri chat ${provider.name}` : 'Accedi e apri chat')}
                                            </button>

                                            <a
                                                href={provider.pressKitUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${t('bg-white/[0.06] text-[#ddd] hover:bg-white/[0.1]', 'bg-black/[0.05] text-[#555] hover:bg-black/[0.1]')}`}
                                            >
                                                <ExternalLink size={12} />
                                                Press kit
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={`${panelBg} border rounded-xl p-4 md:p-5`}>
                        <h2 className={`text-[14px] md:text-[15px] font-semibold ${textMain}`}>Provider selezionato</h2>
                        <p className={`text-[12px] ${textSub} mt-1`}>Dati pronti per audit costi e compliance brand.</p>

                        <div className="mt-3 rounded-xl p-4" style={{ background: `linear-gradient(135deg, ${selectedProvider.brandGradient[0]}, ${selectedProvider.brandGradient[1]})` }}>
                            <p className="text-[11px] text-white/75">{selectedProvider.vendor}</p>
                            <p className="text-[18px] font-bold text-white">{selectedProvider.name}</p>
                            <p className="text-[12px] text-white/80 mt-1">{selectedProvider.tagline}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                            <button
                                onClick={() => launchProviderChat(selectedProvider)}
                                className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-semibold transition-colors ${launchButtonClassByProvider[selectedProvider.id]}`}
                            >
                                <MessageCircle size={13} />
                                {selectedProvider.id === 'chatgpt' ? 'Apri chat in-app' : `Lancia chat ${selectedProvider.name}`}
                            </button>

                            <button
                                onClick={() => openExternalUrl(selectedProvider.loginUrl)}
                                className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-semibold transition-colors ${loginButtonClassByProvider[selectedProvider.id]}`}
                            >
                                <KeyRound size={13} />
                                Login provider
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <div className={`${cardBg} border rounded-lg p-3`}>
                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Piano</p>
                                <p className={`text-[12px] font-semibold ${textMain} mt-1`}>{selectedProvider.subscriptionPlanName}</p>
                            </div>
                            <div className={`${cardBg} border rounded-lg p-3`}>
                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Canone</p>
                                <p className={`text-[12px] font-semibold ${textMain} mt-1`}>{currencyFormatter.format(selectedProviderCost.subscriptionCostUsd)}</p>
                            </div>
                            <div className={`${cardBg} border rounded-lg p-3`}>
                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Extra token</p>
                                <p className={`text-[12px] font-semibold ${textMain} mt-1`}>{currencyFormatter.format(selectedProviderCost.variableUsageCostUsd)}</p>
                            </div>
                            <div className={`${cardBg} border rounded-lg p-3`}>
                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Totale mese</p>
                                <p className={`text-[12px] font-semibold ${textMain} mt-1`}>{currencyFormatter.format(selectedProviderCost.totalCostUsd)}</p>
                            </div>
                        </div>

                        <p className={`text-[11px] mt-2 ${textSub}`}>
                            Token inclusi {selectedProviderCost.includedTokens.toLocaleString('it-IT')} · token usati {selectedProviderCost.consumedTokens.toLocaleString('it-IT')} · overage {selectedProviderCost.overageTokens.toLocaleString('it-IT')}
                        </p>

                        <div className="mt-3">
                            <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Famiglie modello</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {selectedProvider.modelFamilies.map(model => (
                                    <span key={model} className={`px-2 py-1 rounded-md text-[10px] font-medium ${t('bg-white/[0.08] text-[#ddd]', 'bg-black/[0.06] text-[#444]')}`}>
                                        {model}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/[0.08]">
                            <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Fonti brand</p>
                            <div className="flex flex-col gap-1.5 mt-2">
                                <a
                                    href={selectedProvider.pressKitUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[11px] text-[#F73C1C] hover:text-[#ff5b3c]"
                                >
                                    <ExternalLink size={12} />
                                    Press kit ufficiale
                                </a>
                                {selectedProvider.brandGuidelinesUrl && (
                                    <a
                                        href={selectedProvider.brandGuidelinesUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-[11px] text-[#F73C1C] hover:text-[#ff5b3c]"
                                    >
                                        <ExternalLink size={12} />
                                        Brand guidelines
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {selectedProvider.id === 'chatgpt' && (
                    <div id="chatgpt-embedded-panel">
                        <EmbeddedChatGPTPanel providerConnected={selectedProvider.connected} />
                    </div>
                )}

                <div className={`${panelBg} border rounded-xl overflow-hidden`}>
                    <div className="px-4 md:px-5 py-3 border-b border-white/[0.08]">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <h2 className={`text-[14px] md:text-[15px] font-semibold ${textMain}`}>Report costi e token per provider</h2>
                            <span className={`text-[10px] ${textMuted}`}>aggiornamento mock realtime ogni 15 min</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px]">
                            <thead>
                                <tr className={tableHead}>
                                    {['Provider', 'Piano', 'Stato', 'Token usati / inclusi', 'Canone', 'Extra token', 'Totale mese', 'Costo effettivo / 1M'].map(head => (
                                        <th key={head} className={`px-4 md:px-5 py-2.5 text-left text-[10px] uppercase tracking-[1px] ${textMuted}`}>
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {providers.map(provider => {
                                    const providerCost = getProviderCostBreakdown(provider);
                                    const costWidth = `${Math.max((providerCost.totalCostUsd / maxCost) * 100, 8)}%`;

                                    return (
                                        <tr key={provider.id} className={`border-t ${tableBorder} ${hoverBg} transition-colors`}>
                                            <td className="px-4 md:px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: provider.accentColor }} />
                                                    <span className={`text-[12px] font-semibold ${textMain}`}>{provider.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-5 py-3.5">
                                                <span className={`text-[12px] ${textSub}`}>{provider.subscriptionPlanName}</span>
                                            </td>
                                            <td className="px-4 md:px-5 py-3.5">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${provider.connected
                                                    ? 'bg-[#10B981]/15 text-[#10B981]'
                                                    : t('bg-[#444]/20 text-[#9a9a9a]', 'bg-[#ddd] text-[#777]')
                                                    }`}>
                                                    {provider.connected ? 'Connesso' : 'Offline'}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-5 py-3.5">
                                                <div className={`text-[12px] ${textSub}`}>
                                                    {compactFormatter.format(providerCost.consumedTokens)} / {compactFormatter.format(providerCost.includedTokens)}
                                                </div>
                                                <div className={`text-[10px] ${textMuted}`}>
                                                    overage {compactFormatter.format(providerCost.overageTokens)}
                                                </div>
                                            </td>
                                            <td className={`px-4 md:px-5 py-3.5 text-[12px] ${textSub}`}>{currencyFormatter.format(providerCost.subscriptionCostUsd)}</td>
                                            <td className="px-4 md:px-5 py-3.5">
                                                <div className={`text-[12px] ${textSub}`}>{currencyFormatter.format(providerCost.variableUsageCostUsd)}</div>
                                                <div className={`text-[10px] ${textMuted}`}>solo consumo oltre piano</div>
                                            </td>
                                            <td className="px-4 md:px-5 py-3.5">
                                                <div className="min-w-[150px]">
                                                    <div className={`text-[12px] font-semibold ${textMain}`}>{currencyFormatter.format(providerCost.totalCostUsd)}</div>
                                                    <div className={`h-1.5 rounded-full mt-1.5 ${t('bg-white/[0.08]', 'bg-black/[0.08]')}`}>
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{ width: costWidth, backgroundColor: provider.accentColor === '#FFFFFF' ? '#F73C1C' : provider.accentColor }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-4 md:px-5 py-3.5 text-[12px] ${textSub}`}>{currencyFormatter.format(providerCost.effectiveCostPerMillionUsd)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className={`px-4 md:px-5 py-3 border-t ${tableBorder} ${t('bg-black/15', 'bg-black/[0.02]')}`}>
                        <div className="flex items-center gap-2 text-[11px]">
                            <BarChart3 size={13} className={t('text-[#888]', 'text-[#666]')} />
                            <span className={textSub}>Il totale mese include il canone del piano sottoscritto e gli extra token fuori soglia.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}