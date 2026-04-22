import { useMemo, useState } from 'react';
import type { ElementType } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, ArrowLeft, ArrowRight, CheckCircle2, Compass, LayoutDashboard, PlayCircle, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useTheme } from './ThemeContext';
import type { Ambito, Module } from './data';

interface InterfaceOnboardingProps {
    ambiti: Ambito[];
    userName?: string;
    onComplete: () => void;
    onSkip: () => void;
    onOpenEcosystem: () => void;
    onOpenSubscriptions: () => void;
}

type StepId = 'welcome' | 'your-modules' | 'how-it-works' | 'ready';

interface BuiltStep {
    id: StepId;
    title: string;
    description: string;
    accent: string;
    Icon: ElementType;
    bullets: string[];
    actionLabel?: string;
    action?: 'ecosystem' | 'subscriptions';
    activeModulesPreview?: Array<{ module: Module; ambitoName: string; ambitoColor: string }>;
    heroMetric?: { label: string; value: string };
}

function buildSteps(
    ambiti: Ambito[],
    userName: string,
): BuiltStep[] {
    const allModules = ambiti.flatMap(a => a.funzioni.flatMap(f => f.modules.map(m => ({ module: m, ambito: a }))));
    const activeModules = allModules.filter(({ module }) => module.purchased && module.active);
    const purchasedCount = allModules.filter(({ module }) => module.purchased).length;
    const totalSystems = ambiti.length;
    const systemsInUse = new Set(activeModules.map(({ ambito }) => ambito.id)).size;

    const activePreview = activeModules.slice(0, 4).map(({ module, ambito }) => ({
        module,
        ambitoName: ambito.name,
        ambitoColor: ambito.color,
    }));

    const firstActiveModule = activeModules[0];

    const firstStepBullets = activeModules.length > 0
        ? [
            `${activeModules.length} ${activeModules.length === 1 ? 'modulo attivo' : 'moduli attivi'} che gestiscono flussi in autonomia`,
            `${purchasedCount} ${purchasedCount === 1 ? 'modulo' : 'moduli'} gia acquistati pronti da attivare`,
            `${systemsInUse} di ${totalSystems} sistemi AI operativi per la tua azienda`,
        ]
        : [
            'Piattaforma configurata sui processi della tua azienda',
            'Base di moduli pronti per essere attivati',
            'Orchestrazione centralizzata tra reparti',
        ];

    return [
        {
            id: 'welcome',
            title: `Benvenuto ${userName}, l interfaccia e pronta`,
            description: activeModules.length > 0
                ? `Abbiamo gia attivato ${activeModules.length} ${activeModules.length === 1 ? 'modulo AI' : 'moduli AI'} sulla tua configurazione. Adesso ti mostriamo cosa sta lavorando per te e come usarlo.`
                : 'Abbiamo configurato la piattaforma sui processi della tua azienda. Adesso ti mostriamo cosa puo fare per te.',
            accent: '#F73C1C',
            Icon: Sparkles,
            bullets: firstStepBullets,
            heroMetric: {
                label: activeModules.length > 0 ? 'Moduli gia al lavoro' : 'Moduli pronti',
                value: activeModules.length > 0 ? `${activeModules.length}` : `${purchasedCount}`,
            },
        },
        {
            id: 'your-modules',
            title: activeModules.length > 0 ? 'Questi sono i moduli al lavoro per te' : 'La tua libreria di moduli',
            description: activeModules.length > 0
                ? 'Ognuno gestisce un processo specifico in modo autonomo. Puoi aprirne uno in qualsiasi momento dalla home o dalla sidebar Ecosistema.'
                : 'Quando attivi un modulo, lo vedrai comparire subito in home con lo stato operativo live.',
            accent: '#10B981',
            Icon: Activity,
            bullets: [
                'Apri un modulo per vedere report, attivita e configurazione',
                'Lo stato "live" indica che il modulo sta elaborando adesso',
                firstActiveModule
                    ? `Prova ad aprire "${firstActiveModule.module.name}" per un tour rapido`
                    : 'Attivi un modulo e lo vedi operativo entro pochi minuti',
            ],
            activeModulesPreview: activePreview,
            actionLabel: activeModules.length > 0 ? 'Vedi tutti i moduli' : 'Esplora l Ecosistema',
            action: 'ecosystem',
        },
        {
            id: 'how-it-works',
            title: 'Come leggere la home operativa',
            description: 'La home e un radar: in alto le azioni automatiche del giorno, sotto i moduli al lavoro in tempo reale. Non devi controllarli tu, controllano loro i processi.',
            accent: '#F59E0B',
            Icon: LayoutDashboard,
            bullets: [
                'I KPI in alto sommano le azioni automatiche completate oggi',
                'Il badge LIVE segnala i moduli che stanno elaborando ora',
                'Click su un modulo per entrare e vedere report e dettagli',
            ],
        },
        {
            id: 'ready',
            title: 'Tutto pronto, puoi iniziare',
            description: 'Hai la tua interfaccia configurata sulla tua azienda. Puoi anche annotare qui i servizi AI esterni che paghi (ChatGPT, Claude, Gemini...) per tenere tutto in un posto solo.',
            accent: '#3B82F6',
            Icon: ShieldCheck,
            bullets: [
                'La home e il tuo punto di controllo operativo',
                'L Ecosistema nella sidebar contiene tutti i moduli',
                'In Impostazioni trovi Fatturazione e i tuoi dati',
            ],
            actionLabel: 'Apri il blocco note sottoscrizioni',
            action: 'subscriptions',
        },
    ];
}

