import { Compass, Settings2, ShieldCheck, Wrench, Sun, Target, Heart, ChevronDown, Lock, Search, MessageCircle, LayoutDashboard, FileText, Cog, X, Link2, Sparkles } from 'lucide-react';
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

interface SidebarProps {
  ambiti: Ambito[];
  selectedModule: Module | null;
  onSelectModule: (mod: Module, ambitoId: string) => void;
  onToggleModule: (moduleId: string) => void;
  onShowLocked: (mod: Module) => void;
  activeSection: ThirdPartySection;
  onChangeSection: (section: ThirdPartySection) => void;
  onOpenThirdPartyAssistant: (toolId?: string) => void;
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
  onOpenThirdPartyAssistant,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { t } = useTheme();

  const loadThirdPartyRows = () => {
    if (typeof window === 'undefined') return getSeededThirdPartyRows();
    const stored = parseThirdPartyRows(window.localStorage.getItem(THIRD_PARTY_ROWS_STORAGE_KEY));
    return stored && stored.length > 0 ? stored : getSeededThirdPartyRows();
  };

  const [expandedAmbiti, setExpandedAmbiti] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [thirdPartyRows, setThirdPartyRows] = useState<ThirdPartyToolRow[]>(loadThirdPartyRows);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const isInternalSection = activeSection === 'internal';

  const findAmbitoForModule = (moduleId: string) =>
    ambiti.find(a => a.funzioni.some(f => f.modules.some(m => m.id === moduleId)));

