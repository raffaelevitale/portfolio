import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Bell, X, LogOut, User, HelpCircle, Menu, Settings, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import logoLight from '../../../loghi/BiancoNero.png';
import logoDark from '../../../loghi/nerobianco.png';
import { useTheme } from './ThemeContext';

interface HeaderProps {
  onOpenSettings: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  onGoHome?: () => void;
  onLogout?: () => void;
  greetingName?: string;
  operativityPercent?: number;
  activeModulesCount?: number;
}

export function Header({
  onOpenSettings,
  onToggleSidebar,
  sidebarOpen,
  onGoHome,
  onLogout,
  greetingName = 'Luciano',
  operativityPercent = 0,
  activeModulesCount = 0,
}: HeaderProps) {
  const { theme, toggleTheme, t } = useTheme();
  const currentLogo = theme === 'dark' ? logoDark : logoLight;
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifs, setNotifs] = useState([
    { id: 1, title: 'Nuovo ticket #1042', desc: 'Cliente richiede assistenza urgente', time: '5 min fa', read: false },
    { id: 2, title: 'FAQ aggiornate', desc: 'Knowledge base sincronizzata', time: '1 ora fa', read: false },
    { id: 3, title: 'Report completato', desc: 'Report settimanale assistenza pronto', time: '3 ore fa', read: true },
  ]);
  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const headerBg = t('#1A1A1A', '#FFFFFF');
  const borderCls = t('border-white/[0.06]', 'border-black/[0.08]');
  const iconCls = t('text-[#666] hover:text-[#F5F5F5]', 'text-[#999] hover:text-[#222]');
  const dropBg = t('bg-[#1E1E1E]', 'bg-white');
  const dropBorder = t('border-white/[0.08]', 'border-black/[0.1]');
  const textMain = t('text-white', 'text-[#111]');
  const textSub = t('text-[#888]', 'text-[#666]');
  const textMuted = t('text-[#555]', 'text-[#999]');
  const hoverItem = t('hover:bg-white/[0.04]', 'hover:bg-black/[0.04]');
  const taglineColor = t('text-[#555]', 'text-[#999]');
  const normalizedOperativity = Math.max(0, Math.min(100, operativityPercent));
  const hour = new Date().getHours();
  const saluto = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex h-[var(--layout-header-h)] w-full items-center justify-between px-3 md:px-4 shrink-0 relative z-50 border-b ${borderCls}`}
      style={{ backgroundColor: headerBg }}
    >
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Hamburger - mobile only */}
        {onToggleSidebar && (
          <motion.button
            onClick={onToggleSidebar}
            whileTap={{ scale: 0.92 }}
            className={`md:hidden p-1.5 rounded-md ${iconCls} transition-colors ${hoverItem}`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        )}
        <motion.button
          onClick={onGoHome}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <img src={currentLogo} alt="CRYBU" className="h-[20px] md:h-[22px] w-auto object-contain" />
        </motion.button>
      </div>

      <div className="hidden lg:flex items-center gap-3 min-w-0">
        <span className={`text-[12px] ${taglineColor} truncate`}>
          {saluto} {greetingName}, stiamo coordinando i moduli AI per te.
        </span>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className={`flex items-center gap-2 rounded-full px-2.5 py-1 border ${t('border-white/[0.08] bg-white/[0.03]', 'border-black/[0.08] bg-black/[0.03]')}`}
        >
          <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-55" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10B981]" />
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10B981]">
            <Activity size={11} />
            Operativita {normalizedOperativity}%
          </span>
          <div className={`h-[4px] w-14 rounded-full ${t('bg-white/[0.08]', 'bg-black/[0.08]')}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${normalizedOperativity}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="h-[4px] rounded-full bg-[#10B981]"
            />
          </div>
          <span className={`text-[10px] ${textMuted}`}>{activeModulesCount} attivi</span>
        </motion.div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        <motion.button
          onClick={toggleTheme}
          className={`${iconCls} transition-colors p-1.5 rounded-md ${hoverItem}`}
          whileTap={{ scale: 0.9, rotate: 15 }}
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </motion.button>

        <div ref={notifRef} className="relative">
          <motion.button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            whileTap={{ scale: 0.9 }}
            className={`relative ${iconCls} transition-colors p-1.5 rounded-md ${hoverItem}`}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#F73C1C] text-[9px] font-bold text-white"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-full mt-2 w-[280px] md:w-[300px] ${dropBg} border ${dropBorder} rounded-xl shadow-2xl shadow-black/40 overflow-hidden`}
              >
                <div className={`flex items-center justify-between px-4 py-3 border-b ${borderCls}`}>
                  <span className={`text-[13px] font-bold ${textMain}`}>Notifiche</span>
                  {unreadCount > 0 && (
                    <button onClick={() => setNotifs(p => p.map(n => ({ ...n, read: true })))} className="text-[11px] text-[#F73C1C] hover:text-[#ff5638]">Segna tutte lette</button>
                  )}
                </div>
                <div className="max-h-[260px] overflow-y-auto">
                  {notifs.map(n => (
                    <div key={n.id} className={`flex gap-3 px-4 py-3 ${hoverItem} cursor-pointer border-b ${t('border-white/[0.04]', 'border-black/[0.04]')} last:border-0 ${!n.read ? 'bg-[#F73C1C]/[0.03]' : ''}`}
                      onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    >
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#F73C1C] mt-1.5 shrink-0" />}
                      <div className={`flex flex-col flex-1 min-w-0 ${n.read ? 'ml-3' : ''}`}>
                        <span className={`text-[12px] font-semibold ${textMain} truncate`}>{n.title}</span>
                        <span className={`text-[11px] ${textSub} truncate`}>{n.desc}</span>
                        <span className={`text-[10px] ${textMuted} mt-1`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={profileRef} className="relative">
          <motion.button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F73C1C] text-[11px] font-bold text-white cursor-pointer hover:ring-2 hover:ring-[#F73C1C]/40 transition-all"
          >
            LC
          </motion.button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-full mt-2 w-[200px] ${dropBg} border ${dropBorder} rounded-xl shadow-2xl shadow-black/40 overflow-hidden`}
              >
                <div className={`px-4 py-3 border-b ${borderCls}`}>
                  <p className={`text-[13px] font-semibold ${textMain}`}>Luciano Cavallero</p>
                  <p className={`text-[11px] ${textMuted}`}>luciano@crybu.com</p>
                </div>
                <div className="py-1">
                  {[
                    { icon: User, label: 'Profilo', action: onOpenSettings },
                    { icon: Settings, label: 'Impostazioni', action: onOpenSettings },
                    { icon: HelpCircle, label: 'Aiuto', action: () => { } },
                  ].map(item => (
                    <button key={item.label} onClick={() => { item.action(); setProfileOpen(false); }} className={`flex items-center gap-2.5 w-full px-4 py-2 text-[12px] ${t('text-[#ccc]', 'text-[#444]')} ${hoverItem} transition-colors`}>
                      <item.icon size={14} className={textSub} /> {item.label}
                    </button>
                  ))}
                </div>
                <div className={`border-t ${borderCls} py-1`}>
                  <button
                    onClick={() => { setProfileOpen(false); setShowLogoutModal(true); }}
                    className={`flex items-center gap-2.5 w-full px-4 py-2 text-[12px] text-[#F73C1C] ${hoverItem} transition-colors`}
                  >
                    <LogOut size={14} /> Esci
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={() => setShowLogoutModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
              className={`relative w-[340px] max-w-[90vw] ${dropBg} border ${dropBorder} rounded-2xl shadow-2xl shadow-black/50 p-6`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F73C1C]/10">
                  <LogOut size={22} className="text-[#F73C1C]" />
                </div>
                <div>
                  <h3 className={`text-[15px] font-bold ${textMain}`}>Conferma logout</h3>
                  <p className={`text-[12px] ${textSub} mt-1`}>
                    Sei sicuro di voler uscire dal tuo account?
                  </p>
                </div>
                <div className="flex gap-2.5 w-full mt-2">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className={`flex-1 px-4 py-2.5 text-[12px] font-semibold rounded-xl border ${dropBorder} ${textMain} ${hoverItem} transition-colors`}
                  >
                    Annulla
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setShowLogoutModal(false);
                      toast.success('Logout effettuato');
                      onLogout?.();
                    }}
                    className="flex-1 px-4 py-2.5 text-[12px] font-semibold rounded-xl bg-[#F73C1C] hover:bg-[#e63518] text-white transition-colors"
                  >
                    Esci
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
