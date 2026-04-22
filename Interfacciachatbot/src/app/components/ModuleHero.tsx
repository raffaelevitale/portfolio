import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Radio } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ModuleHeroProps {
  title: string;
  subtitle?: string;
  ambitoName?: string;
  ambitoColor?: string;
  statusLabel?: string;
  statusTone?: 'live' | 'idle';
  children?: ReactNode;
}

export function ModuleHero({
  title,
  subtitle,
  ambitoName,
  ambitoColor = '#F73C1C',
  statusLabel = 'Operativo',
  statusTone = 'live',
  children,
}: ModuleHeroProps) {
  const { t, theme } = useTheme();
  const isDark = theme === 'dark';

  const borderCls = t('border-white/[0.06]', 'border-black/[0.06]');
  const textMain = t('text-white', 'text-[#111]');
  const textSub = t('text-[#8C8C8C]', 'text-[#666]');
  const textMuted = t('text-[#666]', 'text-[#888]');

  const hexToRgba = (hex: string, alpha: number) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const bgImage = isDark
    ? `radial-gradient(1100px 260px at 10% -20%, ${hexToRgba(ambitoColor, 0.18)} 0%, transparent 60%), radial-gradient(800px 220px at 95% -10%, rgba(139,92,246,0.10) 0%, transparent 55%), linear-gradient(180deg, #141414 0%, #121212 100%)`
    : `radial-gradient(1100px 260px at 10% -20%, ${hexToRgba(ambitoColor, 0.12)} 0%, transparent 60%), radial-gradient(800px 220px at 95% -10%, rgba(139,92,246,0.07) 0%, transparent 55%), linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)`;

  const isLive = statusTone === 'live';
  const statusColor = isLive ? '#10B981' : '#F59E0B';

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-[18px] border ${borderCls} isolate`}
    >
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: bgImage }} />

      <div className="px-4 md:px-6 py-4 md:py-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                style={{
                  backgroundColor: hexToRgba(statusColor, 0.12),
                  color: statusColor,
                  borderColor: hexToRgba(statusColor, 0.25),
                }}
              >
                <Radio size={9} />
                {statusLabel}
              </span>
              {ambitoName && (
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{ backgroundColor: hexToRgba(ambitoColor, 0.14), color: ambitoColor }}
                >
                  {ambitoName}
                </span>
              )}
              {isLive && (
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                </span>
              )}
            </div>
            <h1 className={`text-[17px] md:text-[20px] font-bold ${textMain} leading-tight tracking-[-0.005em]`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-[12.5px] md:text-[13px] ${textSub} mt-1.5 leading-relaxed max-w-[640px]`}>
                {subtitle}
              </p>
            )}
          </div>
          {children && (
            <div className="flex items-center gap-2 shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
