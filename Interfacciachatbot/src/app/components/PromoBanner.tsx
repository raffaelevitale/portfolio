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
  const totalCount = allModules.length;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`flex items-center justify-between h-[34px] md:h-[38px] px-3 md:px-4 border-b ${t('border-white/[0.04]', 'border-black/[0.06]')} shrink-0 overflow-hidden`}
          style={{ background: t('linear-gradient(to right, #1A1A1A, #1E1E1E, #1A1A1A)', 'linear-gradient(to right, #F8F8F8, #FAFAFA, #F8F8F8)') }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Zap size={13} className="text-[#F59E0B] shrink-0" />
            <span className={`text-[11px] md:text-[12px] ${t('text-[#999]', 'text-[#777]')} truncate`}>
              <span className={`${t('text-white', 'text-[#111]')} font-semibold`}>{activeCount}</span> moduli attivi su {totalCount}
            </span>
            <button
              onClick={onDiscoverModules}
              className="hidden sm:inline text-[11px] md:text-[12px] text-[#F73C1C] hover:text-[#ff5638] font-medium transition-colors ml-1 shrink-0 whitespace-nowrap"
            >
              Scopri i moduli
            </button>
          </div>
          <button onClick={() => setVisible(false)} className={`${t('text-[#555] hover:text-white', 'text-[#bbb] hover:text-[#333]')} transition-colors p-1 shrink-0`}>
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
