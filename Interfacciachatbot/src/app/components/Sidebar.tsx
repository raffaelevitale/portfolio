import { Compass, Settings2, ShieldCheck, Wrench, Sun, Target, Heart, ChevronDown, Lock, Search, MessageCircle, LayoutDashboard, FileText, Cog, X, Activity, Mail, Database, Globe, Bot, Server, BarChart3, GitBranch, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import type { Ambito, Module } from './data';
import {
  THIRD_PARTY_ROWS_STORAGE_KEY,
  THIRD_PARTY_ROWS_UPDATED_EVENT,
  getSeededThirdPartyRows,
  parseThirdPartyRows,
  type ThirdPartySection,
  type ThirdPartyToolRow,
} from './thirdPartyProviders';
import { useTheme } from './ThemeContext';
import { getAmbitoIconSrc } from '../icone';

const iconMap: Record<string, React.ElementType> = {
  compass: Compass,
  cog: Cog,
  shield: ShieldCheck,
  wrench: Wrench,
  sun: Sun,
  target: Target,
  heart: Heart,
};

const typeIconMap: Record<string, React.ElementType> = {
  chat: MessageCircle,
  dashboard: LayoutDashboard,
  settings: Settings2,
  files: FileText,
};

const moduleKeywordIconMap: Array<{ pattern: RegExp; Icon: React.ElementType }> = [
  { pattern: /(instrad|routing|smistament)/i, Icon: GitBranch },
  { pattern: /(email|mail)/i, Icon: Mail },
  { pattern: /(dati|data|estrazione|document)/i, Icon: Database },
  { pattern: /(api|web|rpa)/i, Icon: Globe },
  { pattern: /(agente|assistente|chatbot)/i, Icon: Bot },
  { pattern: /(server|mcp)/i, Icon: Server },
  { pattern: /(kpi|analisi|monitoraggio|trend|report|profilazione)/i, Icon: BarChart3 },
];

const ambitoListVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const ambitoItemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
};

function resolveModuleIcon(mod: Module): React.ElementType {
  const semanticMatch = moduleKeywordIconMap.find(({ pattern }) => pattern.test(mod.name));
  if (semanticMatch) return semanticMatch.Icon;
  return typeIconMap[mod.type] || MessageCircle;
}

interface SidebarProps {
  ambiti: Ambito[];
  selectedModule: Module | null;
  onSelectModule: (mod: Module, ambitoId: string) => void;
  onToggleModule: (moduleId: string) => void;
  onShowLocked: (mod: Module) => void;
  activeSection: ThirdPartySection;
  onChangeSection: (section: ThirdPartySection) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  ambiti,
  selectedModule,
  onSelectModule,
  onToggleModule,
  onShowLocked,
  activeSection,
  onChangeSection,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { t } = useTheme();

  const loadThirdPartyRows = () => {
    if (typeof window === 'undefined') return getSeededThirdPartyRows();
    const stored = parseThirdPartyRows(window.localStorage.getItem(THIRD_PARTY_ROWS_STORAGE_KEY));
    return stored && stored.length > 0 ? stored : getSeededThirdPartyRows();
  };

