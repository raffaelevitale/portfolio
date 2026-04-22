import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Compass,
  Heart,
  Lock,
  Radio,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Wrench,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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

type ModuleActivity = {
  activity: string;
  metric: string;
  metricLabel: string;
  lastEvent: string;
  deltaPercent: number;
};

const moduleActivityMap: Record<string, ModuleActivity> = {
  M093: { activity: 'Smista richieste tra i sistemi AI competenti', metric: '247', metricLabel: 'richieste oggi', lastEvent: 'adesso', deltaPercent: 18 },
  M001: { activity: 'Monitoraggio reputazione su fonti web e social', metric: '12', metricLabel: 'fonti attive', lastEvent: '4 min fa', deltaPercent: 4 },
  M041: { activity: 'Genera preventivi in autonomia dalle richieste commerciali', metric: '9', metricLabel: 'preventivi oggi', lastEvent: '12 min fa', deltaPercent: 33 },
  M062: { activity: 'Classifica i lead per priorita commerciale', metric: '34', metricLabel: 'lead qualificati', lastEvent: '2 min fa', deltaPercent: 12 },
  M014: { activity: 'Controlla coerenza e conformita dei documenti', metric: '18', metricLabel: 'documenti analizzati', lastEvent: '7 min fa', deltaPercent: -5 },
  M071: { activity: 'Produce contenuti editoriali e campagne marketing', metric: '6', metricLabel: 'contenuti creati', lastEvent: '1 ora fa', deltaPercent: 8 },
  M002: { activity: 'Risponde a richieste specialistiche dei clienti', metric: '52', metricLabel: 'chat gestite', lastEvent: 'adesso', deltaPercent: 22 },
  M061: { activity: 'Estrae insight dalle conversazioni cliente', metric: '128', metricLabel: 'conversazioni', lastEvent: '3 min fa', deltaPercent: 15 },
};

function getActivityForModule(mod: Module): ModuleActivity {
  const preset = moduleActivityMap[mod.id];
  if (preset) return preset;

  const byType: Record<string, ModuleActivity> = {
    chat: { activity: mod.description ?? 'Gestisce richieste conversazionali in autonomia', metric: '--', metricLabel: 'conversazioni', lastEvent: 'in attesa', deltaPercent: 0 },
    settings: { activity: mod.description ?? 'Esegue regole e automazioni operative', metric: '--', metricLabel: 'regole attive', lastEvent: 'in attesa', deltaPercent: 0 },
    files: { activity: mod.description ?? 'Elabora documenti e file aziendali', metric: '--', metricLabel: 'file processati', lastEvent: 'in attesa', deltaPercent: 0 },
    dashboard: { activity: mod.description ?? 'Aggrega dati e genera metriche operative', metric: '--', metricLabel: 'insight', lastEvent: 'in attesa', deltaPercent: 0 },
  };

  return byType[mod.type] ?? byType.chat;
}

function greetingForHour(hour: number): string {
  if (hour < 6) return 'Buonanotte';
  if (hour < 13) return 'Buongiorno';
  if (hour < 19) return 'Buon pomeriggio';
  return 'Buonasera';
}

function contextForHour(hour: number, activeCount: number): string {
  if (activeCount === 0) return 'Nessun modulo attivo al momento. Puoi attivarli dal catalogo.';
  if (hour < 7) return 'I tuoi sistemi stanno lavorando anche di notte.';
  if (hour < 11) return 'La tua interfaccia ha gia iniziato la giornata operativa.';
  if (hour < 14) return 'Siamo nel picco di attivita della mattinata.';
  if (hour < 18) return 'La giornata operativa e in pieno flusso.';
  if (hour < 22) return 'Attivita della giornata in chiusura, automazioni ancora attive.';
  return 'Turno serale, i sistemi restano operativi in autonomia.';
}

function seededRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function generateSparkline(seed: number, bias = 0.5): number[] {
  const rand = seededRandom(seed || 1);
  const bars: number[] = [];
  let last = 0.4 + rand() * 0.3;
  for (let i = 0; i < 16; i++) {
    const delta = (rand() - 0.45) * 0.35;
    last = Math.max(0.12, Math.min(0.98, last + delta));
    bars.push(last * (0.8 + bias * 0.4));
  }
  return bars;
}

