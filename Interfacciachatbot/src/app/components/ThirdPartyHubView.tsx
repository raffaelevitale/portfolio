import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Plus, Search, Trash2, Wallet } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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

function loadRowsFromStorage(): ThirdPartyToolRow[] {
    if (typeof window === 'undefined') return getSeededThirdPartyRows();
    const stored = parseThirdPartyRows(window.localStorage.getItem(THIRD_PARTY_ROWS_STORAGE_KEY));
    return stored && stored.length > 0 ? stored : getSeededThirdPartyRows();
}

export function ThirdPartyHubView({ selectedToolId, onSelectToolId }: ThirdPartyHubViewProps) {
    const { t } = useTheme();

    const [rows, setRows] = useState<ThirdPartyToolRow[]>(loadRowsFromStorage);
    const [search, setSearch] = useState('');

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
        () => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
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

    const totalMonthlySpend = rows.reduce((sum, row) => sum + Math.max(0, row.monthlyCostEur), 0);

    const updateRow = (id: string, patch: Partial<ThirdPartyToolRow>) => {
        setRows((prev) => prev.map((row) => row.id === id ? { ...row, ...patch } : row));
    };

    const addRow = () => {
        const next: ThirdPartyToolRow = {
            ...createEmptyThirdPartyRow(),
            subscribed: true,
            connected: true,
        };
        setRows((prev) => [next, ...prev]);
        onSelectToolId(next.id);
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
    const panelBg = t('bg-[#141414] border-white/[0.05]', 'bg-white border-black/[0.08]');
    const textMain = t('text-white', 'text-[#111]');
    const textSub = t('text-[#888]', 'text-[#666]');
    const textMuted = t('text-[#666]', 'text-[#888]');
    const rowBorder = t('border-white/[0.06]', 'border-black/[0.08]');
    const rowHover = t('hover:bg-white/[0.02]', 'hover:bg-black/[0.02]');
    const inputBg = t('bg-[#1A1A1A] border-white/[0.08] text-[#EEE] placeholder:text-[#555]', 'bg-white border-black/[0.1] text-[#222] placeholder:text-[#999]');
    const subtleBtn = t('bg-white/[0.04] hover:bg-white/[0.08] text-[#DDD]', 'bg-black/[0.05] hover:bg-black/[0.1] text-[#333]');

    return (
        <div className={`flex flex-col flex-1 h-full min-w-0 overflow-y-auto ${pageBg}`}>
            <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-4 md:space-y-5">
                {/* Header essenziale */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div>
                        <h1 className={`text-[22px] md:text-[26px] font-bold ${textMain}`}>I miei abbonamenti AI</h1>
                        <p className={`text-[13px] mt-1 ${textSub}`}>
                            Un blocco note per tenere traccia dei servizi AI che usi e di quanto spendi ogni mese.
                        </p>
                    </div>
                    <button
                        onClick={addRow}
                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#F73C1C] hover:bg-[#e63518] text-white text-[13px] font-semibold transition-colors shrink-0"
                    >
                        <Plus size={14} />
                        Aggiungi servizio
                    </button>
                </div>

                {/* Riepilogo con breakdown top 3 */}
                <div className={`${panelBg} border rounded-xl p-4 relative overflow-hidden`}>
                    <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none opacity-60"
                        style={{
                            background: t(
                                'radial-gradient(600px 140px at -10% 0%, rgba(247,60,28,0.10) 0%, transparent 70%)',
                                'radial-gradient(600px 140px at -10% 0%, rgba(247,60,28,0.06) 0%, transparent 70%)',
                            ),
                        }}
                    />
                    <div className="relative flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Wallet size={12} className={textMuted} />
                                <span className={`text-[10.5px] uppercase tracking-[0.6px] font-semibold ${textMuted}`}>Spesa mensile stimata</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-[26px] md:text-[30px] font-bold ${textMain}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                                    {euroFormatter.format(totalMonthlySpend)}
                                </span>
                                <span className={`text-[12px] ${textMuted}`}>/ mese</span>
                            </div>
                        </div>
                        <div className={`text-[12px] ${textSub} text-right`}>
                            <div>{rows.length} {rows.length === 1 ? 'servizio' : 'servizi'} registrati</div>
                            <div className={`text-[11px] ${textMuted} mt-0.5`}>
                                {euroFormatter.format(totalMonthlySpend * 12)} / anno
                            </div>
                        </div>
                    </div>
                    {totalMonthlySpend > 0 && (
                        <div className="relative mt-3">
                            <div className={`flex h-1.5 w-full rounded-full overflow-hidden ${t('bg-white/[0.06]', 'bg-black/[0.06]')}`}>
                                {[...rows]
                                    .filter(r => r.monthlyCostEur > 0)
                                    .sort((a, b) => b.monthlyCostEur - a.monthlyCostEur)
                                    .slice(0, 5)
                                    .map((row, idx) => {
                                        const palette = ['#F73C1C', '#F59E0B', '#10B981', '#8B5CF6', '#3B82F6'];
                                        const pct = Math.max(2, (row.monthlyCostEur / totalMonthlySpend) * 100);
                                        return (
                                            <div
                                                key={row.id}
                                                title={`${row.serviceName || 'Servizio'} · ${euroFormatter.format(row.monthlyCostEur)}`}
                                                style={{ width: `${pct}%`, backgroundColor: palette[idx % palette.length] }}
                                            />
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cerca servizio, vendor o nota..."
                        className={`w-full rounded-lg pl-9 pr-3 py-2.5 text-[13px] border ${inputBg} outline-none focus:border-[#F73C1C]/40`}
                    />
                </div>

                {/* Lista */}
                {filteredRows.length === 0 ? (
                    <div className={`${panelBg} border rounded-xl px-4 py-10 text-center`}>
                        <p className={`text-[13px] ${textSub}`}>
                            {rows.length === 0 ? 'Non hai ancora registrato nessun servizio.' : 'Nessun risultato per questa ricerca.'}
                        </p>
                        {rows.length === 0 && (
                            <button
                                onClick={addRow}
                                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#F73C1C] border border-[#F73C1C]/30 hover:bg-[#F73C1C]/[0.06] transition-colors"
                            >
                                <Plus size={13} /> Aggiungi il primo
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={`${panelBg} border rounded-xl overflow-hidden`}>
                        <AnimatePresence initial={false}>
                        {filteredRows.map((row, index) => {
                            const isSelected = selectedToolId === row.id;
                            const isLast = index === filteredRows.length - 1;

                            return (
                                <motion.div
                                    key={row.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.18) }}
                                    onClick={() => onSelectToolId(row.id)}
                                    className={`flex flex-col md:flex-row md:items-center gap-3 px-4 py-3 transition-colors ${rowHover} ${!isLast ? `border-b ${rowBorder}` : ''} ${isSelected ? t('bg-white/[0.02]', 'bg-black/[0.02]') : ''}`}
                                >
                                    <input
                                        value={row.serviceName}
                                        onChange={(event) => updateRow(row.id, { serviceName: event.target.value })}
                                        onFocus={() => onSelectToolId(row.id)}
                                        placeholder="Nome servizio"
                                        className={`flex-1 min-w-0 rounded-md px-2.5 py-1.5 text-[13px] font-medium border ${inputBg} outline-none focus:border-[#F73C1C]/40`}
                                    />

                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={row.monthlyCostEur || ''}
                                                onChange={(event) => {
                                                    const nextCost = Math.max(0, Number(event.target.value || 0));
                                                    updateRow(row.id, {
                                                        monthlyCostEur: nextCost,
                                                        billingType: nextCost > 0 ? 'paid' : 'free',
                                                    });
                                                }}
                                                placeholder="0"
                                                className={`w-[88px] rounded-md pl-2.5 pr-7 py-1.5 text-[13px] border ${inputBg} outline-none focus:border-[#F73C1C]/40`}
                                            />
                                            <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[12px] ${textMuted}`}>€</span>
                                        </div>

                                        <input
                                            value={row.url}
                                            onChange={(event) => updateRow(row.id, { url: event.target.value })}
                                            placeholder="url o link"
                                            className={`hidden lg:block w-[180px] rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none focus:border-[#F73C1C]/40`}
                                        />

                                        <button
                                            onClick={(event) => { event.stopPropagation(); openProviderUrl(row.url); }}
                                            disabled={!row.url.trim()}
                                            title="Apri link"
                                            className={`inline-flex items-center justify-center p-1.5 rounded-md ${subtleBtn} disabled:opacity-30 disabled:cursor-not-allowed`}
                                        >
                                            <ExternalLink size={13} />
                                        </button>

                                        <button
                                            onClick={(event) => { event.stopPropagation(); removeRow(row.id); }}
                                            title="Elimina"
                                            className="inline-flex items-center justify-center p-1.5 rounded-md text-[#888] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>

                                    <input
                                        value={row.notes}
                                        onChange={(event) => updateRow(row.id, { notes: event.target.value })}
                                        placeholder="Nota (facoltativa)"
                                        className={`md:w-[200px] rounded-md px-2.5 py-1.5 text-[12px] border ${inputBg} outline-none focus:border-[#F73C1C]/40`}
                                    />
                                </motion.div>
                            );
                        })}
                        </AnimatePresence>
                    </div>
                )}

                <p className={`text-[11px] ${textMuted} text-center`}>
                    I dati sono salvati solo nel tuo browser. Nessun servizio esterno viene contattato senza il tuo click.
                </p>
            </div>
        </div>
    );
}
