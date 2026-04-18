import { Compass, Settings2, ShieldCheck, Wrench, Sun, Target, Heart, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { Module } from './data';
import { useTheme } from './ThemeContext';
import { getAmbitoIconSrc } from '../icone';

const iconMap: Record<string, React.ElementType> = {
  compass: Compass, cog: Settings2, shield: ShieldCheck, wrench: Wrench, sun: Sun, target: Target, heart: Heart,
};

interface ModuleTopBarProps {
  ambitoId: string;
  ambitoName: string;
  ambitoColor: string;
  ambitoIcon: string;
  module: Module;
  onToggle: () => void;
  onGoHome?: () => void;
  showParams?: boolean;
  onToggleParams?: () => void;
  isChat?: boolean;
  extraBreadcrumb?: { label: string; onClick?: () => void };
}

export function ModuleTopBar({ ambitoId, ambitoName, ambitoColor, ambitoIcon, module, onToggle, onGoHome, extraBreadcrumb }: ModuleTopBarProps) {
  const { t } = useTheme();
  const Icon = iconMap[ambitoIcon] || Compass;
  const ambitoIconSrc = getAmbitoIconSrc(ambitoId);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className={`flex items-center justify-between h-[44px] md:h-[48px] px-3 md:px-5 border-b ${t('border-white/[0.06]', 'border-black/[0.08]')} shrink-0`}
      style={{ backgroundColor: t('#1A1A1A', '#FFFFFF') }}
    >
      <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
        <motion.button
          onClick={onGoHome}
          whileHover={{ x: -1 }}
          whileTap={{ scale: 0.97 }}
          className={`hidden sm:flex items-center gap-1.5 shrink-0 rounded-md px-1.5 py-1 -ml-1.5 transition-colors ${t('hover:bg-white/[0.04]', 'hover:bg-black/[0.04]')}`}
        >
          <div className="flex items-center justify-center w-[22px] h-[22px] rounded-md" style={{ backgroundColor: ambitoColor + '20' }}>
            {ambitoIconSrc ? (
              <img src={ambitoIconSrc} alt={ambitoName} className="h-3.5 w-3.5 rounded-[3px] object-contain" />
            ) : (
              <Icon size={12} style={{ color: ambitoColor }} />
            )}
          </div>
          <span className={`text-[12px] md:text-[13px] font-semibold ${t('text-[#999]', 'text-[#888]')} ${t('hover:text-white', 'hover:text-[#111]')} transition-colors`}>{ambitoName}</span>
        </motion.button>
        <ChevronRight size={12} className={`hidden sm:inline ${t('text-[#444]', 'text-[#ccc]')} shrink-0`} />
        <span className={`text-[11px] md:text-[12px] ${extraBreadcrumb ? `${t('text-[#999]', 'text-[#888]')} cursor-pointer ${t('hover:text-white', 'hover:text-[#111]')}` : `font-semibold ${t('text-white', 'text-[#111]')}`} truncate`}
          onClick={extraBreadcrumb ? extraBreadcrumb.onClick : undefined}
        >
          {module.name}
        </span>
        {extraBreadcrumb && (
          <>
            <ChevronRight size={12} className={`${t('text-[#444]', 'text-[#ccc]')} shrink-0`} />
            <span className={`text-[11px] md:text-[12px] font-semibold ${t('text-white', 'text-[#111]')} truncate`}>{extraBreadcrumb.label}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className={`h-2 w-2 rounded-full ${module.active ? 'bg-[#10B981] animate-pulse' : t('bg-[#555]', 'bg-[#ccc]')}`} />
          <span className={`hidden sm:inline text-[11px] md:text-[12px] ${t('text-[#888]', 'text-[#777]')}`}>{module.active ? 'Attivo' : 'Disattivato'}</span>
        </div>
        <motion.button
          onClick={onToggle}
          whileTap={{ scale: 0.92 }}
          className={`relative w-[34px] md:w-[36px] h-[18px] md:h-[20px] rounded-full transition-colors shrink-0 ${module.active ? 'bg-[#10B981]' : t('bg-[#333]', 'bg-[#ccc]')}`}
        >
          <div className={`absolute top-[2px] md:top-[3px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${module.active ? 'left-[17px] md:left-[19px]' : 'left-[2px] md:left-[3px]'}`} />
        </motion.button>
      </div>
    </motion.div>
  );
}