function MiniSparkline({ color, seed, dark }: { color: string; seed: number; dark: boolean }) {
  const bars = useMemo(() => generateSparkline(seed), [seed]);
  const width = 72;
  const height = 22;
  const gap = 1.5;
  const barWidth = (width - gap * (bars.length - 1)) / bars.length;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
      aria-hidden
    >
      <defs>
        <linearGradient id={`spark-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={dark ? 0.85 : 0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={dark ? 0.15 : 0.25} />
        </linearGradient>
      </defs>
      {bars.map((v, i) => {
        const h = Math.max(2, v * height);
        const x = i * (barWidth + gap);
        const y = height - h;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={h}
            rx={barWidth * 0.35}
            fill={`url(#spark-${seed})`}
          />
        );
      })}
    </svg>
  );
}

type CountUpProps = {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  suffix?: string;
};

function CountUp({ value, duration = 1.1, format, suffix }: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      prevValue.current = value;
      return;
    }
    const from = prevValue.current;
    const to = value;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevValue.current = to;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);

  const rendered = format ? format(display) : Math.round(display).toString();
  return <>{rendered}{suffix}</>;
}

export function WelcomeScreen({ ambiti, onSelectModule, onShowLocked }: WelcomeScreenProps) {
  const { t, theme } = useTheme();
  const isDark = theme === 'dark';
  const reduced = useReducedMotion();

  const allModules = useMemo(
    () => ambiti.flatMap(a => a.funzioni.flatMap(f => f.modules.map(m => ({ module: m, ambitoId: a.id })))),
    [ambiti],
  );

  const activeModules = useMemo(
    () => allModules.filter(({ module }) => module.purchased && module.active),
    [allModules],
  );

  const lockedPurchasedModules = useMemo(
    () => allModules.filter(({ module }) => module.purchased && !module.active),
    [allModules],
  );

  const notPurchasedModules = useMemo(
    () => allModules.filter(({ module }) => !module.purchased),
    [allModules],
  );

  const ambitoById = useMemo(() => {
    const map = new Map<string, Ambito>();
    ambiti.forEach(a => map.set(a.id, a));
    return map;
  }, [ambiti]);

  const activities = useMemo(
    () => activeModules.map(item => ({ ...item, activity: getActivityForModule(item.module) })),
    [activeModules],
  );

  const totalActionsToday = useMemo(
    () => activities.reduce((sum, { activity }) => {
      const parsed = Number(activity.metric);
      return Number.isFinite(parsed) ? sum + parsed : sum;
    }, 0),
    [activities],
  );

  const hoursSaved = useMemo(
    () => Math.round((totalActionsToday * 2.5 / 60) * 10) / 10,
    [totalActionsToday],
  );

  const insightsGenerated = useMemo(
    () => Math.round(totalActionsToday / 7),
    [totalActionsToday],
  );

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const greeting = greetingForHour(now.getHours());
  const contextLine = contextForHour(now.getHours(), activeModules.length);

  const tickerPool = useMemo(() => {
    return activities
      .filter(item => item.activity.metric !== '--')
      .map(item => ({
        id: item.module.id,
        color: ambitoById.get(item.ambitoId)?.color ?? '#F73C1C',
        moduleName: item.module.name,
        lastEvent: item.activity.lastEvent,
        ambitoName: ambitoById.get(item.ambitoId)?.name ?? '',
        action: item.activity.activity,
      }));
  }, [activities, ambitoById]);

  const [tickerIdx, setTickerIdx] = useState(0);
  useEffect(() => {
    if (tickerPool.length < 2 || reduced) return;
    const id = window.setInterval(() => {
      setTickerIdx(idx => (idx + 1) % tickerPool.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [tickerPool.length, reduced]);

  const currentTicker = tickerPool[tickerIdx % Math.max(1, tickerPool.length)];

  const handleModuleClick = (module: Module, ambitoId: string) => {
    if (!module.purchased) {
      onShowLocked?.(module);
      return;
    }
    onSelectModule?.(module, ambitoId);
  };

  const handleDiscoverClick = () => {
    const firstLocked = lockedPurchasedModules[0]?.module ?? notPurchasedModules[0]?.module;
    if (firstLocked) onShowLocked?.(firstLocked);
  };

  const cardBg = t('bg-[#141414] border-white/[0.06]', 'bg-white border-black/[0.06]');
  const softCardBg = t('bg-[#151515] border-white/[0.04]', 'bg-white border-black/[0.05]');
  const textMain = t('text-white', 'text-[#111]');
  const textSub = t('text-[#8C8C8C]', 'text-[#666]');
  const textMuted = t('text-[#666]', 'text-[#888]');
  const rowHover = t('hover:bg-white/[0.035]', 'hover:bg-black/[0.025]');
  const rowBorder = t('border-white/[0.05]', 'border-black/[0.06]');
  const subtlePanel = t('bg-white/[0.02] border-white/[0.06]', 'bg-black/[0.02] border-black/[0.05]');

  const kpiCards = [
    {
      label: 'Azioni automatiche oggi',
      rawValue: totalActionsToday,
      format: (n: number) => Math.round(n).toLocaleString('it-IT'),
      icon: Zap,
      color: '#10B981',
      delta: 12,
      sparkSeed: 11,
    },
    {
      label: 'Ore operative risparmiate',
      rawValue: hoursSaved,
      format: (n: number) => `${(Math.round(n * 10) / 10).toString().replace('.', ',')}h`,
      icon: Clock,
      color: '#F59E0B',
      delta: 9,
      sparkSeed: 37,
    },
    {
      label: 'Insight generati dall AI',
      rawValue: insightsGenerated,
      format: (n: number) => Math.round(n).toLocaleString('it-IT'),
      icon: TrendingUp,
      color: '#8B5CF6',
      delta: 21,
      sparkSeed: 73,
    },
  ];

  return (
    <div className={`flex flex-1 justify-center overflow-y-auto ${t('bg-[#101010]', 'bg-[#F5F5F5]')}`}>
      <div className="w-full max-w-4xl px-4 md:px-10 py-8 md:py-12 space-y-6 md:space-y-7">
        {/* Hero with ambient gradient mesh */}
        <section className="relative overflow-hidden rounded-[20px] isolate">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background: isDark
                ? 'radial-gradient(1200px 300px at 15% -10%, rgba(247,60,28,0.18) 0%, transparent 60%), radial-gradient(900px 260px at 90% 0%, rgba(139,92,246,0.15) 0%, transparent 55%), radial-gradient(600px 220px at 60% 110%, rgba(16,185,129,0.12) 0%, transparent 55%), linear-gradient(180deg, #141414 0%, #121212 100%)'
                : 'radial-gradient(1200px 300px at 15% -10%, rgba(247,60,28,0.12) 0%, transparent 60%), radial-gradient(900px 260px at 90% 0%, rgba(139,92,246,0.10) 0%, transparent 55%), radial-gradient(600px 220px at 60% 110%, rgba(16,185,129,0.09) 0%, transparent 55%), linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
            }}
          />
          <div className={`border ${t('border-white/[0.06]', 'border-black/[0.06]')} rounded-[20px] px-5 md:px-8 py-6 md:py-8`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-start justify-between gap-4 flex-wrap"
            >
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#10B981]/12 text-[#10B981] border border-[#10B981]/20">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                    </span>
                    Interfaccia operativa
                  </div>
                  <span className={`text-[11px] ${textMuted}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                    <span className="mx-1.5">·</span>
                    {now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h1 className={`text-[26px] md:text-[34px] leading-[1.15] font-bold ${textMain} mt-3 tracking-[-0.01em]`}>
                  {greeting} Luciano.
                </h1>
                <p className={`text-[14px] md:text-[15px] ${textSub} mt-2 leading-relaxed max-w-[560px]`}>
                  In questo momento{' '}
                  <strong className={textMain}>
                    {activeModules.length} {activeModules.length === 1 ? 'modulo AI e al lavoro' : 'moduli AI sono al lavoro'}
                  </strong>{' '}
                  per la tua azienda. {contextLine}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className={`hidden md:flex flex-col items-end ${textMuted}`}>
                  <span className="text-[10px] uppercase tracking-[0.6px]">Oggi</span>
                  <span className={`text-[16px] font-bold ${textMain}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <CountUp value={totalActionsToday} format={n => Math.round(n).toLocaleString('it-IT')} />
                  </span>
                </div>
                <div
                  className="hidden md:flex items-center justify-center w-11 h-11 rounded-xl"
                  style={{ backgroundColor: '#F73C1C14', color: '#F73C1C' }}
                >
                  <Sparkles size={18} />
                </div>
              </div>
            </motion.div>

            {/* Live ticker */}
            {currentTicker && (
              <div className={`mt-5 border ${t('border-white/[0.06]', 'border-black/[0.06]')} ${t('bg-white/[0.02]', 'bg-white/80')} rounded-xl px-3.5 py-2.5 flex items-center gap-3 backdrop-blur-sm`}>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Radio size={12} className="text-[#10B981]" />
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.6px] ${textMuted}`}>Live</span>
                </div>
                <div className="relative flex-1 min-w-0 h-[18px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTicker.id + tickerIdx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 flex items-center gap-2"
                    >
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${currentTicker.color}1A`, color: currentTicker.color }}
                      >
                        {currentTicker.moduleName}
                      </span>
                      <span className={`text-[12px] ${textSub} truncate`}>
                        {currentTicker.action}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <span className={`text-[10px] ${textMuted} shrink-0`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  {currentTicker.lastEvent}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {kpiCards.map((kpi, i) => {
            const Icon = kpi.icon;
            const deltaPositive = kpi.delta >= 0;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 + i * 0.06 }}
                whileHover={reduced ? undefined : { y: -2 }}
                className={`${cardBg} border rounded-xl p-4 relative overflow-hidden group`}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(280px 80px at 100% 0%, ${kpi.color}18, transparent 70%)`,
                  }}
                />
                <div className="flex items-center justify-between mb-3 relative">
                  <span className={`text-[10.5px] ${textMuted} uppercase tracking-[0.6px] font-medium`}>{kpi.label}</span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${kpi.color}1F`, color: kpi.color }}
                  >
                    <Icon size={13} />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 relative">
                  <p className={`text-[26px] md:text-[28px] font-bold leading-none ${textMain}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <CountUp value={kpi.rawValue} format={kpi.format} />
                  </p>
                  <div className="opacity-80">
                    <MiniSparkline color={kpi.color} seed={kpi.sparkSeed} dark={isDark} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5 relative">
                  <span
                    className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold px-1.5 py-[1px] rounded"
                    style={{
                      backgroundColor: deltaPositive ? '#10B98118' : '#EF444418',
                      color: deltaPositive ? '#10B981' : '#EF4444',
                    }}
                  >
                    <ArrowUpRight size={10} className={deltaPositive ? '' : 'rotate-90'} />
                    {deltaPositive ? '+' : ''}{kpi.delta}%
                  </span>
                  <span className={`text-[10.5px] ${textMuted}`}>vs ieri</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Moduli al lavoro */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className={`${cardBg} border rounded-xl overflow-hidden`}
        >
          <div className={`flex items-center justify-between px-4 md:px-5 py-3.5 border-b ${rowBorder}`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#10B981]/12 flex items-center justify-center">
                <Activity size={12} className="text-[#10B981]" />
              </div>
              <h2 className={`text-[14px] font-semibold ${textMain}`}>Moduli al lavoro adesso</h2>
            </div>
            <span className={`text-[11px] ${textMuted}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              {activeModules.length} / {allModules.length} attivi
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="w-11 h-11 rounded-xl bg-[#F73C1C]/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={18} className="text-[#F73C1C]" />
              </div>
              <p className={`text-[13px] font-semibold ${textMain}`}>Nessun modulo attivo al momento</p>
              <p className={`text-[12px] ${textSub} mt-1`}>Attiva un modulo per vederlo operare qui in tempo reale.</p>
            </div>
          ) : (
            activities.map(({ module, ambitoId, activity }, i) => {
              const ambito = ambitoById.get(ambitoId);
              const AmbitoIcon = ambito ? (iconMap[ambito.iconName] || Compass) : Compass;
              const ambitoIconSrc = ambito ? getAmbitoIconSrc(ambito.id) : null;
              const isLast = i === activities.length - 1;
              const color = ambito?.color ?? '#F73C1C';
              const seed = Array.from(module.id).reduce((a, c) => a + c.charCodeAt(0), 0);

              return (
                <motion.button
                  key={module.id}
                  onClick={() => handleModuleClick(module, ambitoId)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.05 + i * 0.03 }}
                  whileHover={reduced ? undefined : { x: 2 }}
                  className={`w-full flex items-start md:items-center gap-3 px-4 md:px-5 py-3.5 text-left transition-colors ${rowHover} ${!isLast ? `border-b ${rowBorder}` : ''} group`}
                >
                  <div
                    className="relative w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}1A` }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ boxShadow: `0 0 0 3px ${color}25` }}
                    />
                    {ambitoIconSrc ? (
                      <img src={ambitoIconSrc} alt={ambito?.name ?? ''} className="h-[18px] w-[18px] rounded-[4px] object-contain" />
                    ) : (
                      <AmbitoIcon size={16} style={{ color }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-[13px] font-semibold ${textMain} truncate`}>{module.name}</p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-[1px] rounded bg-[#10B981]/15 text-[#10B981]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        LIVE
                      </span>
                      {ambito && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-[1px] rounded"
                          style={{ backgroundColor: `${color}14`, color }}
                        >
                          {ambito.name}
                        </span>
                      )}
                    </div>
                    <p className={`text-[12px] ${textSub} mt-0.5 leading-snug line-clamp-1`}>
                      {activity.activity}
                    </p>
                  </div>

                  <div className="hidden md:block opacity-80">
                    <MiniSparkline color={color} seed={seed} dark={isDark} />
                  </div>

                  <div className="hidden md:flex flex-col items-end shrink-0 min-w-[70px]">
                    <span className={`text-[13px] font-bold ${textMain}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      {activity.metric}
                    </span>
                    <span className={`text-[10px] ${textMuted}`}>{activity.metricLabel}</span>
                  </div>

                  <div className="hidden lg:flex items-center shrink-0 min-w-[56px] justify-end">
                    <span
                      className={`text-[10px] ${textMuted}`}
                      style={{ fontFamily: '"JetBrains Mono", monospace' }}
                    >
                      {activity.lastEvent}
                    </span>
                  </div>

                  <ChevronRight size={14} className={`${textMuted} shrink-0 group-hover:translate-x-0.5 transition-transform`} />
                </motion.button>
              );
            })
          )}
        </motion.section>

        {/* Potenziale da sbloccare */}
        {(lockedPurchasedModules.length > 0 || notPurchasedModules.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className={`${subtlePanel} border border-dashed rounded-xl p-4 md:p-5`}
          >
            <div className="flex items-start md:items-center gap-3 flex-wrap">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#F73C1C]/10 shrink-0">
                <Sparkles size={15} className="text-[#F73C1C]" />
              </div>
              <div className="flex-1 min-w-[220px]">
                <p className={`text-[13px] font-semibold ${textMain}`}>
                  {lockedPurchasedModules.length > 0
                    ? `Hai ${lockedPurchasedModules.length} ${lockedPurchasedModules.length === 1 ? 'modulo acquistato' : 'moduli acquistati'} pronti da attivare`
                    : `Puoi potenziare l interfaccia con altri ${notPurchasedModules.length} moduli`}
                </p>
                <p className={`text-[12px] ${textSub} mt-0.5`}>
                  {lockedPurchasedModules.length > 0
                    ? 'Bastano pochi minuti per configurarli e portarli a regime.'
                    : 'Scopri i moduli che possono gestire altri processi in autonomia.'}
                </p>
              </div>
              <button
                onClick={handleDiscoverClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F73C1C] hover:bg-[#e63518] text-white text-[12px] font-semibold transition-colors shrink-0"
              >
                {lockedPurchasedModules.length > 0 ? 'Attiva' : 'Esplora'}
                <ArrowUpRight size={12} />
              </button>
            </div>

            {/* Preview chips */}
            {(lockedPurchasedModules.length > 0 || notPurchasedModules.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(lockedPurchasedModules.length > 0 ? lockedPurchasedModules : notPurchasedModules)
                  .slice(0, 4)
                  .map(({ module, ambitoId }) => {
                    const ambito = ambitoById.get(ambitoId);
                    const color = ambito?.color ?? '#F73C1C';
                    return (
                      <button
                        key={module.id}
                        onClick={() => onShowLocked?.(module)}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] ${softCardBg} border ${textSub} hover:${textMain} transition-colors`}
                      >
                        <Lock size={9} style={{ color }} />
                        <span className="truncate max-w-[180px]">{module.name}</span>
                      </button>
                    );
                  })}
              </div>
            )}
          </motion.div>
        )}

        {/* Footer privacy */}
        <div className="flex items-center justify-center gap-2 text-[11px] pt-1">
          <Lock size={11} className={textMuted} />
          <span className={textMuted}>Dati aziendali protetti. Orchestrazione AI eseguita in ambiente dedicato.</span>
        </div>
      </div>
    </div>
  );
}