  const [expandedAmbitoId, setExpandedAmbitoId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [onlyActive, setOnlyActive] = useState(false);
  const [thirdPartyRows, setThirdPartyRows] = useState<ThirdPartyToolRow[]>(loadThirdPartyRows);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const isInternalSection = activeSection === 'internal';

  const hasSearch = search.trim().length > 0;
  const normalizedSearch = search.toLowerCase();

  useEffect(() => {
    if (!isInternalSection) {
      setExpandedAmbitoId(null);
      return;
    }

    if (!selectedModule) {
      if (!hasSearch) {
        setExpandedAmbitoId(null);
      }
      return;
    }

    const parentAmbito = ambiti.find(a => a.funzioni.some(f => f.modules.some(m => m.id === selectedModule.id)));
    if (parentAmbito) {
      setExpandedAmbitoId(parentAmbito.id);
    }
  }, [ambiti, hasSearch, isInternalSection, selectedModule]);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedModule?.id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncRows = () => setThirdPartyRows(loadThirdPartyRows());
    syncRows();

    window.addEventListener('storage', syncRows);
    window.addEventListener(THIRD_PARTY_ROWS_UPDATED_EVENT, syncRows);

    return () => {
      window.removeEventListener('storage', syncRows);
      window.removeEventListener(THIRD_PARTY_ROWS_UPDATED_EVENT, syncRows);
    };
  }, []);

  const toggleAmbito = (id: string) => {
    setExpandedAmbitoId(prev => (prev === id ? null : id));
  };

  const ambitoDisplayOrder = ['orion', 'aegis', 'enso', 'goji', 'luma', 'sophia', 'talos', 'kora', 'sentra'];
  const ambitoOrderIndex = new Map(ambitoDisplayOrder.map((id, index) => [id, index]));
  const orderedAmbiti = [...ambiti].sort((a, b) => {
    const aIndex = ambitoOrderIndex.get(a.id);
    const bIndex = ambitoOrderIndex.get(b.id);

    if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;
    return a.name.localeCompare(b.name, 'it');
  });

  const filteredAmbiti = orderedAmbiti.map(a => ({
    ...a,
    funzioni: a.funzioni.map(f => ({
      ...f,
      modules: f.modules.filter(m => {
        if (!m.name.toLowerCase().includes(normalizedSearch)) return false;
        if (onlyActive && !(m.purchased && m.active)) return false;
        return true;
      }),
    })).filter(f => f.modules.length > 0),
  })).filter(a => a.funzioni.length > 0);

  const trackedThirdPartyRows = thirdPartyRows.filter(row => row.subscribed || row.connected);
  const filteredThirdPartyRows = trackedThirdPartyRows.filter((row) => {
    if (!normalizedSearch) return true;
    return [row.serviceName, row.vendor, row.notes].join(' ').toLowerCase().includes(normalizedSearch);
  });

  const handleSelectModule = (mod: Module, ambitoId: string) => {
    onSelectModule(mod, ambitoId);
    onCloseMobile();
  };

  const activeInternalModules = ambiti.flatMap(a => a.funzioni.flatMap(f => f.modules)).filter(m => m.purchased && m.active).length;

  const sidebarBg = t('#141414', '#FFFFFF');
  const borderCls = t('border-white/[0.06]', 'border-black/[0.08]');
  const textMain = t('text-white', 'text-[#111]');
  const textSub = t('text-[#888]', 'text-[#666]');
  const textMuted = t('text-[#555]', 'text-[#999]');
  const hoverBg = t('hover:bg-white/[0.04]', 'hover:bg-black/[0.04]');
  const activeBg = t('bg-white/[0.06]', 'bg-black/[0.04]');
  const subtleBg = t('bg-white/[0.03]', 'bg-black/[0.03]');
  const inputBg = t('bg-[#1E1E1E]', 'bg-[#F5F5F5]');
  const inputText = t('text-[#ccc] placeholder:text-[#555]', 'text-[#222] placeholder:text-[#bbb]');
  const treeLine = t('border-white/[0.16]', 'border-black/[0.16]');
  const treeToggleBg = t('bg-white/[0.05]', 'bg-black/[0.05]');
  const accentBorder = t('border-white/[0.08]', 'border-black/[0.1]');

  const activeThirdPartySubscriptions = thirdPartyRows.filter(row => row.subscribed).length;
  const connectedThirdPartyProviders = thirdPartyRows.filter(row => row.connected).length;
  const thirdPartySetupPending = thirdPartyRows.filter(row => row.subscribed && !row.connected).length;
  const thirdPartyMonthlySpend = thirdPartyRows.reduce((sum, row) => {
    if (!row.subscribed) return sum;
    return sum + Math.max(0, row.monthlyCostEur);
  }, 0);

  const prioritizedThirdPartyRows = [...filteredThirdPartyRows].sort((a, b) => {
    if (a.connected !== b.connected) return Number(b.connected) - Number(a.connected);
    if (a.subscribed !== b.subscribed) return Number(b.subscribed) - Number(a.subscribed);
    return (a.serviceName || '').localeCompare(b.serviceName || '', 'it');
  });

  const readSidebarWidth = () => {
    if (typeof window === 'undefined') return 276;
    const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue('--layout-sidebar-w').trim();
    const parsed = Number.parseFloat(rawValue);
    return Number.isFinite(parsed) ? parsed : 276;
  };
  const [sidebarWidth, setSidebarWidth] = useState(readSidebarWidth);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncSidebarWidth = () => setSidebarWidth(readSidebarWidth());
    syncSidebarWidth();
    window.addEventListener('resize', syncSidebarWidth);
    return () => window.removeEventListener('resize', syncSidebarWidth);
  }, []);

  const sidebarContent = (
    <div
      className={`flex flex-col h-full w-[var(--layout-sidebar-w)] shrink-0 border-r ${borderCls} overflow-hidden`}
      style={{ backgroundColor: sidebarBg }}
    >
      {/* Branding header */}
      <div className={`flex items-center justify-between px-3.5 py-2.5 border-b ${borderCls}`}>
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-[#F73C1C] to-[#c82a0e] shadow-[0_0_0_1px_rgba(247,60,28,0.25),0_4px_12px_-4px_rgba(247,60,28,0.4)]">
            <span className="text-[10px] font-black text-white tracking-tighter leading-none" style={{ fontFamily: '"JetBrains Mono", monospace' }}>CC</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className={`text-[10.5px] font-bold tracking-[0.4px] ${textMain}`}>CRYBU CC</span>
            <span className={`text-[8.5px] font-medium ${textMuted} uppercase tracking-[0.6px] leading-none`}>Control Center</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-medium ${textMuted}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            {activeInternalModules}
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          </span>
        </div>
      </div>

      {/* Search + filter */}
      <div className={`px-3 py-2.5 border-b ${borderCls} space-y-1.5`}>
        <div className={`flex items-center gap-2 ${inputBg} rounded-md px-2.5 py-1.5 border ${borderCls} focus-within:border-[#F73C1C]/30 transition-colors`}>
          <Search size={13} className={textMuted} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={isInternalSection ? 'Cerca modulo o processo...' : 'Cerca sottoscrizione...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`bg-transparent text-[13px] ${inputText} outline-none flex-1 min-w-0`}
          />
          {hasSearch && (
            <button onClick={() => setSearch('')} className={`${textMuted} hover:text-[#F73C1C] transition-colors`}>
              <X size={12} />
            </button>
          )}
        </div>
        {isInternalSection && (
          <div className="flex items-center gap-1.5">
            <motion.button
              onClick={() => setOnlyActive(prev => !prev)}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                onlyActive
                  ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25'
                  : `${subtleBg} ${textMuted} border ${borderCls} hover:${textSub}`
              }`}
              title="Mostra solo moduli attivi"
            >
              <Filter size={10} />
              {onlyActive ? 'Solo attivi' : 'Tutti'}
            </motion.button>
            {onlyActive && (
              <span className={`text-[10px] ${textMuted}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {activeInternalModules} moduli
              </span>
            )}
          </div>
        )}
      </div>

      {/* Ambiti list */}
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
        {isInternalSection && filteredAmbiti.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-8 px-4 ${textMuted} text-center`}>
            <Search size={16} className="mb-2 opacity-40" />
            <span className="text-[13px]">Nessun modulo trovato</span>
            <button onClick={() => setSearch('')} className="text-[13px] text-[#F73C1C] mt-1 hover:underline">
              Cancella ricerca
            </button>
          </div>
        )}

        {isInternalSection && (
          <motion.div variants={ambitoListVariants} initial="hidden" animate="show">
            {filteredAmbiti.map(ambito => {
              const isExpanded = hasSearch || expandedAmbitoId === ambito.id;
              const AmbitoIcon = iconMap[ambito.iconName] || Compass;
              const ambitoIconSrc = getAmbitoIconSrc(ambito.id);
              const hasSelectedModule = ambito.funzioni.some(f =>
                f.modules.some(m => m.id === selectedModule?.id)
              );
              const activeModuleCount = ambito.funzioni.reduce((sum, f) =>
                sum + f.modules.filter(m => m.purchased && m.active).length, 0
              );

              return (
                <motion.div key={ambito.id} variants={ambitoItemVariants}>
                  <motion.button
                    onClick={() => !hasSearch && toggleAmbito(ambito.id)}
                    whileHover={{ x: 1.5 }}
                    whileTap={{ scale: 0.995 }}
                    className={`relative flex items-start gap-2.5 w-full px-3 py-2 text-left transition-all group ${hoverBg}`}
                    style={hasSelectedModule && !hasSearch ? { backgroundColor: ambito.color + '0C' } : undefined}
                  >
                    {hasSelectedModule && !hasSearch && (
                      <motion.div
                        layoutId="sidebar-ambito-accent"
                        className="absolute left-0 top-[4px] bottom-[4px] w-[2.5px] rounded-r-full"
                        style={{ backgroundColor: ambito.color }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-md shrink-0 transition-all"
                      style={{
                        backgroundColor: ambito.color + (isExpanded || hasSelectedModule ? '28' : '1A'),
                        boxShadow: isExpanded || hasSelectedModule ? `0 0 0 1px ${ambito.color}25` : 'none',
                      }}
                    >
                      {ambitoIconSrc ? (
                        <img src={ambitoIconSrc} alt={ambito.name} className="h-4 w-4 rounded-[4px] object-contain" />
                      ) : (
                        <AmbitoIcon size={14} style={{ color: ambito.color }} />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                      <span
                        className={`text-[13px] font-semibold leading-tight line-clamp-1 transition-colors ${hasSelectedModule && !hasSearch ? '' : textMain}`}
                        style={hasSelectedModule && !hasSearch ? { color: ambito.color } : undefined}
                      >
                        {ambito.name}
                      </span>
                      <span className={`text-[11px] ${textSub} leading-tight line-clamp-2`}>{ambito.subtitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {activeModuleCount > 0 && !isExpanded && (
                        <span className="text-[11px] font-bold px-1.5 py-px rounded-full" style={{ backgroundColor: ambito.color + '18', color: ambito.color }}>
                          {activeModuleCount}
                        </span>
                      )}
                      {!hasSearch && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 0 : -90 }}
                          transition={{ duration: 0.2 }}
                          className={`flex h-5 w-5 items-center justify-center rounded-md ${treeToggleBg}`}
                        >
                          <ChevronDown size={13} className={textMuted} />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key={`content-${ambito.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-1 pt-0.5">
                          {ambito.funzioni.map(funzione => (
                            <div key={funzione.id} className={`ml-5 mb-1 border-l ${treeLine}`}>
                              <div className="relative py-0.5 pr-2 pl-4">
                                <span className={`pointer-events-none absolute left-0 top-1/2 h-0 w-3 -translate-y-1/2 border-t ${treeLine}`} />
                                <span className={`text-[10px] font-semibold ${textMuted} normal-case tracking-[0.6px]`}>
                                  {funzione.name}
                                </span>
                              </div>
                              <div className="pb-0.5">
                                {funzione.modules.map(mod => {
                                  const isSelected = selectedModule?.id === mod.id;
                                  const ModIcon = resolveModuleIcon(mod);
                                  const isLocked = !mod.purchased;

                                  return (
                                    <motion.div
                                      key={mod.id}
                                      ref={isSelected ? selectedRef : undefined}
                                      className={`relative flex items-center gap-2 w-full pl-5 pr-2 py-1.5 text-left transition-all text-[12px] rounded-r-md ${isSelected ? 'font-semibold' : hoverBg} ${isLocked ? 'opacity-50' : ''}`}
                                      style={isSelected ? { backgroundColor: ambito.color + '10' } : undefined}
                                      whileHover={{ x: 1 }}
                                      transition={{ duration: 0.14 }}
                                    >
                                      <span className={`pointer-events-none absolute left-0 top-1/2 h-0 w-3 -translate-y-1/2 border-t ${treeLine}`} />
                                      {isSelected && (
                                        <motion.div
                                          layoutId="sidebar-active-indicator"
                                          className="absolute left-0 top-[3px] bottom-[3px] w-[2px] rounded-r-full"
                                          style={{ backgroundColor: ambito.color }}
                                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                      )}
                                      <motion.button
                                        onClick={() => {
                                          if (isLocked) onShowLocked(mod);
                                          else handleSelectModule(mod, ambito.id);
                                        }}
                                        whileTap={{ scale: 0.99 }}
                                        className="flex items-start gap-2 flex-1 min-w-0 text-[11px] leading-tight"
                                      >
                                        <ModIcon
                                          size={13}
                                          className={`shrink-0 mt-[2px] transition-colors ${isSelected ? '' : textSub}`}
                                          style={isSelected ? { color: ambito.color } : undefined}
                                        />
                                        <span
                                          className={`flex-1 transition-colors text-left text-[11px] leading-tight line-clamp-2 ${isSelected ? 'font-semibold' : `font-medium ${textSub}`}`}
                                          style={isSelected ? { color: ambito.color } : undefined}
                                        >
                                          {mod.name}
                                        </span>
                                      </motion.button>
                                      {isLocked && <Lock size={12} className={textMuted} />}
                                      {!isLocked && (
                                        <motion.button
                                          onClick={e => {
                                            e.stopPropagation();
                                            onToggleModule(mod.id);
                                          }}
                                          whileTap={{ scale: 0.92 }}
                                          className={`relative w-[34px] h-[18px] rounded-full transition-colors shrink-0 ${mod.active ? 'bg-[#10B981]' : t('bg-[#333]', 'bg-[#ccc]')
                                            }`}
                                          title={mod.active ? 'Disattiva' : 'Attiva'}
                                        >
                                          <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${mod.active ? 'left-[18px]' : 'left-[2px]'
                                            }`} />
                                        </motion.button>
                                      )}
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!isInternalSection && (
          <div className="px-3 py-2.5 space-y-2">
            <div className={`rounded-lg border ${accentBorder} ${subtleBg} p-3`}>
              <div className="flex items-center justify-between gap-2">
                <p className={`text-[11px] font-semibold ${textMain}`}>Sottoscrizioni in gestione centrale</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#10B981]">
                  <Activity size={11} />
                  Operativa
                </span>
              </div>
              <p className={`text-[11px] mt-2 ${textMuted}`}>
                In questa sezione la sidebar resta minimale: il lavoro operativo e nel pannello centrale.
              </p>

              <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                <div className={`rounded-md px-2 py-1.5 ${t('bg-white/[0.04]', 'bg-black/[0.04]')}`}>
                  <p className={`text-[10px] ${textMuted}`}>Spesa mese</p>
                  <p className={`text-[11px] font-semibold ${textMain}`}>EUR {thirdPartyMonthlySpend.toFixed(2)}</p>
                </div>
                <div className={`rounded-md px-2 py-1.5 ${t('bg-white/[0.04]', 'bg-black/[0.04]')}`}>
                  <p className={`text-[10px] ${textMuted}`}>Da completare</p>
                  <p className={`text-[11px] font-semibold ${thirdPartySetupPending > 0 ? 'text-[#F59E0B]' : textMain}`}>{thirdPartySetupPending}</p>
                </div>
              </div>
            </div>

            <div className={`rounded-lg border ${accentBorder} p-2.5`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${textMain}`}>Provider registrati</span>
                <span className={`text-[10px] ${textMuted}`}>{trackedThirdPartyRows.length} registrati</span>
              </div>

              {filteredThirdPartyRows.length === 0 ? (
                <p className={`text-[11px] ${textMuted} mt-2`}>Aggiungi la prima sottoscrizione nella dashboard Terze parti.</p>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {prioritizedThirdPartyRows.slice(0, 6).map(row => (
                    <div
                      key={row.id}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md ${subtleBg}`}
                    >
                      <div className="min-w-0 text-left">
                        <p className={`text-[11px] font-medium ${textMain} whitespace-normal break-words`}>{row.serviceName || 'Servizio esterno'}</p>
                        <p className={`text-[10px] ${textMuted} whitespace-normal break-words`}>{row.vendor || 'Vendor non definito'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {row.subscribed && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B]">ABB</span>}
                        {row.connected && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981]">ON</span>}
                        {row.subscribed && !row.connected && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B]">SETUP</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`px-3 pb-3 pt-2 border-t ${borderCls} space-y-2`}>
        <div className={`relative flex items-center p-0.5 rounded-lg ${subtleBg}`}>
          {/* Sliding indicator */}
          <motion.div
            className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-md ${t('bg-white/[0.10]', 'bg-black/[0.08]')}`}
            animate={{ x: isInternalSection ? 2 : 'calc(100% + 2px)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
          {(['internal', 'third-party'] as const).map((sec, idx) => (
            <motion.button
              key={sec}
              onClick={() => { setSearch(''); onChangeSection(sec); }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex-1 z-10 text-[11px] py-1.5 rounded-md font-semibold transition-colors ${(sec === 'internal') === isInternalSection
                  ? t('text-white', 'text-[#111]')
                  : textMuted
                }`}
            >
              {idx === 0 ? 'Ecosistema' : 'Sottoscrizioni'}
            </motion.button>
          ))}
        </div>

        <div className={`flex items-center justify-between px-0.5`}>
          <AnimatePresence mode="wait">
            <motion.span
              key={isInternalSection ? 'internal' : 'external'}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.18 }}
              className={`text-[10.5px] font-medium ${textMuted}`}
            >
              {isInternalSection
                ? `${activeInternalModules} moduli attivi`
                : `${activeThirdPartySubscriptions} abb · ${connectedThirdPartyProviders} operativi`}
            </motion.span>
          </AnimatePresence>
          {!isInternalSection && thirdPartySetupPending > 0 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B]">
              {thirdPartySetupPending} setup
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block h-full">{sidebarContent}</div>
      <AnimatePresence>
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-40" style={{ top: 'var(--layout-header-h)' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: -sidebarWidth }}
              animate={{ x: 0 }}
              exit={{ x: -sidebarWidth }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
