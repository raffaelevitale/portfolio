import { useState } from 'react';
import type { ElementType } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, LayoutDashboard, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface InterfaceOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
  onOpenEcosystem: () => void;
  onOpenSubscriptions: () => void;
}

type StepAction = 'ecosystem' | 'subscriptions' | null;

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  accent: string;
  Icon: ElementType;
  actionLabel?: string;
  action: StepAction;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'automation-start',
    title: 'Sta gia lavorando per la tua azienda',
    description:
      'Abbiamo gia preparato una base operativa per accelerare i flussi aziendali. Tu scegli le priorita, l\'interfaccia coordina i processi.',
    bullets: [
      'Orchestrazione centralizzata tra moduli e reparti',
      'Meno attivita manuali ripetitive',
      'Visibilita immediata su stato operativo e costi',
    ],
    accent: '#F73C1C',
    Icon: Sparkles,
    action: null,
  },
  {
    id: 'ecosystem-focus',
    title: 'Ecosistema chiaro e governabile',
    description:
      'La sidebar Ecosistema e ottimizzata per orientarti subito: sistemi, processi e moduli in una gerarchia leggibile e veloce.',
    bullets: [
      'Ricerca rapida per modulo o processo',
      'Riepilogo moduli attivi in tempo reale',
      'Navigazione per sistema con focus operativo',
    ],
    accent: '#F59E0B',
    Icon: Compass,
    actionLabel: 'Apri Ecosistema',
    action: 'ecosystem',
  },
  {
    id: 'subscriptions-focus',
    title: 'Sottoscrizioni semplici e centrali',
    description:
      'La gestione delle terze parti e concentrata nel pannello principale: aggiorni servizi, costi e stato operativo senza passaggi inutili.',
    bullets: [
      'Registro unico per provider esterni',
      'Controllo mensile della spesa AI',
      'Indicatori di abbonamento e operativita',
    ],
    accent: '#10B981',
    Icon: LayoutDashboard,
    actionLabel: 'Apri Sottoscrizioni',
    action: 'subscriptions',
  },
  {
    id: 'ready',
    title: 'Interfaccia pronta',
    description:
      'Ora puoi partire subito: attiva i moduli prioritari, allinea le sottoscrizioni e avvia il primo ciclo di automazione.',
    bullets: [
      'Riduci tempi di coordinamento',
      'Mantieni controllo strategico per area',
      'Scala i processi in modo progressivo',
    ],
    accent: '#3B82F6',
    Icon: ShieldCheck,
    action: null,
  },
];

const operationalSignals = [
  'Instradamento richieste in esecuzione',
  'Monitor costi AI sincronizzato',
  'Controllo processi attivi completato',
];

export function InterfaceOnboarding({
  onComplete,
  onSkip,
  onOpenEcosystem,
  onOpenSubscriptions,
}: InterfaceOnboardingProps) {
  const { t } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);

  const step = onboardingSteps[stepIndex];
  const isLastStep = stepIndex === onboardingSteps.length - 1;

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
    setStepIndex((prev) => prev + 1);
  };

  const goBack = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
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
              Onboarding interfaccia
            </div>
            <button
              onClick={onSkip}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${subtleBg} ${textMuted}`}
            >
              Salta
            </button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {onboardingSteps.map((item, index) => (
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
                <div>
                  <h2 className={`text-[20px] md:text-[26px] leading-tight font-bold ${textMain}`}>{step.title}</h2>
                  <p className={`text-[13px] md:text-[14px] mt-2 ${textSub}`}>{step.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {step.bullets.map((bullet) => (
                  <div key={bullet} className={`rounded-lg border p-3 ${bulletBg}`}>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} style={{ color: step.accent }} className="shrink-0 mt-0.5" />
                      <p className={`text-[12px] ${textMain}`}>{bullet}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`rounded-lg border p-3 ${bulletBg}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: step.accent }}>
                    <span className="relative inline-flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-55" style={{ backgroundColor: step.accent }} />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: step.accent }} />
                    </span>
                    <Activity size={12} />
                    Stato operativo live
                  </span>
                  <span className={`text-[10px] ${textMuted}`}>{42 + stepIndex * 19}%</span>
                </div>

                <div className={`mt-2 h-[4px] w-full rounded-full ${t('bg-white/[0.08]', 'bg-black/[0.08]')}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(99, 42 + stepIndex * 19)}%` }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="h-[4px] rounded-full"
                    style={{ backgroundColor: step.accent }}
                  />
                </div>

                <div className="mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-2">
                  {operationalSignals.map((signal, index) => (
                    <motion.div
                      key={signal}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`rounded-md px-2.5 py-2 text-[11px] ${t('bg-white/[0.04]', 'bg-black/[0.04]')} ${textMain}`}
                    >
                      {signal}
                    </motion.div>
                  ))}
                </div>
              </div>

              {step.actionLabel ? (
                <div>
                  <button
                    onClick={runStepAction}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-white"
                    style={{ backgroundColor: step.accent }}
                  >
                    {step.actionLabel}
                    <ArrowRight size={13} />
                  </button>
                </div>
              ) : null}
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
              Passo {stepIndex + 1} di {onboardingSteps.length}
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
