import { BarChart3, CheckCircle2, CircleGauge, ExternalLink, KeyRound, Link2, LogIn, LogOut, Sigma, Wallet } from 'lucide-react';
import type { ThirdPartyProvider, ThirdPartyProviderId } from './thirdPartyProviders';
import { useTheme } from './ThemeContext';

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

export function ThirdPartyHubView({ providers, selectedProviderId, onSelectProvider, onToggleConnection }: ThirdPartyHubViewProps) {
    const { t } = useTheme();

    const selectedProvider = providers.find(provider => provider.id === selectedProviderId) ?? providers[0];
    if (!selectedProvider) return null;

    const connectedProviders = providers.filter(provider => provider.connected).length;
    const totalCost = providers.reduce((acc, provider) => acc + provider.monthlyCostUsd, 0);
    const totalTokens = providers.reduce((acc, provider) => acc + provider.inputTokens + provider.outputTokens, 0);
    const avgLatency = Math.round(providers.reduce((acc, provider) => acc + provider.avgLatencyMs, 0) / providers.length);

    const cards = [
        {
            label: 'Provider connessi',
            value: `${connectedProviders}/${providers.length}`,
            detail: 'stato autenticazioni',
            icon: CheckCircle2,
            color: '#10B981',
        },
        {
            label: 'Costo mensile stimato',
            value: currencyFormatter.format(totalCost),
            detail: 'routing multi-provider',
            icon: Wallet,
            color: '#F59E0B',
        },
        {
            label: 'Token elaborati',
            value: compactFormatter.format(totalTokens),
            detail: 'input + output mese',
            icon: Sigma,
            color: '#F73C1C',
        },
        {
            label: 'Latenza media',
            value: `${avgLatency} ms`,
            detail: 'tempo risposta medio',
            icon: CircleGauge,
            color: '#5C86FF',
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

    const maxCost = Math.max(...providers.map(provider => provider.monthlyCostUsd), 1);

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

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-4 md:gap-6 mb-4 md:mb-6">
                    <div className={`${panelBg} border rounded-xl p-4 md:p-5`}>
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <h2 className={`text-[14px] md:text-[15px] font-semibold ${textMain}`}>Provider e accessi</h2>
                            <span className={`text-[10px] ${textMuted}`}>login + press kit</span>
                        </div>

                        <div className="space-y-2.5">
                            {providers.map(provider => {
                                const isSelected = provider.id === selectedProvider.id;
                                const totalProviderTokens = provider.inputTokens + provider.outputTokens;

                                return (
                                    <div
                                        key={provider.id}
                                        className={`rounded-xl border p-3 transition-colors ${isSelected
                                            ? t('border-[#F73C1C]/35 bg-[#F73C1C]/[0.05]', 'border-[#F73C1C]/35 bg-[#F73C1C]/[0.05]')
                                            : t('border-white/[0.05] bg-[#111]', 'border-black/[0.08] bg-white')
                                            }`}
                                    >
                                        <button onClick={() => onSelectProvider(provider.id)} className="w-full text-left">
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
                                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Token</p>
                                                <p className={`text-[12px] font-semibold ${textMain}`}>{compactFormatter.format(totalProviderTokens)}</p>
                                            </div>
                                            <div className={`rounded-lg px-2.5 py-2 ${t('bg-black/20', 'bg-black/[0.03]')}`}>
                                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Costo</p>
                                                <p className={`text-[12px] font-semibold ${textMain}`}>{currencyFormatter.format(provider.monthlyCostUsd)}</p>
                                            </div>
                                        </div>

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

                                            <a
                                                href={provider.loginUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${t('bg-white/[0.06] text-[#ddd] hover:bg-white/[0.1]', 'bg-black/[0.05] text-[#555] hover:bg-black/[0.1]')}`}
                                            >
                                                <KeyRound size={12} />
                                                Login
                                            </a>

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

                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <div className={`${cardBg} border rounded-lg p-3`}>
                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Auth</p>
                                <p className={`text-[12px] font-semibold ${textMain} mt-1`}>{selectedProvider.authLabel}</p>
                            </div>
                            <div className={`${cardBg} border rounded-lg p-3`}>
                                <p className={`text-[10px] uppercase tracking-[1px] ${textMuted}`}>Latenza</p>
                                <p className={`text-[12px] font-semibold ${textMain} mt-1`}>{selectedProvider.avgLatencyMs} ms</p>
                            </div>
                        </div>

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

                <div className={`${panelBg} border rounded-xl overflow-hidden`}>
                    <div className="px-4 md:px-5 py-3 border-b border-white/[0.08]">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <h2 className={`text-[14px] md:text-[15px] font-semibold ${textMain}`}>Report costi e token per provider</h2>
                            <span className={`text-[10px] ${textMuted}`}>aggiornamento mock realtime ogni 15 min</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className={tableHead}>
                                    {['Provider', 'Stato', 'Input token', 'Output token', 'Costo mese', 'Costo / 1M token'].map(head => (
                                        <th key={head} className={`px-4 md:px-5 py-2.5 text-left text-[10px] uppercase tracking-[1px] ${textMuted}`}>
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {providers.map(provider => {
                                    const providerTotalTokens = provider.inputTokens + provider.outputTokens;
                                    const costPerMillion = providerTotalTokens > 0
                                        ? provider.monthlyCostUsd / (providerTotalTokens / 1_000_000)
                                        : 0;
                                    const costWidth = `${Math.max((provider.monthlyCostUsd / maxCost) * 100, 8)}%`;

                                    return (
                                        <tr key={provider.id} className={`border-t ${tableBorder} ${hoverBg} transition-colors`}>
                                            <td className="px-4 md:px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: provider.accentColor }} />
                                                    <span className={`text-[12px] font-semibold ${textMain}`}>{provider.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-5 py-3.5">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${provider.connected
                                                    ? 'bg-[#10B981]/15 text-[#10B981]'
                                                    : t('bg-[#444]/20 text-[#9a9a9a]', 'bg-[#ddd] text-[#777]')
                                                    }`}>
                                                    {provider.connected ? 'Connesso' : 'Offline'}
                                                </span>
                                            </td>
                                            <td className={`px-4 md:px-5 py-3.5 text-[12px] ${textSub}`}>{provider.inputTokens.toLocaleString('it-IT')}</td>
                                            <td className={`px-4 md:px-5 py-3.5 text-[12px] ${textSub}`}>{provider.outputTokens.toLocaleString('it-IT')}</td>
                                            <td className="px-4 md:px-5 py-3.5">
                                                <div className="min-w-[150px]">
                                                    <div className={`text-[12px] font-semibold ${textMain}`}>{currencyFormatter.format(provider.monthlyCostUsd)}</div>
                                                    <div className={`h-1.5 rounded-full mt-1.5 ${t('bg-white/[0.08]', 'bg-black/[0.08]')}`}>
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{ width: costWidth, backgroundColor: provider.accentColor === '#FFFFFF' ? '#F73C1C' : provider.accentColor }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-4 md:px-5 py-3.5 text-[12px] ${textSub}`}>{currencyFormatter.format(costPerMillion)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className={`px-4 md:px-5 py-3 border-t ${tableBorder} ${t('bg-black/15', 'bg-black/[0.02]')}`}>
                        <div className="flex items-center gap-2 text-[11px]">
                            <BarChart3 size={13} className={t('text-[#888]', 'text-[#666]')} />
                            <span className={textSub}>Le metriche mostrano i consumi consolidati per auditing operativo e controllo budget.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}