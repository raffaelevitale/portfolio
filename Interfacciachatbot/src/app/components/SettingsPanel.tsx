import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Switch from '@radix-ui/react-switch';
import { RotateCcw, ChevronDown, ChevronUp, X, PanelRightClose } from 'lucide-react';
import { useTheme } from './ThemeContext';

const toneLabels = ['Empatico', 'Amichevole', 'Professionale', 'Formale'];
const lengthLabels = ['Breve', 'Concisa', 'Bilanciata', 'Dettagliata'];

export function SettingsPanel({ onClose, onTogglePanel }: { onClose?: () => void; onTogglePanel?: () => void }) {
  const { t } = useTheme();
  const [creativity, setCreativity] = useState([70]);
  const [length, setLength] = useState([50]);
  const [tone, setTone] = useState([66]);
  const [autoEscalation, setAutoEscalation] = useState(true);
  const [contextMemory, setContextMemory] = useState(true);
  const [multiLanguage, setMultiLanguage] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [maxTokens, setMaxTokens] = useState([75]);
  const [topP, setTopP] = useState([90]);

  const getLengthLabel = (v: number) => lengthLabels[Math.min(3, Math.floor(v / 25))];
  const getToneLabel = (v: number) => toneLabels[Math.min(3, Math.floor(v / 25))];
  const resetAll = () => { setCreativity([70]); setLength([50]); setTone([66]); setAutoEscalation(true); setContextMemory(true); setMultiLanguage(false); setMaxTokens([75]); setTopP([90]); };

  const panelBg = t('#111111', '#FAFAFA');
  const headerBg = t('#1A1A1A', '#FFFFFF');
  const borderCls = t('border-white/[0.06]', 'border-black/[0.08]');
  const textLabel = t('text-[#F5F5F5]', 'text-[#222]');
  const textMuted = t('text-[#444]', 'text-[#bbb]');
  const textSub = t('text-[#555]', 'text-[#999]');
  const textValue = t('text-[#666]', 'text-[#888]');
  const trackBg = t('bg-white/[0.08]', 'bg-black/[0.1]');
  const rangeBg = t('bg-[#444]', 'bg-[#aaa]');
  const thumbBg = t('bg-[#666]', 'bg-[#888]');
  const divider = t('bg-white/[0.06]', 'bg-black/[0.06]');
  const switchBg = t('bg-[#333]', 'bg-[#ccc]');
  const iconColor = t('text-[#666] hover:text-white hover:bg-white/[0.04]', 'text-[#999] hover:text-[#333] hover:bg-black/[0.04]');

  return (
    <aside className={`w-[var(--layout-sidepanel-w)] border-l ${borderCls} flex flex-col h-full shrink-0 transition-colors`} style={{ backgroundColor: panelBg }}>
      <div className={`flex items-center justify-between h-[var(--layout-subbar-h)] px-5 border-b ${borderCls} shrink-0`} style={{ backgroundColor: headerBg }}>
        <span className={`text-[13px] font-bold ${t('text-white', 'text-[#111]')}`}>Parametri</span>
        <div className="flex items-center gap-0.5">
          <button onClick={resetAll} className={`p-1.5 rounded-md ${iconColor} transition-colors`} title="Ripristina">
            <RotateCcw size={13} />
          </button>
          {onTogglePanel && (
            <button onClick={onTogglePanel} className={`p-1.5 rounded-md ${iconColor} transition-colors hidden md:block`} title="Nascondi pannello">
              <PanelRightClose size={14} />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className={`p-1.5 rounded-md ${iconColor} transition-colors md:hidden`} title="Chiudi">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className={`text-[13px] font-medium ${textLabel}`}>Creatività</label>
            <span className="text-[13px] font-medium text-[#F73C1C]">{(creativity[0] / 100).toFixed(1)}</span>
          </div>
          <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" value={creativity} onValueChange={setCreativity} max={100} step={1}>
            <Slider.Track className={`${trackBg} relative grow rounded-full h-[4px]`}>
              <Slider.Range className="absolute bg-[#F73C1C] rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-3.5 h-3.5 bg-[#F73C1C] rounded-full shadow-[0_2px_10px] shadow-black/50 hover:bg-[#ff5638] focus:outline-none focus:ring-2 focus:ring-[#F73C1C]/40" />
          </Slider.Root>
          <div className={`flex justify-between text-[11px] ${textMuted}`}><span>Preciso</span><span>Creativo</span></div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className={`text-[13px] font-medium ${textLabel}`}>Lunghezza risposta</label>
            <span className={`text-[13px] font-medium ${textValue}`}>{getLengthLabel(length[0])}</span>
          </div>
          <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" value={length} onValueChange={setLength} max={100} step={1}>
            <Slider.Track className={`${trackBg} relative grow rounded-full h-[4px]`}><Slider.Range className={`absolute ${rangeBg} rounded-full h-full`} /></Slider.Track>
            <Slider.Thumb className={`block w-3 h-3 ${thumbBg} rounded-full shadow-[0_2px_10px] shadow-black/50 focus:outline-none`} />
          </Slider.Root>
          <div className={`flex justify-between text-[11px] ${textMuted}`}><span>Breve</span><span>Dettagliata</span></div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className={`text-[13px] font-medium ${textLabel}`}>Tono risposte</label>
            <span className={`text-[13px] font-medium ${textValue}`}>{getToneLabel(tone[0])}</span>
          </div>
          <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" value={tone} onValueChange={setTone} max={100} step={1}>
            <Slider.Track className={`${trackBg} relative grow rounded-full h-[4px]`}><Slider.Range className={`absolute ${rangeBg} rounded-full h-full`} /></Slider.Track>
            <Slider.Thumb className={`block w-3 h-3 ${thumbBg} rounded-full shadow-[0_2px_10px] shadow-black/50 focus:outline-none`} />
          </Slider.Root>
          <div className={`flex justify-between text-[11px] ${textMuted}`}><span>Empatico</span><span>Formale</span></div>
        </div>

        <div className={`h-[1px] ${divider}`} />

        <div className="flex flex-col gap-4">
          {[
            { label: 'Auto-escalation', desc: 'Trasferisci a operatore', value: autoEscalation, onChange: setAutoEscalation },
            { label: 'Memoria contesto', desc: 'Ricorda conversazioni', value: contextMemory, onChange: setContextMemory },
            { label: 'Multi-lingua', desc: 'Rispondi in più lingue', value: multiLanguage, onChange: setMultiLanguage },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className={`text-[12px] font-medium ${textLabel}`}>{item.label}</span>
                <span className={`text-[11px] ${textSub} mt-0.5`}>{item.desc}</span>
              </div>
              <Switch.Root checked={item.value} onCheckedChange={item.onChange} className={`w-[34px] h-[18px] ${switchBg} rounded-full relative data-[state=checked]:bg-[#10B981] transition-colors outline-none shrink-0`}>
                <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full transition-transform translate-x-[2px] data-[state=checked]:translate-x-[18px]" />
              </Switch.Root>
            </div>
          ))}
        </div>

        <div className={`h-[1px] ${divider}`} />

        <button onClick={() => setAdvancedOpen(!advancedOpen)} className={`flex items-center justify-between text-[13px] font-medium ${t('text-[#888] hover:text-[#ccc]', 'text-[#888] hover:text-[#444]')} transition-colors`}>
          <span>Parametri avanzati</span>
          {advancedOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {advancedOpen && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className={`text-[12px] font-medium ${t('text-[#999]', 'text-[#777]')}`}>Max Tokens</label>
                <span className={`text-[12px] font-medium ${textValue}`}>{Math.round(maxTokens[0] * 40.96)}</span>
              </div>
              <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" value={maxTokens} onValueChange={setMaxTokens} max={100} step={1}>
                <Slider.Track className={`${trackBg} relative grow rounded-full h-[3px]`}><Slider.Range className={`absolute ${rangeBg} rounded-full h-full`} /></Slider.Track>
                <Slider.Thumb className={`block w-3 h-3 ${thumbBg} rounded-full shadow-[0_2px_10px] shadow-black/50 focus:outline-none`} />
              </Slider.Root>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className={`text-[12px] font-medium ${t('text-[#999]', 'text-[#777]')}`}>Top P</label>
                <span className={`text-[12px] font-medium ${textValue}`}>{(topP[0] / 100).toFixed(2)}</span>
              </div>
              <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" value={topP} onValueChange={setTopP} max={100} step={1}>
                <Slider.Track className={`${trackBg} relative grow rounded-full h-[3px]`}><Slider.Range className={`absolute ${rangeBg} rounded-full h-full`} /></Slider.Track>
                <Slider.Thumb className={`block w-3 h-3 ${thumbBg} rounded-full shadow-[0_2px_10px] shadow-black/50 focus:outline-none`} />
              </Slider.Root>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
