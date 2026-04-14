import { Compass, Settings2, ShieldCheck, Wrench, Sun, Target, Heart, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeContext';
import type { Ambito, Module } from './data';

const iconMap: Record<string, React.ElementType> = {
  compass: Compass, cog: Settings2, shield: ShieldCheck, wrench: Wrench, sun: Sun, target: Target, heart: Heart,
};

interface WelcomeScreenProps {
  ambiti: Ambito[];
  onSelectModule?: (mod: Module, ambitoId: string) => void;
  onShowLocked?: (mod: Module) => void;
}

export function WelcomeScreen({ ambiti, onSelectModule, onShowLocked }: WelcomeScreenProps) {
  const { t } = useTheme();

  const allModules = ambiti.flatMap(a => a.funzioni.flatMap(f => f.modules));
  const activeCount = allModules.filter(m => m.purchased && m.active).length;
  const totalCount = allModules.length;
  const purchasedCount = allModules.filter(m => m.purchased).length;

  const handleAmbitoClick = (ambito: Ambito) => {
    const firstPurchased = ambito.funzioni
      .flatMap(f => f.modules)
      .find(m => m.purchased);
    const firstModule = firstPurchased || ambito.funzioni[0]?.modules[0];
    if (!firstModule) return;

    if (!firstModule.purchased) {
      onShowLocked?.(firstModule);
    } else {
      onSelectModule?.(firstModule, ambito.id);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6 md:p-12 overflow-y-auto">
      <div className="max-w-xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 md:mb-10"
        >
          <h1 className={`text-[22px] md:text-[28px] font-bold ${t('text-white', 'text-[#111]')} mb-2`}>
            Bentornato, <span className="text-[#F73C1C]">Luciano</span>
          </h1>
          <p className={`text-[13px] md:text-[14px] ${t('text-[#777]', 'text-[#888]')}`}>
            Seleziona un sistema AI per iniziare a lavorare
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
          {[
            { label: 'Moduli attivi', value: activeCount, color: '#10B981' },
            { label: 'Acquistati', value: purchasedCount, color: '#F59E0B' },
            { label: 'Totali', value: totalCount, color: '#F73C1C' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className={`${t('bg-[#1A1A1A] border-white/[0.04]', 'bg-white border-black/[0.06]')} border rounded-xl p-4 text-center`}
            >
              <div className="text-[24px] md:text-[28px] font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className={`text-[11px] ${t('text-[#666]', 'text-[#999]')} mt-1`}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Ambiti overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className={`${t('bg-[#1A1A1A] border-white/[0.04]', 'bg-white border-black/[0.06]')} border rounded-xl p-4 md:p-5`}
        >
          <h3 className={`text-[13px] font-semibold ${t('text-[#888]', 'text-[#888]')} mb-3 uppercase tracking-wider`}>I tuoi sistemi AI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ambiti.map((a, i) => {
              const Icon = iconMap[a.iconName] || Compass;
              const modCount = a.funzioni.reduce((s, f) => s + f.modules.filter(m => m.purchased && m.active).length, 0);
              const totalMod = a.funzioni.reduce((s, f) => s + f.modules.length, 0);
              const isClickable = !!onSelectModule;
              return (
                <motion.button
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  whileHover={isClickable ? { scale: 1.02 } : undefined}
                  whileTap={isClickable ? { scale: 0.98 } : undefined}
                  onClick={() => isClickable && handleAmbitoClick(a)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${isClickable
                      ? `cursor-pointer ${t('hover:bg-white/[0.06]', 'hover:bg-black/[0.05]')}`
                      : 'cursor-default'
                    }`}
                >
                  <div className="flex items-center justify-center w-[30px] h-[30px] rounded-lg shrink-0" style={{ backgroundColor: a.color + '18' }}>
                    <Icon size={14} style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-semibold ${t('text-white', 'text-[#111]')} truncate`}>{a.name}</p>
                    <p className={`text-[10px] ${t('text-[#555]', 'text-[#aaa]')}`}>{a.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: a.color + '18', color: a.color }}>
                      {modCount}/{totalMod}
                    </span>
                    {isClickable && (
                      <ChevronRight size={13} className={t('text-[#444]', 'text-[#ccc]')} />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
