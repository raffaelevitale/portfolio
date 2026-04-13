import { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { toast } from 'sonner';
import { useTheme } from './ThemeContext';
import { ArrowLeft, User, Bell, Shield, Globe, Palette, Key, HelpCircle } from 'lucide-react';

interface AppSettingsPageProps {
  onClose: () => void;
}

export function AppSettingsPage({ onClose }: AppSettingsPageProps) {
  const { theme, toggleTheme, t } = useTheme();
  const [activeTab, setActiveTab] = useState('generale');

  const [profile, setProfile] = useState({
    nome: 'Luciano',
    cognome: 'Cavallero',
    email: 'luciano@crybu.com',
    ruolo: 'CEO',
    azienda: 'CRYBU S.r.l.',
  });

  const [notifSettings, setNotifSettings] = useState({
    email: true,
    push: true,
    ticket: true,
    report: false,
    marketing: false,
  });

  const [appSettings, setAppSettings] = useState({
    lingua: 'it',
    timezone: 'Europe/Rome',
    autoSave: true,
    animations: true,
    compactMode: false,
    soundEffects: false,
  });

  const tabs = [
    { id: 'generale', label: 'Generale', icon: Globe },
    { id: 'profilo', label: 'Profilo', icon: User },
    { id: 'notifiche', label: 'Notifiche', icon: Bell },
    { id: 'aspetto', label: 'Aspetto', icon: Palette },
    { id: 'sicurezza', label: 'Sicurezza e Privacy', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'aiuto', label: 'Aiuto', icon: HelpCircle },
  ];

  const bg = t('#111111', '#F5F5F5');
  const cardBg = t('#1A1A1A', '#FFFFFF');
  const borderColor = t('border-white/[0.06]', 'border-black/[0.08]');
  const textPrimary = t('text-white', 'text-[#111]');
  const textSecondary = t('text-[#888]', 'text-[#666]');
  const textTertiary = t('text-[#555]', 'text-[#999]');
  const inputBg = t('bg-[#222]', 'bg-[#F0F0F0]');
  const inputText = t('text-[#eee]', 'text-[#222]');
  const sidebarBg = t('bg-[#1A1A1A]', 'bg-white');
  const hoverBg = t('hover:bg-white/[0.04]', 'hover:bg-black/[0.04]');
  const switchBg = t('bg-[#333]', 'bg-[#ccc]');

  const SwitchToggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <Switch.Root checked={checked} onCheckedChange={onChange} className={`w-[38px] h-[20px] ${switchBg} rounded-full relative data-[state=checked]:bg-[#10B981] transition-colors outline-none shrink-0`}>
      <Switch.Thumb className="block w-[16px] h-[16px] bg-white rounded-full transition-transform translate-x-[2px] data-[state=checked]:translate-x-[18px] shadow-sm" />
    </Switch.Root>
  );

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden" style={{ backgroundColor: bg }}>
      <div className={`flex items-center gap-3 h-[48px] px-3 md:px-5 shrink-0 border-b ${borderColor}`} style={{ backgroundColor: cardBg }}>
        <button onClick={onClose} className={`p-1.5 rounded-md ${textSecondary} ${hoverBg} transition-colors`}>
          <ArrowLeft size={18} />
        </button>
        <span className={`text-[14px] font-bold ${textPrimary}`}>Impostazioni</span>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Tab bar: horizontal scroll on mobile, vertical sidebar on desktop */}
        <div className={`md:w-[260px] shrink-0 md:border-r ${borderColor} ${sidebarBg} overflow-x-auto md:overflow-x-hidden md:overflow-y-auto`}>
          <div className={`flex md:flex-col md:py-2 border-b md:border-b-0 ${borderColor}`}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 md:gap-2.5 whitespace-nowrap px-3 md:px-4 py-2.5 md:py-2 text-[13px] transition-colors shrink-0 md:w-full ${isActive
                      ? `${textPrimary} font-semibold ${t('bg-white/[0.04]', 'bg-black/[0.04]')} border-b-2 md:border-b-0 border-[#F73C1C]`
                      : `${textSecondary} ${hoverBg} border-b-2 md:border-b-0 border-transparent`
                    }`}
                >
                  <tab.icon size={14} className={isActive ? 'text-[#F73C1C]' : ''} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl">

            {/* GENERALE */}
            {activeTab === 'generale' && (
              <div className="flex flex-col gap-4">
                <div className="mb-1">
                  <h2 className={`text-[16px] font-bold ${textPrimary}`}>Generale</h2>
                  <p className={`text-[13px] ${textSecondary} mt-0.5`}>Impostazioni generali dell'applicazione</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className={`text-[12px] font-medium ${textSecondary}`}>Lingua</label>
                    <select
                      value={appSettings.lingua}
                      onChange={e => setAppSettings(p => ({ ...p, lingua: e.target.value }))}
                      className={`${inputBg} ${inputText} text-[13px] px-3 py-2 rounded-lg border ${borderColor} outline-none`}
                    >
                      <option value="it">Italiano</option>
                      <option value="en">English</option>
                      <option value="es">Espanol</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={`text-[12px] font-medium ${textSecondary}`}>Fuso orario</label>
                    <select
                      value={appSettings.timezone}
                      onChange={e => setAppSettings(p => ({ ...p, timezone: e.target.value }))}
                      className={`${inputBg} ${inputText} text-[13px] px-3 py-2 rounded-lg border ${borderColor} outline-none`}
                    >
                      <option value="Europe/Rome">Europe/Rome (GMT+1)</option>
                      <option value="Europe/London">Europe/London (GMT+0)</option>
                      <option value="America/New_York">America/New_York (GMT-5)</option>
                    </select>
                  </div>
                </div>
                <div className={`flex items-center justify-between py-2.5 border-b ${borderColor}`}>
                  <div>
                    <p className={`text-[13px] font-medium ${textPrimary}`}>Salvataggio automatico</p>
                    <p className={`text-[12px] ${textSecondary}`}>Salva automaticamente le modifiche</p>
                  </div>
                  <SwitchToggle checked={appSettings.autoSave} onChange={v => { setAppSettings(p => ({ ...p, autoSave: v })); toast.success(v ? 'Salvataggio automatico attivato' : 'Salvataggio automatico disattivato'); }} />
                </div>
              </div>
            )}

            {/* PROFILO */}
            {activeTab === 'profilo' && (
              <div className="flex flex-col gap-4">
                <div className="mb-1">
                  <h2 className={`text-[16px] font-bold ${textPrimary}`}>Profilo</h2>
                  <p className={`text-[13px] ${textSecondary} mt-0.5`}>Gestisci le informazioni del tuo account</p>
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F73C1C] text-[18px] font-bold text-white">LC</div>
                  <div>
                    <p className={`text-[14px] font-semibold ${textPrimary}`}>Luciano Cavallero</p>
                    <p className={`text-[13px] ${textSecondary}`}>luciano@crybu.com</p>
                    <button className="text-[12px] text-[#F73C1C] hover:text-[#ff5638] font-medium mt-0.5">Cambia foto</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Nome', key: 'nome' as const },
                    { label: 'Cognome', key: 'cognome' as const },
                    { label: 'Email', key: 'email' as const },
                    { label: 'Ruolo', key: 'ruolo' as const },
                    { label: 'Azienda', key: 'azienda' as const },
                  ].map(field => (
                    <div key={field.key} className={`flex flex-col gap-1 ${field.key === 'azienda' ? 'col-span-2' : ''}`}>
                      <label className={`text-[12px] font-medium ${textSecondary}`}>{field.label}</label>
                      <input
                        value={profile[field.key]}
                        onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                        className={`${inputBg} ${inputText} text-[13px] px-3 py-2 rounded-lg border ${borderColor} outline-none focus:border-[#F73C1C]/40 transition-colors`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => toast.success('Profilo aggiornato con successo')}
                  className="self-start px-4 py-2 bg-[#F73C1C] hover:bg-[#e63518] text-white text-[13px] font-semibold rounded-lg transition-colors mt-1"
                >
                  Salva modifiche
                </button>
              </div>
            )}

            {/* NOTIFICHE */}
            {activeTab === 'notifiche' && (
              <div className="flex flex-col gap-3">
                <div className="mb-1">
                  <h2 className={`text-[16px] font-bold ${textPrimary}`}>Notifiche</h2>
                  <p className={`text-[13px] ${textSecondary} mt-0.5`}>Configura come ricevere le notifiche</p>
                </div>
                {[
                  { label: 'Notifiche email', desc: 'Ricevi aggiornamenti via email', key: 'email' as const },
                  { label: 'Notifiche push', desc: 'Notifiche nel browser', key: 'push' as const },
                  { label: 'Nuovi ticket', desc: 'Avvisa per ogni nuovo ticket', key: 'ticket' as const },
                  { label: 'Report settimanali', desc: 'Riepilogo settimanale automatico', key: 'report' as const },
                  { label: 'Aggiornamenti prodotto', desc: 'Novità e funzionalità', key: 'marketing' as const },
                ].map(item => (
                  <div key={item.key} className={`flex items-center justify-between py-2.5 border-b ${borderColor}`}>
                    <div>
                      <p className={`text-[13px] font-medium ${textPrimary}`}>{item.label}</p>
                      <p className={`text-[12px] ${textSecondary}`}>{item.desc}</p>
                    </div>
                    <SwitchToggle checked={notifSettings[item.key]} onChange={v => { setNotifSettings(p => ({ ...p, [item.key]: v })); toast.success(`${item.label} ${v ? 'attivate' : 'disattivate'}`); }} />
                  </div>
                ))}
              </div>
            )}

            {/* ASPETTO */}
            {activeTab === 'aspetto' && (
              <div className="flex flex-col gap-3">
                <div className="mb-1">
                  <h2 className={`text-[16px] font-bold ${textPrimary}`}>Aspetto</h2>
                  <p className={`text-[13px] ${textSecondary} mt-0.5`}>Personalizza l'interfaccia</p>
                </div>
                <div className={`flex items-center justify-between py-3 border-b ${borderColor}`}>
                  <div>
                    <p className={`text-[13px] font-medium ${textPrimary}`}>Tema</p>
                    <p className={`text-[12px] ${textSecondary}`}>Scegli tra modalità chiara e scura</p>
                  </div>
                  <div className="flex gap-2">
                    {(['dark', 'light'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => { if (theme !== mode) toggleTheme(); }}
                        className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg border transition-all ${theme === mode
                            ? 'border-[#F73C1C] bg-[#F73C1C]/[0.06]'
                            : `${borderColor} ${hoverBg}`
                          }`}
                      >
                        <div className={`w-10 h-6 rounded border ${mode === 'dark' ? 'bg-[#1A1A1A] border-white/10' : 'bg-[#F5F5F5] border-black/10'}`} />
                        <span className={`text-[10px] font-medium ${theme === mode ? 'text-[#F73C1C]' : textSecondary}`}>
                          {mode === 'dark' ? 'Scuro' : 'Chiaro'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { label: 'Animazioni', desc: 'Transizioni fluide nell\'interfaccia', key: 'animations' as const },
                  { label: 'Modalità compatta', desc: 'Riduci spaziatura elementi', key: 'compactMode' as const },
                  { label: 'Effetti sonori', desc: 'Feedback audio per azioni', key: 'soundEffects' as const },
                ].map(item => (
                  <div key={item.key} className={`flex items-center justify-between py-2.5 border-b ${borderColor}`}>
                    <div>
                      <p className={`text-[13px] font-medium ${textPrimary}`}>{item.label}</p>
                      <p className={`text-[12px] ${textSecondary}`}>{item.desc}</p>
                    </div>
                    <SwitchToggle checked={appSettings[item.key]} onChange={v => { setAppSettings(p => ({ ...p, [item.key]: v })); toast.success(`${item.label} ${v ? 'attivate' : 'disattivate'}`); }} />
                  </div>
                ))}
              </div>
            )}

            {/* SICUREZZA E PRIVACY */}
            {activeTab === 'sicurezza' && (
              <div className="flex flex-col gap-4">
                <div className="mb-1">
                  <h2 className={`text-[16px] font-bold ${textPrimary}`}>Sicurezza e Privacy</h2>
                  <p className={`text-[13px] ${textSecondary} mt-0.5`}>Gestisci la sicurezza del tuo account e i tuoi dati</p>
                </div>

                {/* Sicurezza */}
                <span className={`text-[10px] font-semibold ${textTertiary} uppercase tracking-[1.5px]`}>Sicurezza Account</span>
                <div className={`p-4 rounded-xl border ${borderColor}`} style={{ backgroundColor: cardBg }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-[13px] font-medium ${textPrimary}`}>Cambio password</p>
                      <p className={`text-[12px] ${textSecondary}`}>Ultimo cambio: 15 giorni fa</p>
                    </div>
                    <button
                      onClick={() => toast('Funzionalità in arrivo', { description: 'Il cambio password sarà disponibile a breve' })}
                      className="px-3 py-1.5 bg-[#F73C1C] hover:bg-[#e63518] text-white text-[13px] font-semibold rounded-lg transition-colors"
                    >
                      Cambia
                    </button>
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${borderColor}`} style={{ backgroundColor: cardBg }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-[13px] font-medium ${textPrimary}`}>Autenticazione a due fattori</p>
                      <p className={`text-[12px] ${textSecondary}`}>Aggiungi un livello di sicurezza extra</p>
                    </div>
                    <button className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border ${borderColor} ${textPrimary} ${hoverBg} transition-colors`}>
                      Configura
                    </button>
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${borderColor}`} style={{ backgroundColor: cardBg }}>
                  <p className={`text-[13px] font-medium ${textPrimary} mb-2`}>Sessioni attive</p>
                  <div className="flex flex-col gap-1.5">
                    {['Chrome su MacBook Pro — Adesso', 'Safari su iPhone 15 — 2 ore fa'].map((s, i) => (
                      <div key={i} className={`flex items-center justify-between py-1.5 border-b ${borderColor} last:border-0`}>
                        <span className={`text-[13px] ${textPrimary}`}>{s}</span>
                        {i > 0 && <button className="text-[10px] text-[#F73C1C] font-medium">Disconnetti</button>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy */}
                <span className={`text-[10px] font-semibold ${textTertiary} uppercase tracking-[1.5px] mt-2`}>Privacy e Dati</span>
                <div className={`p-4 rounded-xl border ${borderColor}`} style={{ backgroundColor: cardBg }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-[13px] font-medium ${textPrimary}`}>Esporta dati</p>
                      <p className={`text-[12px] ${textSecondary}`}>Scarica una copia di tutti i tuoi dati</p>
                    </div>
                    <button className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border ${borderColor} ${textPrimary} ${hoverBg} transition-colors`}>
                      Esporta
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-[#F73C1C]/20 bg-[#F73C1C]/[0.03]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-[#F73C1C]">Elimina account</p>
                      <p className={`text-[12px] ${textSecondary}`}>Questa azione è irreversibile</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-[#F73C1C] text-[#F73C1C] hover:bg-[#F73C1C] hover:text-white transition-colors">
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API KEYS */}
            {activeTab === 'api' && (
              <div className="flex flex-col gap-4">
                <div className="mb-1">
                  <h2 className={`text-[16px] font-bold ${textPrimary}`}>API Keys</h2>
                  <p className={`text-[13px] ${textSecondary} mt-0.5`}>Gestisci le chiavi API per integrazioni esterne</p>
                </div>
                <div className={`p-4 rounded-xl border ${borderColor}`} style={{ backgroundColor: cardBg }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className={`text-[13px] font-medium ${textPrimary}`}>Production Key</p>
                      <p className={`text-[12px] ${textSecondary}`}>Creata il 1 Mar 2026</p>
                    </div>
                    <span className="text-[10px] font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">Attiva</span>
                  </div>
                  <div className={`${inputBg} rounded-lg px-3 py-2 font-mono text-[12px] ${textTertiary}`}>
                    crxbu_pk_••••••••••••••••••••3f7a
                  </div>
                </div>
                <button
                  onClick={() => toast.success('Nuova chiave API generata')}
                  className="self-start px-4 py-2 bg-[#F73C1C] hover:bg-[#e63518] text-white text-[13px] font-semibold rounded-lg transition-colors"
                >
                  + Genera nuova chiave
                </button>
              </div>
            )}

            {/* AIUTO */}
            {activeTab === 'aiuto' && (
              <div className="flex flex-col gap-3">
                <div className="mb-1">
                  <h2 className={`text-[16px] font-bold ${textPrimary}`}>Aiuto e Supporto</h2>
                  <p className={`text-[13px] ${textSecondary} mt-0.5`}>Trova risposte e contatta il supporto</p>
                </div>
                {[
                  { title: 'Centro assistenza', desc: 'Guide, tutorial e FAQ', cta: 'Visita' },
                  { title: 'Contatta il supporto', desc: 'Il nostro team risponde entro 2 ore', cta: 'Contatta' },
                  { title: 'Community', desc: 'Unisciti alla community CRXBU', cta: 'Partecipa' },
                  { title: 'Changelog', desc: 'Scopri le ultime novità', cta: 'Leggi' },
                ].map(item => (
                  <div key={item.title} className={`flex items-center justify-between p-4 rounded-xl border ${borderColor}`} style={{ backgroundColor: cardBg }}>
                    <div>
                      <p className={`text-[13px] font-medium ${textPrimary}`}>{item.title}</p>
                      <p className={`text-[12px] ${textSecondary}`}>{item.desc}</p>
                    </div>
                    <button className="px-3 py-1.5 text-[12px] font-semibold text-[#F73C1C] border border-[#F73C1C]/30 rounded-lg hover:bg-[#F73C1C]/[0.06] transition-colors">
                      {item.cta}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}