  useEffect(() => {
    if (selectedModule) {
      const parentAmbito = findAmbitoForModule(selectedModule.id);
      if (parentAmbito && !expandedAmbiti.has(parentAmbito.id)) {
        setExpandedAmbiti(prev => new Set(prev).add(parentAmbito.id));
      }
    }
  }, [selectedModule?.id]);

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
    setExpandedAmbiti(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasSearch = search.trim().length > 0;
  const normalizedSearch = search.toLowerCase();

  const filteredAmbiti = ambiti.map(a => ({
    ...a,
    funzioni: a.funzioni.map(f => ({
      ...f,
      modules: f.modules.filter(m =>
        m.name.toLowerCase().includes(normalizedSearch)
      ),
    })).filter(f => f.modules.length > 0),
  })).filter(a => a.funzioni.length > 0);

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

  const connectedThirdPartyRows = thirdPartyRows.filter(row => row.connected);
  const activeThirdPartySubscriptions = thirdPartyRows.filter(row => row.connected && row.subscribed).length;

  const sidebarContent = (
    <div
      className={`flex flex-col h-full w-[260px] shrink-0 border-r ${borderCls} overflow-hidden`}
      style={{ backgroundColor: sidebarBg }}
    >
      {/* Search */}
      <div className={`px-3 py-2.5 border-b ${borderCls}`}>
        <div className={`flex items-center gap-2 ${inputBg} rounded-md px-2.5 py-1.5 border ${borderCls} focus-within:border-[#F73C1C]/30 transition-colors`}>
          <Search size={13} className={textMuted} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={isInternalSection ? 'Cerca moduli ecosistema...' : 'Cerca provider...'}
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

        {isInternalSection && filteredAmbiti.map(ambito => {
          const isExpanded = hasSearch || expandedAmbiti.has(ambito.id);
          const AmbitoIcon = iconMap[ambito.iconName] || Compass;
          const hasSelectedModule = ambito.funzioni.some(f =>
            f.modules.some(m => m.id === selectedModule?.id)
          );
          const activeModuleCount = ambito.funzioni.reduce((sum, f) =>
            sum + f.modules.filter(m => m.purchased && m.active).length, 0
          );

          return (
            <div key={ambito.id}>
              <button
                onClick={() => !hasSearch && toggleAmbito(ambito.id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-left transition-colors group ${hoverBg} ${hasSelectedModule && !hasSearch ? activeBg : ''}`}
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md shrink-0"
                  style={{ backgroundColor: ambito.color + '20' }}
                >
                  <AmbitoIcon size={14} style={{ color: ambito.color }} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={`text-[13px] font-semibold ${textMain} truncate leading-tight`}>{ambito.name}</span>
                  <span className={`text-[11px] ${textSub} truncate leading-tight`}>{ambito.subtitle}</span>
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
              </button>

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
                          <div className="relative py-1 pr-2 pl-4">
                            <span className={`pointer-events-none absolute left-0 top-1/2 h-0 w-3 -translate-y-1/2 border-t ${treeLine}`} />
                            <span className={`text-[9px] font-semibold ${textMuted} uppercase tracking-[1.2px]`}>
                              {funzione.name}
                            </span>
                          </div>
                          <div className="pb-0.5">
                            {funzione.modules.map(mod => {
                              const isSelected = selectedModule?.id === mod.id;
                              const ModIcon = typeIconMap[mod.type] || MessageCircle;
                              const isLocked = !mod.purchased;

                              return (
                                <div
                                  key={mod.id}
                                  ref={isSelected ? selectedRef : undefined}
                                  className={`relative flex items-center gap-2 w-full pl-5 pr-2 py-1.5 text-left transition-all text-[12px] rounded-r-md ${isSelected
                                    ? `${activeBg} font-semibold`
                                    : hoverBg
                                    } ${isLocked ? 'opacity-50' : ''}`}
                                >
                                  <span className={`pointer-events-none absolute left-0 top-1/2 h-0 w-3 -translate-y-1/2 border-t ${treeLine}`} />
                                  {isSelected && (
                                    <motion.div
                                      layoutId="sidebar-active-indicator"
                                      className="absolute left-0 top-[3px] bottom-[3px] w-[2px] rounded-r-full bg-[#F73C1C]"
                                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                  )}
                                  <button
                                    onClick={() => {
                                      if (isLocked) onShowLocked(mod);
                                      else handleSelectModule(mod, ambito.id);
                                    }}
                                    className="flex items-center gap-2 flex-1 min-w-0 text-[11px] leading-tight"
                                  >
                                    <ModIcon
                                      size={13}
                                      className={`shrink-0 transition-colors ${isSelected ? 'text-[#F73C1C]' : textSub}`}
                                    />
                                    <span className={`flex-1 truncate transition-colors text-left text-[11px] leading-tight ${isSelected ? 'text-[#F73C1C]' : textSub} ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                                      {mod.name}
                                    </span>
                                  </button>
                                  {isLocked && <Lock size={12} className={textMuted} />}
                                  {!isLocked && (
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        onToggleModule(mod.id);
                                      }}
                                      className={`relative w-[34px] h-[18px] rounded-full transition-colors shrink-0 ${mod.active ? 'bg-[#10B981]' : t('bg-[#333]', 'bg-[#ccc]')
                                        }`}
                                      title={mod.active ? 'Disattiva' : 'Attiva'}
                                    >
                                      <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${mod.active ? 'left-[18px]' : 'left-[2px]'
                                        }`} />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {!isInternalSection && (
          <div className="px-3 py-2.5 space-y-2.5">
            <div className={`rounded-lg border ${accentBorder} ${subtleBg} p-2.5`}>
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-[#F73C1C]" />
                <span className={`text-[11px] font-semibold ${textMain}`}>Assistente Integrato</span>
              </div>
              <p className={`text-[11px] mt-2 ${textMuted}`}>
                Usa ChatGPT direttamente dentro CRYBU con una configurazione guidata lato azienda.
              </p>
              <div className="mt-2">
                <button
                  onClick={() => {
                    onOpenThirdPartyAssistant('seed-chatgpt');
                    onCloseMobile();
                  }}
                  className="w-full text-[11px] py-1.5 rounded-md font-semibold transition-colors bg-[#F73C1C] hover:bg-[#e63518] text-white"
                >
                  Apri ChatGPT in Dashboard
                </button>
              </div>
            </div>

            <div className={`rounded-lg border ${accentBorder} p-2.5`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${textMain}`}>Accesso rapido prompt</span>
                <span className={`text-[10px] ${textMuted}`}>{connectedThirdPartyRows.length} connessi</span>
              </div>

              {connectedThirdPartyRows.length === 0 ? (
                <p className={`text-[11px] ${textMuted} mt-2`}>Connetti un provider nella vista Terze parti per abilitarne il prompt interno.</p>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {connectedThirdPartyRows.slice(0, 5).map(row => (
                    <button
                      key={row.id}
                      onClick={() => {
                        onOpenThirdPartyAssistant(row.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md transition-colors ${hoverBg}`}
                    >
                      <div className="min-w-0 text-left">
                        <p className={`text-[11px] font-medium ${textMain} truncate`}>{row.serviceName || 'Servizio esterno'}</p>
                        <p className={`text-[10px] ${textMuted} truncate`}>{row.vendor || 'Vendor non definito'}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#F73C1C] shrink-0">
                        <Link2 size={11} />
                        Prompt
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`px-3 py-2 border-t ${borderCls}`}>
        <div className={`grid grid-cols-2 gap-1 p-1 rounded-lg ${subtleBg}`}>
          <button
            onClick={() => {
              setSearch('');
              onChangeSection('internal');
            }}
            className={`text-[11px] py-1.5 rounded-md font-semibold transition-colors ${isInternalSection ? t('bg-white/[0.12] text-white', 'bg-black/[0.1] text-[#111]') : textMuted}`}
          >
            Ecosistema
          </button>
          <button
            onClick={() => {
              setSearch('');
              onChangeSection('third-party');
            }}
            className={`text-[11px] py-1.5 rounded-md font-semibold transition-colors ${!isInternalSection ? t('bg-white/[0.12] text-white', 'bg-black/[0.1] text-[#111]') : textMuted}`}
          >
            Terze parti
          </button>
        </div>

        <div className="mt-2 px-0.5">
          {isInternalSection ? (
            <span className={`text-[11px] font-medium ${textMuted}`}>Ecosistema: {activeInternalModules} moduli attivi</span>
          ) : (
            <span className={`text-[11px] font-medium ${textMuted}`}>Terze parti: {activeThirdPartySubscriptions} abbonamenti attivi</span>
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
          <div className="md:hidden fixed inset-0 z-40" style={{ top: '52px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
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
