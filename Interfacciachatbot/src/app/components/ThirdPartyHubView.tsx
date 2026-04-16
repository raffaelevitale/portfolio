import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bot, CheckCircle2, Circle, ExternalLink, Link2, Plus, Sparkles, Trash2, Copy } from 'lucide-react';
import { EmbeddedChatGPTPanel } from './EmbeddedChatGPTPanel';
import {
    THIRD_PARTY_ROWS_STORAGE_KEY,
    THIRD_PARTY_ROWS_UPDATED_EVENT,
    createEmptyThirdPartyRow,
    getSeededThirdPartyRows,
    parseThirdPartyRows,
    type ThirdPartyToolRow,
} from './thirdPartyProviders';
import { useTheme } from './ThemeContext';

interface ThirdPartyHubViewProps {
    selectedToolId: string | null;
    onSelectToolId: (toolId: string | null) => void;
}

function loadRowsFromStorage(): ThirdPartyToolRow[] {
    if (typeof window === 'undefined') return getSeededThirdPartyRows();
    const stored = parseThirdPartyRows(window.localStorage.getItem(THIRD_PARTY_ROWS_STORAGE_KEY));
    return stored && stored.length > 0 ? stored : getSeededThirdPartyRows();
}

export function ThirdPartyHubView({ selectedToolId, onSelectToolId }: ThirdPartyHubViewProps) {
    const { t } = useTheme();

    const [rows, setRows] = useState<ThirdPartyToolRow[]>(loadRowsFromStorage);
    const [search, setSearch] = useState('');
    const [companyContext, setCompanyContext] = useState('Azienda B2B in crescita con piu reparti operativi.');
    const [businessGoal, setBusinessGoal] = useState('Ridurre tempo medio di risposta e aumentare qualita output operativi.');
    const [successMetric, setSuccessMetric] = useState('Riduzione 25% tempi entro 90 giorni.');
    const [guidedInstruction, setGuidedInstruction] = useState('Genera un piano operativo in 5 step per migliorare il processo attuale.');
    const [chatPreset, setChatPreset] = useState<string | null>(null);
    const [copiedBrief, setCopiedBrief] = useState(false);
    const [connectionWizardStep, setConnectionWizardStep] = useState<1 | 2 | 3>(1);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(THIRD_PARTY_ROWS_STORAGE_KEY, JSON.stringify(rows));
        window.dispatchEvent(new Event(THIRD_PARTY_ROWS_UPDATED_EVENT));
    }, [rows]);

    const connectedRows = rows.filter((row) => row.connected);

    useEffect(() => {
        const stillExists = selectedToolId ? rows.some((row) => row.id === selectedToolId) : false;
        if (stillExists) return;

        const chatGptId = rows.find((row) => row.serviceName.toLowerCase().includes('chatgpt'))?.id;
        const fallbackId = chatGptId ?? connectedRows[0]?.id ?? rows[0]?.id ?? null;
        if (fallbackId !== selectedToolId) onSelectToolId(fallbackId);
    }, [rows, connectedRows, selectedToolId, onSelectToolId]);

    const euroFormatter = useMemo(
        () => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }),
        [],
    );

    const normalizedSearch = search.trim().toLowerCase();
    const filteredRows = rows.filter((row) => {
        if (!normalizedSearch) return true;
        return [row.serviceName, row.vendor, row.url, row.notes]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);
    });

    const totalMonthlySpend = rows.reduce((sum, row) => {
        if (!row.subscribed || row.billingType !== 'paid') return sum;
        return sum + Math.max(0, row.monthlyCostEur);
    }, 0);

    const annualProjection = totalMonthlySpend * 12;
    const optimizationPotential = totalMonthlySpend * 0.18;
    const activeSubscriptions = rows.filter((row) => row.subscribed).length;
    const selectedTool = rows.find((row) => row.id === selectedToolId) ?? null;
    const isSelectedToolChatGpt = Boolean(selectedTool && selectedTool.serviceName.toLowerCase().includes('chatgpt'));
    const isInAppChatReady = Boolean(selectedTool && selectedTool.connected && isSelectedToolChatGpt);
    const wizardStep1Done = Boolean(selectedTool);
    const wizardStep2Done = Boolean(selectedTool?.connected);
    const wizardStep3Done = Boolean(selectedTool && (selectedTool.url.trim().length > 0 || selectedTool.notes.trim().length > 0));

    const step1Ready = connectedRows.length > 0;
    const step2Ready = [companyContext, businessGoal, successMetric, guidedInstruction].every((value) => value.trim().length > 0);
    const step3Ready = isInAppChatReady;

    const routingBrief = useMemo(() => {
        const toolName = selectedTool?.serviceName || 'Nessun tool selezionato';
        const vendor = selectedTool?.vendor || 'Vendor non definito';

        return [
            'Contesto B2B CRYBU - motore di instradamento esterno',
            `Tool target: ${toolName} (${vendor})`,
            `Contesto aziendale: ${companyContext.trim() || 'N/D'}`,
            `Obiettivo: ${businessGoal.trim() || 'N/D'}`,
            `KPI di successo: ${successMetric.trim() || 'N/D'}`,
            '',
            'Istruzione operativa:',
            guidedInstruction.trim() || 'N/D',
        ].join('\n');
    }, [selectedTool, companyContext, businessGoal, successMetric, guidedInstruction]);

    const updateRow = (id: string, patch: Partial<ThirdPartyToolRow>) => {
        setRows((prev) => prev.map((row) => row.id === id ? { ...row, ...patch } : row));
    };

    const removeRow = (id: string) => {
        if (id === selectedToolId) {
            setConnectionWizardStep(1);
        }
        setRows((prev) => prev.filter((row) => row.id !== id));
    };

    const addRow = () => {
        const next = createEmptyThirdPartyRow();
        setRows((prev) => [next, ...prev]);
        onSelectToolId(next.id);
        setConnectionWizardStep(2);
    };

    useEffect(() => {
        if (!selectedTool && connectionWizardStep !== 1) {
            setConnectionWizardStep(1);
        }
    }, [selectedTool, connectionWizardStep]);

    const loadBriefInChat = () => {
        setChatPreset(routingBrief);
    };

    const copyBrief = async () => {
        if (typeof navigator === 'undefined' || !navigator.clipboard) return;
        await navigator.clipboard.writeText(routingBrief);
        setCopiedBrief(true);
        setTimeout(() => setCopiedBrief(false), 1200);
    };

    const pageBg = t('bg-[#101010]', 'bg-[#F5F5F5]');
    const panelBg = t('bg-[#141414] border-white/[0.05]', 'bg-[#FAFAFA] border-black/[0.08]');
    const cardBg = t('bg-white/[0.03] border-white/[0.08]', 'bg-white border-black/[0.08]');
    const textMain = t('text-white', 'text-[#111]');
    const textSub = t('text-[#888]', 'text-[#666]');
    const textMuted = t('text-[#666]', 'text-[#888]');
    const rowBorder = t('border-white/[0.06]', 'border-black/[0.08]');
    const inputBg = t('bg-[#1A1A1A] border-white/[0.08] text-[#EEE]', 'bg-white border-black/[0.1] text-[#222]');
    const subtleBtn = t('bg-white/[0.04] hover:bg-white/[0.08] text-[#DDD]', 'bg-black/[0.05] hover:bg-black/[0.1] text-[#333]');

    return (
        <div className={`flex flex-col flex-1 h-full min-w-0 overflow-y-auto ${pageBg}`}>
            <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-4 md:space-y-6">
                <div className={`${panelBg} border rounded-xl p-5 md:p-7`}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h1 className={`text-[22px] md:text-[28px] font-bold ${textMain}`}>Terze Parti</h1>
                            <p className={`text-[13px] md:text-[14px] mt-2 max-w-3xl ${textSub}`}>
                                Percorso guidato per aziende: collega provider esterni e usa ChatGPT dentro la dashboard CRYBU
                                con la stessa logica del motore di instradamento dell'Ecosistema.
                            </p>
                        </div>
                        <button
                            onClick={addRow}
                            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#F73C1C] hover:bg-[#e63518] text-white text-[12px] font-semibold transition-colors"
                        >
                            <Plus size={14} />
                            Aggiungi servizio
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    <div className={`${cardBg} border rounded-xl p-4`}>
                        <p className={`text-[11px] uppercase tracking-[1px] ${textMuted}`}>Tool connessi</p>
                        <p className={`text-[24px] font-bold mt-1 ${textMain}`}>{connectedRows.length}</p>
                    </div>
                    <div className={`${cardBg} border rounded-xl p-4`}>
                        <p className={`text-[11px] uppercase tracking-[1px] ${textMuted}`}>Abbonamenti attivi</p>
                        <p className={`text-[24px] font-bold mt-1 ${textMain}`}>{activeSubscriptions}</p>
                    </div>
                    <div className={`${cardBg} border rounded-xl p-4`}>
                        <p className={`text-[11px] uppercase tracking-[1px] ${textMuted}`}>Spesa mensile</p>
                        <p className={`text-[24px] font-bold mt-1 ${textMain}`}>{euroFormatter.format(totalMonthlySpend)}</p>
                    </div>
                    <div className={`${cardBg} border rounded-xl p-4`}>
                        <p className={`text-[11px] uppercase tracking-[1px] ${textMuted}`}>Potenziale ottimizzazione</p>
                        <p className={`text-[24px] font-bold mt-1 ${textMain}`}>{euroFormatter.format(optimizationPotential)}</p>
                        <p className={`text-[10px] mt-1 ${textMuted}`}>Proiezione annua: {euroFormatter.format(annualProjection)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className={`${panelBg} border rounded-xl p-4`}>
                        <div className="flex items-center justify-between">
                            <p className={`text-[12px] font-semibold ${textMain}`}>1. Collega provider</p>
                            {step1Ready ? <CheckCircle2 size={15} className="text-[#10B981]" /> : <Circle size={15} className={t('text-[#666]', 'text-[#999]')} />}
                        </div>
                        <p className={`text-[12px] mt-2 ${textSub}`}>Attiva almeno un provider per usare il motore esterno.</p>
                    </div>

                    <div className={`${panelBg} border rounded-xl p-4`}>
                        <div className="flex items-center justify-between">
                            <p className={`text-[12px] font-semibold ${textMain}`}>2. Compila briefing aziendale</p>
                            {step2Ready ? <CheckCircle2 size={15} className="text-[#10B981]" /> : <Circle size={15} className={t('text-[#666]', 'text-[#999]')} />}
                        </div>
                        <p className={`text-[12px] mt-2 ${textSub}`}>Definisci obiettivo e KPI per guidare risposte piu utili.</p>
                    </div>

                    <div className={`${panelBg} border rounded-xl p-4`}>
                        <div className="flex items-center justify-between">
                            <p className={`text-[12px] font-semibold ${textMain}`}>3. Usa chat integrata</p>
                            {step3Ready ? <CheckCircle2 size={15} className="text-[#10B981]" /> : <Circle size={15} className={t('text-[#666]', 'text-[#999]')} />}
                        </div>
                        <p className={`text-[12px] mt-2 ${textSub}`}>ChatGPT e usabile direttamente sotto la veste grafica CRYBU.</p>
                    </div>
                </div>

                <div className={`${panelBg} border rounded-xl p-4 md:p-5 space-y-4`}>
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                        <div>
                            <h2 className={`text-[16px] font-semibold ${textMain}`}>Connessioni aziendali guidate</h2>
                            <p className={`text-[12px] mt-1 ${textSub}`}>Wizard a 3 click: seleziona il servizio, attiva connessione, completa i dettagli operativi.</p>
                        </div>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cerca servizio o vendor..."
                            className={`w-full md:w-[280px] rounded-lg px-3 py-2 text-[12px] border ${inputBg} outline-none focus:border-[#F73C1C]/40`}
                        />
                    </div>

                    <div className={`rounded-xl border ${rowBorder} p-3 md:p-4 space-y-4`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <button
                                onClick={() => setConnectionWizardStep(1)}
                                className={`text-left rounded-lg border px-3 py-2 transition-colors ${connectionWizardStep === 1 ? 'border-[#F73C1C]/45 bg-[#F73C1C]/10' : rowBorder}`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className={`text-[12px] font-semibold ${connectionWizardStep === 1 ? 'text-[#F73C1C]' : textMain}`}>Step 1. Seleziona servizio</p>
                                    {wizardStep1Done ? <CheckCircle2 size={14} className="text-[#10B981]" /> : <Circle size={14} className={t('text-[#666]', 'text-[#999]')} />}
                                </div>
                                <p className={`text-[11px] mt-1 ${textSub}`}>Click 1: scegli il provider da usare.</p>
                            </button>

                            <button
                                onClick={() => selectedTool && setConnectionWizardStep(2)}
                                disabled={!selectedTool}
                                className={`text-left rounded-lg border px-3 py-2 transition-colors disabled:opacity-45 ${connectionWizardStep === 2 ? 'border-[#F73C1C]/45 bg-[#F73C1C]/10' : rowBorder}`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className={`text-[12px] font-semibold ${connectionWizardStep === 2 ? 'text-[#F73C1C]' : textMain}`}>Step 2. Attiva connessione</p>
                                    {wizardStep2Done ? <CheckCircle2 size={14} className="text-[#10B981]" /> : <Circle size={14} className={t('text-[#666]', 'text-[#999]')} />}
                                </div>
                                <p className={`text-[11px] mt-1 ${textSub}`}>Click 2: imposta stato e piano.</p>
                            </button>

                            <button
                                onClick={() => selectedTool && setConnectionWizardStep(3)}
                                disabled={!selectedTool}
                                className={`text-left rounded-lg border px-3 py-2 transition-colors disabled:opacity-45 ${connectionWizardStep === 3 ? 'border-[#F73C1C]/45 bg-[#F73C1C]/10' : rowBorder}`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className={`text-[12px] font-semibold ${connectionWizardStep === 3 ? 'text-[#F73C1C]' : textMain}`}>Step 3. Completa dettagli</p>
                                    {wizardStep3Done ? <CheckCircle2 size={14} className="text-[#10B981]" /> : <Circle size={14} className={t('text-[#666]', 'text-[#999]')} />}
                                </div>
                                <p className={`text-[11px] mt-1 ${textSub}`}>Click 3: link operativo e note.</p>
                            </button>
                        </div>

                        {connectionWizardStep === 1 && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                {filteredRows.map((row) => {
                                    const selected = row.id === selectedTool?.id;
                                    return (
                                        <div key={row.id} className={`border rounded-xl p-3 space-y-2 ${selected ? 'border-[#F73C1C]/45 bg-[#F73C1C]/10' : rowBorder}`}>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className={`text-[13px] font-semibold truncate ${selected ? 'text-[#F73C1C]' : textMain}`}>{row.serviceName || 'Servizio esterno'}</p>
                                                    <p className={`text-[11px] ${textMuted} truncate`}>{row.vendor || 'Vendor non definito'}</p>
                                                </div>
                                                <span className={`text-[10px] px-2 py-1 rounded ${row.connected ? 'bg-[#10B981]/15 text-[#10B981]' : t('bg-white/[0.08] text-[#888]', 'bg-black/[0.06] text-[#777]')}`}>
                                                    {row.connected ? 'Connesso' : 'Non connesso'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <button
                                                    onClick={() => {
                                                        onSelectToolId(row.id);
                                                        setConnectionWizardStep(2);
                                                    }}
                                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-[#F73C1C]/15 hover:bg-[#F73C1C]/25 text-[#F73C1C]"
                                                >
                                                    <ArrowRight size={12} />
                                                    Step 1 completato
                                                </button>
                                                <button
                                                    onClick={() => removeRow(row.id)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444]"
                                                >
                                                    <Trash2 size={12} />
                                                    Elimina
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {filteredRows.length === 0 && (
                                    <div className={`text-[12px] ${textSub}`}>Nessun servizio trovato. Prova un altro filtro o aggiungi un nuovo servizio.</div>
                                )}
                            </div>
                        )}

                        {connectionWizardStep === 2 && (
                            <div className="space-y-3">
                                {!selectedTool ? (
                                    <div className={`text-[12px] ${textSub}`}>Seleziona prima un servizio nello Step 1.</div>
                                ) : (
                                    <>
                                        <div className={`border rounded-lg ${rowBorder} p-3 ${t('bg-white/[0.02]', 'bg-white')}`}>
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <div>
                                                    <p className={`text-[13px] font-semibold ${textMain}`}>{selectedTool.serviceName || 'Servizio esterno'}</p>
                                                    <p className={`text-[11px] ${textMuted}`}>{selectedTool.vendor || 'Vendor non definito'}</p>
                                                </div>
                                                <button
                                                    onClick={() => setConnectionWizardStep(1)}
                                                    className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md ${subtleBtn}`}
                                                >
                                                    Cambia servizio
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <button
                                                onClick={() => updateRow(selectedTool.id, { connected: !selectedTool.connected })}
                                                className={`rounded-lg border px-3 py-2 text-left ${selectedTool.connected ? 'border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]' : rowBorder}`}
                                            >
                                                <p className="text-[12px] font-semibold">Connesso: {selectedTool.connected ? 'Si' : 'No'}</p>
                                            </button>

                                            <button
                                                onClick={() => updateRow(selectedTool.id, { subscribed: !selectedTool.subscribed })}
                                                className={`rounded-lg border px-3 py-2 text-left ${selectedTool.subscribed ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]' : rowBorder}`}
                                            >
                                                <p className="text-[12px] font-semibold">Abbonato: {selectedTool.subscribed ? 'Si' : 'No'}</p>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <select
                                                value={selectedTool.billingType}
                                                onChange={(event) => {
                                                    const nextType = event.target.value as ThirdPartyToolRow['billingType'];
                                                    updateRow(selectedTool.id, {
                                                        billingType: nextType,
                                                        monthlyCostEur: nextType === 'free' ? 0 : selectedTool.monthlyCostEur,
                                                    });
                                                }}
                                                className={`rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none`}
                                            >
                                                <option value="free">Free</option>
                                                <option value="paid">A pagamento</option>
                                            </select>

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                disabled={selectedTool.billingType === 'free'}
                                                value={selectedTool.monthlyCostEur}
                                                onChange={(event) => updateRow(selectedTool.id, { monthlyCostEur: Number(event.target.value || 0) })}
                                                className={`rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none disabled:opacity-50`}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button
                                                onClick={() => setConnectionWizardStep(3)}
                                                disabled={!selectedTool.connected}
                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] bg-[#F73C1C] hover:bg-[#e63518] text-white disabled:opacity-40"
                                            >
                                                <ArrowRight size={13} />
                                                Step 2 completato
                                            </button>
                                            {!selectedTool.connected && (
                                                <p className={`text-[11px] ${textSub}`}>Attiva prima lo stato "Connesso" per continuare.</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {connectionWizardStep === 3 && (
                            <div className="space-y-3">
                                {!selectedTool ? (
                                    <div className={`text-[12px] ${textSub}`}>Seleziona prima un servizio negli step precedenti.</div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <input
                                                value={selectedTool.serviceName}
                                                onChange={(event) => updateRow(selectedTool.id, { serviceName: event.target.value })}
                                                placeholder="Nome servizio"
                                                className={`rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none`}
                                            />
                                            <input
                                                value={selectedTool.vendor}
                                                onChange={(event) => updateRow(selectedTool.id, { vendor: event.target.value })}
                                                placeholder="Vendor"
                                                className={`rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none`}
                                            />
                                        </div>

                                        <input
                                            value={selectedTool.url}
                                            onChange={(event) => updateRow(selectedTool.id, { url: event.target.value })}
                                            placeholder="https://link-servizio"
                                            className={`w-full rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none`}
                                        />

                                        <textarea
                                            value={selectedTool.notes}
                                            onChange={(event) => updateRow(selectedTool.id, { notes: event.target.value })}
                                            placeholder="Nota operativa interna"
                                            rows={3}
                                            className={`w-full rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none resize-y`}
                                        />

                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button
                                                onClick={() => selectedTool.url.trim() && window.open(selectedTool.url.trim(), '_blank', 'noopener,noreferrer')}
                                                disabled={!selectedTool.url.trim()}
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] ${subtleBtn} disabled:opacity-40`}
                                            >
                                                <ExternalLink size={12} />
                                                Apri provider
                                            </button>

                                            <button
                                                onClick={() => setConnectionWizardStep(1)}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-[#F73C1C]/15 hover:bg-[#F73C1C]/25 text-[#F73C1C]"
                                            >
                                                <ArrowRight size={12} />
                                                Wizard completato
                                            </button>

                                            <button
                                                onClick={() => removeRow(selectedTool.id)}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444]"
                                            >
                                                <Trash2 size={12} />
                                                Elimina
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className={`${panelBg} border rounded-xl p-4 md:p-5 space-y-4`}>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                            <h2 className={`text-[16px] font-semibold ${textMain}`}>Motore di Instradamento Esterno</h2>
                            <p className={`text-[12px] mt-1 ${textSub}`}>
                                Seleziona il tool e carica automaticamente un briefing business nella chat integrata.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-md bg-[#F73C1C]/10 text-[#F73C1C]">
                            <Sparkles size={12} />
                            Guida Assistita B2B
                        </div>
                    </div>

                    <div className={`border rounded-lg ${rowBorder} p-3 ${t('bg-white/[0.02]', 'bg-white')}`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="inline-flex items-center gap-2">
                                <Link2 size={13} className="text-[#F73C1C]" />
                                <span className={`text-[12px] font-semibold ${textMain}`}>Tool attivo: {selectedTool?.serviceName || 'Nessuno'}</span>
                            </div>
                            <span className={`text-[11px] px-2 py-1 rounded-md ${isInAppChatReady ? 'bg-[#10B981]/15 text-[#10B981]' : t('bg-white/[0.08] text-[#888]', 'bg-black/[0.06] text-[#777]')}`}>
                                {isInAppChatReady ? 'Chat in-app pronta' : 'Configurazione richiesta'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        <input
                            value={companyContext}
                            onChange={(event) => setCompanyContext(event.target.value)}
                            placeholder="Contesto aziendale"
                            className={`rounded-lg px-3 py-2 text-[12px] border ${inputBg} outline-none`}
                        />
                        <input
                            value={businessGoal}
                            onChange={(event) => setBusinessGoal(event.target.value)}
                            placeholder="Obiettivo business"
                            className={`rounded-lg px-3 py-2 text-[12px] border ${inputBg} outline-none`}
                        />
                        <input
                            value={successMetric}
                            onChange={(event) => setSuccessMetric(event.target.value)}
                            placeholder="KPI di successo"
                            className={`rounded-lg px-3 py-2 text-[12px] border ${inputBg} outline-none`}
                        />
                    </div>

                    <textarea
                        value={guidedInstruction}
                        onChange={(event) => setGuidedInstruction(event.target.value)}
                        placeholder="Scrivi la richiesta operativa da dare al motore..."
                        rows={4}
                        className={`w-full rounded-lg px-3 py-2 text-[12px] border ${inputBg} outline-none resize-y`}
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={loadBriefInChat}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] bg-[#F73C1C] hover:bg-[#e63518] text-white"
                        >
                            <Bot size={13} />
                            Carica briefing nella chat
                        </button>

                        <button
                            onClick={() => void copyBrief()}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] ${subtleBtn}`}
                        >
                            <Copy size={13} />
                            {copiedBrief ? 'Brief copiato' : 'Copia brief'}
                        </button>

                        <button
                            onClick={() => selectedTool?.url.trim() && window.open(selectedTool.url.trim(), '_blank', 'noopener,noreferrer')}
                            disabled={!selectedTool?.url.trim()}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] ${subtleBtn} disabled:opacity-40`}
                        >
                            <ExternalLink size={13} />
                            Apri provider esterno
                        </button>
                    </div>

                    <div className={`border rounded-lg ${rowBorder} p-3`}>
                        <p className={`text-[11px] uppercase tracking-[1px] mb-2 ${textMuted}`}>Briefing generato</p>
                        <pre className={`whitespace-pre-wrap text-[12px] leading-relaxed ${textMain}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                            {routingBrief}
                        </pre>
                    </div>

                    {isInAppChatReady ? (
                        <EmbeddedChatGPTPanel
                            providerConnected={true}
                            inputPreset={chatPreset}
                            onPresetApplied={() => setChatPreset(null)}
                            title="ChatGPT dentro CRYBU"
                            subtitle="Esecuzione in-app con guida business e instradamento esterno"
                        />
                    ) : (
                        <div className={`border rounded-lg ${rowBorder} p-3 text-[12px] ${textSub}`}>
                            Per usare la chat direttamente in dashboard devi selezionare ChatGPT e attivare lo stato "Connesso".
                            Se usi altri provider puoi comunque aprirli in esterno con il briefing gia pronto.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