export function InterfaceOnboarding({
    ambiti,
    userName = 'Luciano',
    onComplete,
    onSkip,
    onOpenEcosystem,
    onOpenSubscriptions,
}: InterfaceOnboardingProps) {
    const { t } = useTheme();
    const [stepIndex, setStepIndex] = useState(0);

    const steps = useMemo(() => buildSteps(ambiti, userName), [ambiti, userName]);
    const step = steps[stepIndex];
    const isLastStep = stepIndex === steps.length - 1;

    const panelBg = t('bg-[#121212]/95 border-white/[0.08]', 'bg-white/95 border-black/[0.1]');
    const textMain = t('text-white', 'text-[#111]');
    const textSub = t('text-[#999]', 'text-[#666]');
    const textMuted = t('text-[#777]', 'text-[#888]');
    const subtleBg = t('bg-white/[0.04] hover:bg-white/[0.08]', 'bg-black/[0.04] hover:bg-black/[0.08]');
    const bulletBg = t('bg-white/[0.03] border-white/[0.06]', 'bg-black/[0.02] border-black/[0.06]');

    const goNext = () => {
        if (isLastStep) {
            onComplete();
            return;
        }
        setStepIndex(prev => prev + 1);
    };

    const goBack = () => {
        setStepIndex(prev => Math.max(0, prev - 1));
    };

    const runStepAction = () => {
        if (step.action === 'ecosystem') {
            onOpenEcosystem();
            return;
        }
        if (step.action === 'subscriptions') {
            onOpenSubscriptions();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]" />

            <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className={`relative w-full max-w-3xl border rounded-2xl overflow-hidden ${panelBg}`}
            >
                <div
                    className="pointer-events-none absolute -top-16 -right-12 h-56 w-56 rounded-full blur-3xl"
                    style={{ backgroundColor: `${step.accent}33` }}
                />
                <div
                    className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full blur-3xl"
                    style={{ backgroundColor: `${step.accent}22` }}
                />

                <div className="relative px-5 md:px-8 pt-5 md:pt-7">
                    <div className="flex items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 bg-[#F73C1C]/12 text-[#F73C1C] text-[11px] font-semibold">
                            <Sparkles size={12} />
                            Benvenuto in CRYBU
                        </div>
                        <button
                            onClick={onSkip}
                            className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${subtleBg} ${textMuted}`}
                        >
                            Salta
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-1.5">
                        {steps.map((item, index) => (
                            <div
                                key={item.id}
                                className="h-1.5 rounded-full transition-colors"
                                style={{
                                    backgroundColor: index <= stepIndex ? step.accent : t('rgba(255,255,255,0.14)', 'rgba(17,17,17,0.12)'),
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative px-5 md:px-8 py-5 md:py-7">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className="space-y-5"
                        >
                            <div className="flex items-start gap-3 md:gap-4">
                                <div
                                    className="h-10 w-10 md:h-11 md:w-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${step.accent}1F`, color: step.accent }}
                                >
                                    <step.Icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <h2 className={`text-[20px] md:text-[26px] leading-tight font-bold ${textMain}`}>{step.title}</h2>
                                    <p className={`text-[13px] md:text-[14px] mt-2 ${textSub}`}>{step.description}</p>
                                </div>
                                {step.heroMetric && (
                                    <div className={`hidden md:flex flex-col items-end shrink-0 rounded-lg border px-3 py-2 ${bulletBg}`}>
                                        <span className={`text-[24px] font-bold ${textMain}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                                            {step.heroMetric.value}
                                        </span>
                                        <span className={`text-[10px] ${textMuted}`}>{step.heroMetric.label}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                {step.bullets.map(bullet => (
                                    <div key={bullet} className={`rounded-lg border p-3 ${bulletBg}`}>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 size={14} style={{ color: step.accent }} className="shrink-0 mt-0.5" />
                                            <p className={`text-[12px] ${textMain}`}>{bullet}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {step.activeModulesPreview && step.activeModulesPreview.length > 0 && (
                                <div className={`rounded-xl border p-3 md:p-4 ${bulletBg}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: step.accent }}>
                                            <Zap size={12} />
                                            Gia al lavoro
                                        </span>
                                        <span className={`text-[10px] ${textMuted}`}>Top {step.activeModulesPreview.length}</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {step.activeModulesPreview.map(item => (
                                            <div
                                                key={item.module.id}
                                                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${t('bg-white/[0.03]', 'bg-black/[0.03]')}`}
                                            >
                                                <div
                                                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: `${item.ambitoColor}1F`, color: item.ambitoColor }}
                                                >
                                                    <Compass size={12} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`text-[12px] font-semibold ${textMain} truncate`}>{item.module.name}</p>
                                                    <p className={`text-[10px] ${textMuted}`}>
                                                        {item.ambitoName}
                                                    </p>
                                                </div>
                                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981]">
                                                    <span className="w-1 h-1 rounded-full bg-[#10B981] animate-pulse" />
                                                    LIVE
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step.actionLabel && (
                                <div>
                                    <button
                                        onClick={runStepAction}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-white"
                                        style={{ backgroundColor: step.accent }}
                                    >
                                        <PlayCircle size={13} />
                                        {step.actionLabel}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className={`relative border-t px-5 md:px-8 py-4 md:py-5 ${t('border-white/[0.06]', 'border-black/[0.08]')}`}>
                    <div className="flex items-center justify-between gap-3">
                        <button
                            onClick={goBack}
                            disabled={stepIndex === 0}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${subtleBg} ${textMain}`}
                        >
                            <ArrowLeft size={13} />
                            Indietro
                        </button>

                        <div className={`text-[11px] ${textMuted}`}>
                            Passo {stepIndex + 1} di {steps.length}
                        </div>

                        <button
                            onClick={goNext}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold text-white"
                            style={{ backgroundColor: step.accent }}
                        >
                            {isLastStep ? 'Inizia subito' : 'Continua'}
                            <ArrowRight size={13} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
