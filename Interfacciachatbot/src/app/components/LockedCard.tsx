import { Lock, X } from 'lucide-react';
import { motion } from 'motion/react';
import type { Module } from './data';
import { useTheme } from './ThemeContext';

interface LockedCardProps { module: Module; onClose: () => void; }

export function LockedCard({ module, onClose }: LockedCardProps) {
  const { t } = useTheme();
  const info = module.lockedInfo;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:absolute md:inset-auto md:left-[260px] md:top-[140px] md:p-0"
    >
      <div className="md:hidden fixed inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`relative w-full max-w-[320px] md:w-[280px] border rounded-xl shadow-2xl overflow-hidden ${t('bg-[#1E1E1E] border-white/[0.1] shadow-black/50', 'bg-white border-black/[0.1] shadow-black/10')}`}
        style={{ fontFamily: '"Lexend", sans-serif' }}
      >
        <div className="h-[3px] bg-[#F73C1C]" />
        <div className="p-5">
          <button onClick={onClose} className={`absolute top-3 right-3 ${t('text-[#555] hover:text-white', 'text-[#bbb] hover:text-[#333]')} transition-colors`}>
            <X size={14} />
          </button>
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${t('bg-white/[0.04] border-white/[0.06]', 'bg-black/[0.03] border-black/[0.06]')} border mb-4`}>
            <Lock size={16} className={t('text-[#666]', 'text-[#bbb]')} />
          </div>
          <h3 className={`text-[16px] font-bold ${t('text-white', 'text-[#111]')} mb-1`}>{info?.title || module.name}</h3>
          <p className={`text-[12px] ${t('text-[#888]', 'text-[#888]')} mb-3 italic`}>{info?.subtitle || ''}</p>
          <p className={`text-[13px] ${t('text-[#777]', 'text-[#666]')} leading-relaxed mb-5`}>
            {info?.description || `Il modulo ${module.name} non è incluso nel tuo piano attuale.`}
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 bg-[#F73C1C] hover:bg-[#e63518] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-lg shadow-[#F73C1C]/20"
          >
            Scopri di più
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
