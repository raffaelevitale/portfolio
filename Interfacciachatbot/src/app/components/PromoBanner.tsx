import { useState } from 'react';
import { Zap, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Ambito } from './data';
import { useTheme } from './ThemeContext';

interface PromoBannerProps {
  ambiti: Ambito[];
  onDiscoverModules?: () => void;
}

export function PromoBanner({ ambiti, onDiscoverModules }: PromoBannerProps) {
  const [visible, setVisible] = useState(true);
  const { t } = useTheme();

  const allModules = ambiti.flatMap(a => a.funzioni.flatMap(f => f.modules));
  const activeCount = allModules.filter(m => m.purchased && m.active).length;
  const totalCount = ambiti.reduce((sum, ambito) => {
    const actualCount = ambito.funzioni.reduce((acc, funzione) => acc + funzione.modules.length, 0);
    return sum + (ambito.declaredModuleCount ?? actualCount);
  }, 0);
  const activeRatio = totalCount === 0 ? 0 : Math.round((activeCount / totalCount) * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -8 }}
          animate={{ height: 'auto', opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -8, marginTop: 0, marginBottom: 0 }}
          transition={{ duration: 0.24, ease: 'easeInOut' }}
          className={`flex items-center justify-between h-[var(--layout-promo-h)] px-3 md:px-4 border-b ${t('border-white/[0.04]', 'border-black/[0.06]')} shrink-0 overflow-hidden`}
          style={{ background: t('linear-gradient(to right, #1A1A1A, #1E1E1E, #1A1A1A)', 'linear-gradient(to right, #F8F8F8, #FAFAFA, #F8F8F8)') }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3.8 }}>
              <Zap size={13} className="text-[#F59E0B] shrink-0" />
            </motion.div>
            <span className={`text-[11px] md:text-[12px] ${t('text-[#999]', 'text-[#777]')} truncate`}>
              <span className={`${t('text-white', 'text-[#111]')} font-semibold`}>{activeCount}</span> moduli attivi su {totalCount}
            </span>
            <div className={`hidden md:block h-[4px] w-16 rounded-full ${t('bg-white/[0.08]', 'bg-black/[0.08]')}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activeRatio}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-[4px] rounded-full bg-[#10B981]"
              />
            </div>
            <motion.button
              onClick={onDiscoverModules}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline text-[11px] md:text-[12px] text-[#F73C1C] hover:text-[#ff5638] font-medium transition-colors ml-1 shrink-0 whitespace-nowrap"
            >
              Scopri i moduli
            </motion.button>
          </div>
          <motion.button
            onClick={() => setVisible(false)}
            whileTap={{ scale: 0.9, rotate: 90 }}
            className={`${t('text-[#555] hover:text-white', 'text-[#bbb] hover:text-[#333]')} transition-colors p-1 shrink-0`}
          >
            <X size={13} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
