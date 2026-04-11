import { Compass, Settings2, ShieldCheck, Wrench, Sun, Target, Heart, ChevronDown, Lock, Search, MessageCircle, LayoutDashboard, FileText, Cog, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import type { Ambito, Module } from './data';
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
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ ambiti, selectedModule, onSelectModule, onToggleModule, onShowLocked, isMobileOpen, onCloseMobile }: SidebarProps) {
  const { t } = useTheme();
  const [expandedAmbiti, setExpandedAmbiti] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

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

  const toggleAmbito = (id: string) => {
    setExpandedAmbiti(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasSearch = search.trim().length > 0;

  const filteredAmbiti = ambiti.map(a => ({
    ...a,
    funzioni: a.funzioni.map(f => ({
      ...f,
      modules: f.modules.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
      ),
    })).filter(f => f.modules.length > 0),
  })).filter(a => a.funzioni.length > 0);

  const handleSelectModule = (mod: Module, ambitoId: string) => {
    onSelectModule(mod, ambitoId);
    onCloseMobile();
  };

  const sidebarBg = t('#141414', '#FFFFFF');
  const borderCls = t('border-white/[0.06]', 'border-black/[0.08]');
  const textMain = t('text-white', 'text-[#111]');
  const textSub = t('text-[#888]', 'text-[#666]');
  const textMuted = t('text-[#555]', 'text-[#999]');
  const hoverBg = t('hover:bg-white/[0.04]', 'hover:bg-black/[0.04]');
  const activeBg = t('bg-white/[0.06]', 'bg-black/[0.04]');
  const inputBg = t('bg-[#1E1E1E]', 'bg-[#F5F5F5]');
  const inputText = t('text-[#ccc] placeholder:text-[#555]', 'text-[#222] placeholder:text-[#bbb]');

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
            placeholder="Cerca moduli..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`bg-transparent text-[12px] ${inputText} outline-none flex-1 min-w-0`}
          />
          {hasSearch && (
            <button onClick={() => setSearch('')} className={`${textMuted} hover:text-[#F73C1C] transition-colors`}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Ambiti list */}
      <div className="flex-1 overflow-y-auto py-0.5 scrollbar-thin">
        {filteredAmbiti.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-8 px-4 ${textMuted} text-center`}>
            <Search size={18} className="mb-2 opacity-40" />
            <span className="text-[11px]">Nessun modulo trovato</span>
            <button onClick={() => setSearch('')} className="text-[11px] text-[#F73C1C] mt-1 hover:underline">
              Cancella ricerca
            </button>
          </div>
        )}

        {filteredAmbiti.map(ambito => {
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
                className={`flex items-center gap-2 w-full px-3 py-2 text-left transition-colors group ${hoverBg} ${hasSelectedModule && !hasSearch ? activeBg : ''}`}
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md shrink-0"
                  style={{ backgroundColor: ambito.color + '20' }}
                >
                  <AmbitoIcon size={15} style={{ color: ambito.color }} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={`text-[13px] font-semibold ${textMain} truncate leading-tight`}>{ambito.name}</span>
                  <span className={`text-[10.5px] ${textMuted} truncate leading-tight`}>{ambito.subtitle}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeModuleCount > 0 && !isExpanded && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: ambito.color + '18', color: ambito.color }}>
                      {activeModuleCount}
                    </span>
                  )}
                  {!hasSearch && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
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
                    <div className="pb-1">
                      {ambito.funzioni.map(funzione => (
                        <div key={funzione.id}>
                          <div className="px-3 py-1 ml-6">
                            <span className={`text-[9px] font-semibold ${textMuted} uppercase tracking-[1.2px]`}>
                              {funzione.name}
                            </span>
                          </div>
                          {funzione.modules.map(mod => {
                            const isSelected = selectedModule?.id === mod.id;
                            const ModIcon = typeIconMap[mod.type] || MessageCircle;
                            const isLocked = !mod.purchased;

                            return (
                              <div
                                key={mod.id}
                                ref={isSelected ? selectedRef : undefined}
                                className={`flex items-center gap-1.5 w-full pl-10 pr-3 py-1.5 text-left transition-all text-[10px] relative ${
                                  isSelected
                                    ? `${activeBg} font-semibold`
                                    : hoverBg
                                } ${isLocked ? 'opacity-50' : ''}`}
                              >
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
                                  className="flex items-center gap-1.5 flex-1 min-w-0"
                                >
                                  <ModIcon
                                    size={12}
                                    className={`shrink-0 transition-colors ${isSelected ? 'text-[#F73C1C]' : textSub}`}
                                  />
                                  <span className={`flex-1 truncate transition-colors text-left ${isSelected ? 'text-[#F73C1C]' : textSub}`}>
                                    {mod.name}
                                  </span>
                                </button>
                                {isLocked && <Lock size={10} className={textMuted} />}
                                {!isLocked && (
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      onToggleModule(mod.id);
                                    }}
                                    className={`relative w-[24px] h-[13px] rounded-full transition-colors shrink-0 ${
                                      mod.active ? 'bg-[#10B981]' : t('bg-[#333]', 'bg-[#ccc]')
                                    }`}
                                    title={mod.active ? 'Disattiva' : 'Attiva'}
                                  >
                                    <div className={`absolute top-[2px] w-[9px] h-[9px] rounded-full bg-white shadow-sm transition-transform ${
                                      mod.active ? 'left-[13px]' : 'left-[2px]'
                                    }`} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={`px-3 py-2 border-t ${borderCls}`}>
        <span className={`text-[10px] ${textMuted}`}>
          {ambiti.flatMap(a => a.funzioni.flatMap(f => f.modules)).filter(m => m.purchased && m.active).length} moduli attivi
        </span>
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
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
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
