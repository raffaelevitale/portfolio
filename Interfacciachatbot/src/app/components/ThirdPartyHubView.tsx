import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, Plus, RotateCcw, ShieldAlert, Trash2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import {
    THIRD_PARTY_ROWS_STORAGE_KEY,
    THIRD_PARTY_ROWS_UPDATED_EVENT,
    createEmptyThirdPartyRow,
    getSeededThirdPartyRows,
    parseThirdPartyRows,
    type ThirdPartyToolRow,
} from './thirdPartyProviders';

interface ThirdPartyHubViewProps {
    selectedToolId: string | null;
    onSelectToolId: (toolId: string | null) => void;
}

type ThirdPartyFilter = 'all' | 'subscribed' | 'connected' | 'attention';

function loadRowsFromStorage(): ThirdPartyToolRow[] {
    if (typeof window === 'undefined') return getSeededThirdPartyRows();
    const stored = parseThirdPartyRows(window.localStorage.getItem(THIRD_PARTY_ROWS_STORAGE_KEY));
    return stored && stored.length > 0 ? stored : getSeededThirdPartyRows();
}

export function ThirdPartyHubView({ selectedToolId, onSelectToolId }: ThirdPartyHubViewProps) {
    const { t } = useTheme();

    const [rows, setRows] = useState<ThirdPartyToolRow[]>(loadRowsFromStorage);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<ThirdPartyFilter>('all');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(THIRD_PARTY_ROWS_STORAGE_KEY, JSON.stringify(rows));
        window.dispatchEvent(new Event(THIRD_PARTY_ROWS_UPDATED_EVENT));
    }, [rows]);

    useEffect(() => {
        const stillExists = selectedToolId ? rows.some((row) => row.id === selectedToolId) : false;
        if (stillExists) return;
        onSelectToolId(rows[0]?.id ?? null);
    }, [rows, selectedToolId, onSelectToolId]);

    const euroFormatter = useMemo(
        () => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }),
        [],
    );

    const normalizedSearch = search.trim().toLowerCase();
    const rowsNeedingAttention = rows.filter((row) => {
        if (!row.serviceName.trim()) return true;
        if (row.subscribed && !row.connected) return true;
        if (!row.subscribed && row.connected) return true;
        return false;
    });

    const rowsByFilter = rows.filter((row) => {
        if (filter === 'subscribed') return row.subscribed;
        if (filter === 'connected') return row.connected;
        if (filter === 'attention') return rowsNeedingAttention.some((r) => r.id === row.id);
        return true;
    });

    const filteredRows = rowsByFilter.filter((row) => {
        if (!normalizedSearch) return true;
        return [row.serviceName, row.vendor, row.url, row.notes]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);
    });

    const subscribedRows = rows.filter((row) => row.subscribed);
    const connectedRows = rows.filter((row) => row.connected);
    const connectedCoverage = subscribedRows.length === 0
        ? 0
        : Math.round((connectedRows.length / subscribedRows.length) * 100);
    const totalMonthlySpend = rows.reduce((sum, row) => {
        if (!row.subscribed) return sum;
        return sum + Math.max(0, row.monthlyCostEur);
    }, 0);
    const totalAnnualSpend = totalMonthlySpend * 12;

    const updateRow = (id: string, patch: Partial<ThirdPartyToolRow>) => {
        setRows((prev) => prev.map((row) => row.id === id ? { ...row, ...patch } : row));
    };

    const addRow = () => {
        const next = createEmptyThirdPartyRow();
        setRows((prev) => [next, ...prev]);
        onSelectToolId(next.id);
    };

    const resetRows = () => {
        const seeded = getSeededThirdPartyRows();
        setRows(seeded);
        setFilter('all');
        setSearch('');
        onSelectToolId(seeded[0]?.id ?? null);
    };

    const markSubscribedAsConnected = () => {
        setRows((prev) => prev.map((row) => row.subscribed ? { ...row, connected: true } : row));
    };

    const openProviderUrl = (url: string) => {
        const raw = url.trim();
        if (!raw) return;
        const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
        window.open(normalized, '_blank', 'noopener,noreferrer');
    };

    const removeRow = (id: string) => {
        setRows((prev) => prev.filter((row) => row.id !== id));
        if (selectedToolId === id) onSelectToolId(null);
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
    const filterBtnBase = t('border-white/[0.08] text-[#AAA] hover:text-white hover:bg-white/[0.04]', 'border-black/[0.1] text-[#666] hover:text-[#111] hover:bg-black/[0.04]');

    return (
        <div className={`flex flex-col flex-1 h-full min-w-0 overflow-y-auto ${pageBg}`}>
            <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-4 md:space-y-6">
                <div className={`${panelBg} border rounded-xl p-5 md:p-6`}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h1 className={`text-[22px] md:text-[26px] font-bold ${textMain}`}>Sottoscrizioni AI aziendali</h1>
                            <p className={`text-[13px] md:text-[14px] mt-2 max-w-2xl ${textSub}`}>
                                Sta gia lavorando per la tua azienda. Qui segni in modo semplice le piattaforme AI esterne,
                                il costo mensile e lo stato operativo.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={markSubscribedAsConnected}
                                className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors ${subtleBtn}`}
                            >
                                <CheckCircle2 size={14} />
                                Segna operativi
                            </button>
                            <button
                                onClick={resetRows}
                                className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors ${subtleBtn}`}
                            >
                                <RotateCcw size={14} />
                                Ripristina base
                            </button>
                            <button
                                onClick={addRow}
                                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#F73C1C] hover:bg-[#e63518] text-white text-[12px] font-semibold transition-colors"
                            >
                                <Plus size={14} />
                                Aggiungi servizio
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className={`${cardBg} border rounded-xl p-4`}>
                        <p className={`text-[11px] uppercase tracking-[1px] ${textMuted}`}>Abbonamenti attivi</p>
                        <p className={`text-[24px] font-bold mt-1 ${textMain}`}>{subscribedRows.length}</p>
                    </div>
                    <div className={`${cardBg} border rounded-xl p-4`}>
                        <p className={`text-[11px] uppercase tracking-[1px] ${textMuted}`}>Spesa mensile</p>
                        <p className={`text-[24px] font-bold mt-1 ${textMain}`}>{euroFormatter.format(totalMonthlySpend)}</p>
                    </div>
                    <div className={`${cardBg} border rounded-xl p-4`}>
                        <p className={`text-[11px] uppercase tracking-[1px] ${textMuted}`}>Provider operativi</p>
                        <p className={`text-[24px] font-bold mt-1 ${textMain}`}>{connectedRows.length}</p>
                    </div>
                    <div className={`${cardBg} border rounded-xl p-4`}>
                        <p className={`text-[11px] uppercase tracking-[1px] ${textMuted}`}>Copertura operativa</p>
                        <p className={`text-[24px] font-bold mt-1 ${textMain}`}>{connectedCoverage}%</p>
                        <p className={`text-[11px] mt-1 ${textMuted}`}>{euroFormatter.format(totalAnnualSpend)} / anno</p>
                    </div>
                </div>

                <div className={`${panelBg} border rounded-xl p-4 md:p-5 space-y-4`}>
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                        <div>
                            <h2 className={`text-[16px] font-semibold ${textMain}`}>Registro semplice</h2>
                            <p className={`text-[12px] mt-1 ${textSub}`}>Nome servizio, costo, stato abbonamento e operativo.</p>
                        </div>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cerca servizio..."
                            className={`w-full md:w-[240px] rounded-lg px-3 py-2 text-[12px] border ${inputBg} outline-none focus:border-[#F73C1C]/40`}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: 'all', label: 'Tutti', count: rows.length },
                            { id: 'subscribed', label: 'Abbonati', count: subscribedRows.length },
                            { id: 'connected', label: 'Operativi', count: connectedRows.length },
                            { id: 'attention', label: 'Da verificare', count: rowsNeedingAttention.length },
                        ].map((item) => {
                            const active = filter === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setFilter(item.id as ThirdPartyFilter)}
                                    className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border transition-colors ${active
                                        ? 'border-[#F73C1C]/45 bg-[#F73C1C]/15 text-[#F73C1C]'
                                        : filterBtnBase
                                        }`}
                                >
                                    {item.label}
                                    <span className="font-semibold">{item.count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {rowsNeedingAttention.length > 0 && (
                        <div className={`rounded-lg border px-3 py-2.5 flex items-center justify-between gap-3 ${t('border-[#F59E0B]/25 bg-[#F59E0B]/10', 'border-[#F59E0B]/35 bg-[#F59E0B]/10')}`}>
                            <div className="min-w-0">
                                <p className={`text-[11px] font-semibold ${t('text-[#FCD34D]', 'text-[#9A6A00]')} inline-flex items-center gap-1.5`}>
                                    <ShieldAlert size={12} />
                                    Servizi da verificare
                                </p>
                                <p className={`text-[11px] mt-1 ${textSub}`}>
                                    Controlla provider non collegati o con configurazione incompleta.
                                </p>
                            </div>
                            <span className={`text-[11px] font-semibold ${t('text-[#FCD34D]', 'text-[#9A6A00]')}`}>{rowsNeedingAttention.length}</span>
                        </div>
                    )}

                    {filteredRows.length === 0 ? (
                        <div className={`rounded-lg border ${rowBorder} p-4 text-[12px] ${textSub}`}>
                            Nessun servizio trovato.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredRows.map((row) => {
                                const isSelected = selectedToolId === row.id;

                                return (
                                    <div
                                        key={row.id}
                                        onClick={() => onSelectToolId(row.id)}
                                        className={`border rounded-xl p-3 md:p-4 space-y-3 ${isSelected ? 'border-[#F73C1C]/45 bg-[#F73C1C]/10' : rowBorder}`}
                                    >
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                                                <input
                                                    value={row.serviceName}
                                                    onChange={(event) => updateRow(row.id, { serviceName: event.target.value })}
                                                    onFocus={() => onSelectToolId(row.id)}
                                                    placeholder="Nome servizio"
                                                    className={`w-full rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none`}
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => removeRow(row.id)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444]"
                                                >
                                                    <Trash2 size={12} />
                                                    Elimina
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={row.monthlyCostEur}
                                                onChange={(event) => {
                                                    const nextCost = Math.max(0, Number(event.target.value || 0));
                                                    updateRow(row.id, {
                                                        monthlyCostEur: nextCost,
                                                        billingType: nextCost > 0 ? 'paid' : 'free',
                                                    });
                                                }}
                                                className={`rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none`}
                                                placeholder="Costo EUR/mese"
                                            />

                                            <button
                                                onClick={() => updateRow(row.id, {
                                                    subscribed: !row.subscribed,
                                                    monthlyCostEur: row.subscribed ? 0 : row.monthlyCostEur,
                                                    billingType: row.subscribed ? 'free' : (row.monthlyCostEur > 0 ? 'paid' : 'free'),
                                                })}
                                                className={`rounded-md px-2.5 py-1.5 text-[12px] border text-left ${row.subscribed ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]' : rowBorder}`}
                                            >
                                                Abbonato: {row.subscribed ? 'Si' : 'No'}
                                            </button>

                                            <button
                                                onClick={() => updateRow(row.id, { connected: !row.connected })}
                                                className={`rounded-md px-2.5 py-1.5 text-[12px] border text-left ${row.connected ? 'border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]' : rowBorder}`}
                                            >
                                                Operativo: {row.connected ? 'Si' : 'No'}
                                            </button>

                                            <button
                                                onClick={() => openProviderUrl(row.url)}
                                                disabled={!row.url.trim()}
                                                className={`inline-flex items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] ${subtleBtn} disabled:opacity-40`}
                                            >
                                                <ExternalLink size={12} />
                                                Apri
                                            </button>
                                        </div>

                                        <details className={`rounded-lg border ${rowBorder} p-2.5`}>
                                            <summary className={`cursor-pointer text-[11px] font-semibold ${textSub}`}>Dettagli facoltativi</summary>
                                            <div className="mt-2 space-y-2">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <input
                                                        value={row.vendor}
                                                        onChange={(event) => updateRow(row.id, { vendor: event.target.value })}
                                                        placeholder="Vendor"
                                                        className={`rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none`}
                                                    />
                                                    <input
                                                        value={row.url}
                                                        onChange={(event) => updateRow(row.id, { url: event.target.value })}
                                                        placeholder="https://provider.ai"
                                                        className={`rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none`}
                                                    />
                                                </div>
                                                <textarea
                                                    value={row.notes}
                                                    onChange={(event) => updateRow(row.id, { notes: event.target.value })}
                                                    placeholder="Nota interna"
                                                    rows={2}
                                                    className={`w-full rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none resize-y`}
                                                />
                                            </div>
                                        </details>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}