import { Compass, Settings2, ShieldCheck, Wrench, Sun, Target, Heart, ChevronRight, Sparkles, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeContext';
import type { Ambito, Module } from './data';
import { getAmbitoIconSrc } from '../icone';

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

  const getActualTotalForAmbito = (ambito: Ambito) => ambito.funzioni.reduce((s, f) => s + f.modules.length, 0);
  const getDeclaredTotalForAmbito = (ambito: Ambito) => ambito.declaredModuleCount ?? getActualTotalForAmbito(ambito);

  const allModules = ambiti.flatMap(a => a.funzioni.flatMap(f => f.modules));
  const activeCount = allModules.filter(m => m.purchased && m.active).length;
  const totalCount = ambiti.reduce((sum, ambito) => sum + getDeclaredTotalForAmbito(ambito), 0);
  const purchasedCount = allModules.filter(m => m.purchased).length;
  const operativityPercent = purchasedCount === 0 ? 0 : Math.round((activeCount / purchasedCount) * 100);

  const getSystemLabel = (subtitle: string) => subtitle.split(' - ')[0] ?? subtitle;

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
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold mb-3 bg-[#F73C1C]/10 text-[#F73C1C]">
            <Sparkles size={11} />
            Ciao Luciano, operativita attiva
          </div>
          <h1 className={`text-[22px] md:text-[28px] font-bold ${t('text-white', 'text-[#111]')} mb-2`}>
            Panoramica operativa
          </h1>
          <p className={`text-[13px] md:text-[14px] ${t('text-[#777]', 'text-[#888]')}`}>
            Stato moduli, progressione attivazioni e accesso rapido ai sistemi in un unico punto.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            className={`mt-4 rounded-xl border px-3 py-2 ${t('border-white/[0.06] bg-white/[0.03]', 'border-black/[0.08] bg-black/[0.02]')}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#10B981]">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                </span>
                Operativita in corso
              </span>
              <span className={`text-[11px] font-semibold ${t('text-white', 'text-[#111]')}`}>{operativityPercent}%</span>
            </div>
            <div className={`mt-2 h-[4px] w-full rounded-full ${t('bg-white/[0.08]', 'bg-black/[0.08]')}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${operativityPercent}%` }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="h-[4px] rounded-full bg-[#10B981]"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
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
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`${t('bg-[#1A1A1A] border-white/[0.04]', 'bg-white border-black/[0.06]')} border rounded-xl p-4 md:p-5 text-center`}
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
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <h3 className={`text-[14px] font-semibold ${t('text-white', 'text-[#111]')}`}>Sistemi AI</h3>
            <span className={`text-[11px] ${t('text-[#666]', 'text-[#888]')}`}>{activeCount}/{totalCount} moduli attivi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {ambiti.map((a, i) => {
              const Icon = iconMap[a.iconName] || Compass;
              const ambitoIconSrc = getAmbitoIconSrc(a.id);
              const modCount = a.funzioni.reduce((s, f) => s + f.modules.filter(m => m.purchased && m.active).length, 0);
              const totalMod = getDeclaredTotalForAmbito(a);
              const systemLabel = getSystemLabel(a.subtitle);
              const isClickable = !!onSelectModule && getActualTotalForAmbito(a) > 0;

              return (
                <motion.button
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  whileHover={isClickable ? { scale: 1.01 } : undefined}
                  whileTap={isClickable ? { scale: 0.98 } : undefined}
                  onClick={() => isClickable && handleAmbitoClick(a)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors ${t('border-white/[0.05]', 'border-black/[0.06]')} ${isClickable
                      ? `cursor-pointer ${t('hover:bg-white/[0.04]', 'hover:bg-black/[0.04]')}`
                      : 'cursor-default'
                    }`}
                >
                  <div className="flex items-center justify-center w-[32px] h-[32px] rounded-lg shrink-0" style={{ backgroundColor: a.color + '18' }}>
                    {ambitoIconSrc ? (
                      <img src={ambitoIconSrc} alt={a.name} className="h-[18px] w-[18px] rounded-[4px] object-contain" />
                    ) : (
                      <Icon size={14} style={{ color: a.color }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold ${t('text-white', 'text-[#111]')} leading-tight`}>{a.name}</p>
                    <p className={`text-[10px] ${t('text-[#666]', 'text-[#888]')} mt-1 leading-tight`}>{systemLabel}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: a.color + '18', color: a.color }}>
                      {modCount}/{totalMod}
                    </span>
                    {modCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-[#10B981]/12 text-[#10B981]">
                        <Activity size={10} />
                        live
                      </span>
                    )}
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
