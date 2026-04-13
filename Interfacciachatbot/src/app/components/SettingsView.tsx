import { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { Save, RotateCcw } from 'lucide-react';
import type { Module } from './data';
import { useTheme } from './ThemeContext';

interface SettingsViewProps { module: Module; }

const settingsConfigs: Record<string, { label: string; desc: string; default: boolean }[]> = {
  'ass-ticket': [
    { label: 'Categorizzazione automatica', desc: 'Smista automaticamente i ticket in categorie', default: true },
    { label: 'Priorità intelligente', desc: 'Analizza urgenza e impatto per assegnare priorità', default: true },
    { label: 'Auto-escalation', desc: 'Trasferisci a operatore dopo 3 tentativi falliti', default: false },
    { label: 'Notifiche SLA', desc: 'Avvisa quando un ticket supera il tempo limite', default: true },
    { label: 'Risposta automatica', desc: 'Invia conferma ricezione al cliente', default: true },
  ],
  default: [
    { label: 'Automazione attiva', desc: 'Abilita le automazioni per questo modulo', default: true },
    { label: 'Notifiche email', desc: 'Ricevi aggiornamenti via email', default: false },
    { label: 'Log attività', desc: 'Registra tutte le azioni eseguite', default: true },
    { label: 'Modalità test', desc: 'Esegui in modalità test senza effetti reali', default: false },
  ],
};

export function SettingsView({ module }: SettingsViewProps) {
  const { t } = useTheme();
  const config = settingsConfigs[module.id] || settingsConfigs.default;
  const defaultValues = Object.fromEntries(config.map(c => [c.label, c.default]));
  const [values, setValues] = useState<Record<string, boolean>>(defaultValues);
  const [saved, setSaved] = useState(false);

  const isDirty = config.some(c => values[c.label] !== c.default);
  const toggle = (label: string) => { setValues(p => ({ ...p, [label]: !p[label] })); setSaved(false); };
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const reset = () => { setValues(defaultValues); setSaved(false); };

  const cardBg = t('bg-[#1A1A1A] border-white/[0.04]', 'bg-white border-black/[0.06]');
  const textMain = t('text-white', 'text-[#111]');
  const textSub = t('text-[#888]', 'text-[#666]');
  const textLabel = t('text-[#eee]', 'text-[#222]');
  const textDesc = t('text-[#777]', 'text-[#888]');
  const borderCls = t('border-white/[0.04]', 'border-black/[0.06]');
  const ruleBg = t('bg-[#1A1A1A]', 'bg-[#F8F8F8]');
  const ruleText = t('text-[#ccc]', 'text-[#444]');
  const switchBg = t('bg-[#333]', 'bg-[#ccc]');
  const btnBorder = t('border-white/[0.06]', 'border-black/[0.1]');
  const btnText = t('text-[#888] hover:text-white hover:bg-white/[0.04]', 'text-[#777] hover:text-[#222] hover:bg-black/[0.04]');

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-3">
          <div>
            <h2 className={`text-[12px] md:text-[13px] font-semibold ${textMain}`}>{module.name}</h2>
            <p className={`text-[11px] md:text-[12px] ${textSub} mt-1`}>{module.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={reset} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] md:text-[12px] ${btnText} transition-colors border ${btnBorder}`}>
              <RotateCcw size={13} /> Ripristina
            </button>
            <button onClick={save} disabled={!isDirty && !saved} className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-[11px] md:text-[12px] font-semibold transition-colors ${saved ? 'bg-[#10B981] text-white' : isDirty ? 'bg-[#F59E0B] hover:bg-[#e8900a] text-white' : t('bg-[#333] text-[#666]', 'bg-[#ddd] text-[#999]') + ' cursor-not-allowed'}`}>
              {saved ? <><span>✓</span> Salvato</> : <><Save size={13} /> Salva</>}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {config.map(c => (
            <div key={c.label} className={`flex items-center justify-between py-4 border-b ${borderCls}`}>
              <div className="flex flex-col flex-1 mr-4">
                <span className={`text-[14px] font-medium ${textLabel}`}>{c.label}</span>
                <span className={`text-[12px] ${textDesc} mt-0.5`}>{c.desc}</span>
              </div>
              <Switch.Root
                checked={values[c.label]}
                onCheckedChange={() => toggle(c.label)}
                className={`w-[40px] h-[22px] ${switchBg} rounded-full relative data-[state=checked]:bg-[#10B981] transition-colors outline-none shrink-0`}
              >
                <Switch.Thumb className="block w-[18px] h-[18px] bg-white rounded-full transition-transform translate-x-[2px] data-[state=checked]:translate-x-[20px] shadow-sm" />
              </Switch.Root>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className={`text-[15px] font-bold ${textMain} mb-4`}>Regole di smistamento</h3>
          <div className="flex flex-col gap-3">
            {['Se contiene "urgente" → Priorità Alta', 'Se contiene "fattura" → Categoria Billing', 'Se nessuna regola → Assegna a coda generale'].map((rule, i) => (
              <div key={i} className={`flex items-center gap-3 ${ruleBg} border ${borderCls} rounded-lg px-4 py-3`}>
                <div className="w-5 h-5 rounded bg-[#F73C1C]/10 flex items-center justify-center text-[#F73C1C] text-[11px] font-bold shrink-0">{i + 1}</div>
                <span className={`text-[13px] ${ruleText}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{rule}</span>
              </div>
            ))}
            <button className="text-[12px] text-[#F73C1C] hover:text-[#ff5638] font-medium mt-1 text-left transition-colors">+ Aggiungi regola</button>
          </div>
        </div>
      </div>
    </div>
  );
}