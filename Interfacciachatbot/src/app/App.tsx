import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { Header } from "./components/Header";
import { PromoBanner } from "./components/PromoBanner";
import { Sidebar } from "./components/Sidebar";
import { ModuleTopBar } from "./components/ModuleTopBar";
import { ChatArea } from "./components/ChatArea";
import { SettingsView } from "./components/SettingsView";
import { FilesView } from "./components/FilesView";
import { DashboardView } from "./components/DashboardView";
import { SettingsPanel } from "./components/SettingsPanel";
import { LockedCard } from "./components/LockedCard";
import { AppSettingsPage } from "./components/AppSettingsPage";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LoginPage } from "./components/LoginPage";
import { ThirdPartyHubView } from "./components/ThirdPartyHubView";
import { InterfaceOnboarding } from './components/InterfaceOnboarding';
import { ambiti as initialAmbiti } from "./components/data";
import type { Module } from "./components/data";
import type { ThirdPartySection } from "./components/thirdPartyProviders";
import { Sliders } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

const LOCALHOST_APP_LOGIN_KEY = 'interfaccia.localhost.appLogin';
const INTERFACE_ONBOARDING_COMPLETED_KEY = 'interfaccia.onboarding.completed.v1';

function isLocalhostEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '::1' || host.startsWith('127.');
}

function getInitialAppLoginState(): boolean {
  if (!isLocalhostEnvironment()) return false;
  try {
    return window.localStorage.getItem(LOCALHOST_APP_LOGIN_KEY) === '1';
  } catch {
    return false;
  }
}

function getInitialOnboardingVisibility(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(INTERFACE_ONBOARDING_COMPLETED_KEY) !== '1';
  } catch {
    return true;
  }
}

function getLayoutWidthVar(variableName: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback;
  const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  const parsed = Number.parseFloat(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function AppInner() {
  const { t } = useTheme();
  const isLocalhost = isLocalhostEnvironment();
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialAppLoginState);
  const [ambitiState, setAmbitiState] = useState(initialAmbiti);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedAmbitoId, setSelectedAmbitoId] = useState('');
  const [lockedModule, setLockedModule] = useState<Module | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showParams, setShowParams] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileParamsOpen, setMobileParamsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ThirdPartySection>('internal');
  const [thirdPartyToolId, setThirdPartyToolId] = useState<string | null>('seed-chatgpt');
  const [showOnboarding, setShowOnboarding] = useState(getInitialOnboardingVisibility);
  const [sidePanelWidth, setSidePanelWidth] = useState(() => getLayoutWidthVar('--layout-sidepanel-w', 260));

  useEffect(() => {
    if (!isLocalhost || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LOCALHOST_APP_LOGIN_KEY, isLoggedIn ? '1' : '0');
    } catch {
      // Ignore storage failures in private mode or restricted environments.
    }
  }, [isLocalhost, isLoggedIn]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncSidePanelWidth = () => setSidePanelWidth(getLayoutWidthVar('--layout-sidepanel-w', 260));
    syncSidePanelWidth();
    window.addEventListener('resize', syncSidePanelWidth);
    return () => window.removeEventListener('resize', syncSidePanelWidth);
  }, []);

  const selectedAmbito = ambitiState.find(a => a.id === selectedAmbitoId);
  const allInternalModules = ambitiState.flatMap(a => a.funzioni.flatMap(f => f.modules));
  const activeInternalModulesCount = allInternalModules.filter(m => m.purchased && m.active).length;
  const purchasedInternalModulesCount = allInternalModules.filter(m => m.purchased).length;
  const operativityPercent = purchasedInternalModulesCount === 0
    ? 0
    : Math.round((activeInternalModulesCount / purchasedInternalModulesCount) * 100);

  const goHome = useCallback(() => {
    setActiveSection('internal');
    setThirdPartyToolId('seed-chatgpt');
    setSelectedModule(null);
    setSelectedAmbitoId('');
    setShowSettings(false);
    setLockedModule(null);
    setMobileSidebarOpen(false);
  }, []);

  const onSelectModule = useCallback((mod: Module, ambitoId: string) => {
    setActiveSection('internal');
    setSelectedModule(mod);
    setSelectedAmbitoId(ambitoId);
    setLockedModule(null);
    setShowSettings(false);
    setMobileParamsOpen(false);
  }, []);

  const onChangeSection = useCallback((section: ThirdPartySection) => {
    setActiveSection(section);
    setShowSettings(false);
    setLockedModule(null);
    if (section === 'third-party') {
      setSelectedModule(null);
      setSelectedAmbitoId('');
      setMobileParamsOpen(false);
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    setShowOnboarding(false);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(INTERFACE_ONBOARDING_COMPLETED_KEY, '1');
    } catch {
      // Ignore storage failures in private mode or restricted environments.
    }
  }, []);

  const openThirdPartyAssistant = useCallback((toolId?: string) => {
    setActiveSection('third-party');
    setThirdPartyToolId(toolId ?? 'seed-chatgpt');
    setShowSettings(false);
    setLockedModule(null);
    setSelectedModule(null);
    setSelectedAmbitoId('');
    setMobileParamsOpen(false);
  }, []);

  const onToggleModule = useCallback((moduleId: string) => {
    setAmbitiState(prev => prev.map(a => ({
      ...a,
      funzioni: a.funzioni.map(f => ({
        ...f,
        modules: f.modules.map(m => (m.id === moduleId ? { ...m, active: !m.active } : m)),
      })),
    })));

    setSelectedModule(prev => (prev?.id === moduleId ? { ...prev, active: !prev.active } : prev));
  }, []);

  const currentModule = selectedModule
    ? ambitiState.flatMap(a => a.funzioni.flatMap(f => f.modules)).find(m => m.id === selectedModule.id) || selectedModule
    : null;

  const isChat = activeSection === 'internal' && currentModule?.type === 'chat';

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden relative transition-colors"
      style={{ fontFamily: '"Lexend", sans-serif', backgroundColor: t('#111111', '#F0F0F0') }}
    >
      <Header
        onOpenSettings={() => { setShowSettings(true); setMobileSidebarOpen(false); }}
        onToggleSidebar={() => setMobileSidebarOpen(p => !p)}
        sidebarOpen={mobileSidebarOpen}
        onGoHome={goHome}
        onLogout={() => setIsLoggedIn(false)}
        greetingName="Luciano"
        operativityPercent={operativityPercent}
        activeModulesCount={activeInternalModulesCount}
      />
      <PromoBanner ambiti={ambitiState} onDiscoverModules={goHome} />

      <div className="flex flex-1 overflow-hidden">
        {!showSettings && (
          <Sidebar
            ambiti={ambitiState}
            selectedModule={currentModule}
            onSelectModule={onSelectModule}
            onToggleModule={onToggleModule}
            onShowLocked={setLockedModule}
            activeSection={activeSection}
            onChangeSection={onChangeSection}
            isMobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        )}

        {showSettings ? (
          <AppSettingsPage onClose={() => setShowSettings(false)} />
        ) : (
          <div className="flex flex-col flex-1 min-w-0 h-full">
            <AnimatePresence mode="wait">
              {activeSection === 'internal' && currentModule && selectedAmbito ? (
                <motion.div
                  key="topbar"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <ModuleTopBar
                    ambitoId={selectedAmbito.id}
                    ambitoName={selectedAmbito.name}
                    ambitoColor={selectedAmbito.color}
                    ambitoIcon={selectedAmbito.iconName}
                    module={currentModule}
                    onToggle={() => onToggleModule(currentModule.id)}
                    onGoHome={goHome}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="flex flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {activeSection === 'third-party' ? (
                  <motion.div
                    key="third-party-hub"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex flex-1 overflow-hidden"
                  >
                    <ThirdPartyHubView
                      selectedToolId={thirdPartyToolId}
                      onSelectToolId={setThirdPartyToolId}
                    />
                  </motion.div>
                ) : currentModule ? (
                  <motion.div
                    key={currentModule.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex flex-1 overflow-hidden"
                  >
                    {currentModule.type === 'chat' && <ChatArea module={currentModule} ambitoName={selectedAmbito?.name} ambitoColor={selectedAmbito?.color} />}
                    {currentModule.type === 'settings' && <SettingsView module={currentModule} ambitoName={selectedAmbito?.name} ambitoColor={selectedAmbito?.color} />}
                    {currentModule.type === 'files' && <FilesView module={currentModule} ambitoName={selectedAmbito?.name} ambitoColor={selectedAmbito?.color} />}
                    {currentModule.type === 'dashboard' && <DashboardView module={currentModule} ambitoName={selectedAmbito?.name} ambitoColor={selectedAmbito?.color} />}
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex flex-1 overflow-hidden"
                  >
                    <WelcomeScreen
                      ambiti={ambitiState}
                      onSelectModule={onSelectModule}
                      onShowLocked={setLockedModule}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FAB for params */}
              <AnimatePresence>
                {isChat && !showParams && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setMobileParamsOpen(p => !p);
                      } else {
                        setShowParams(true);
                      }
                    }}
                    className={`absolute bottom-20 right-4 z-30 flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-colors ${t('bg-[#1E1E1E] text-[#888] hover:text-white border border-white/[0.08]', 'bg-white text-[#999] hover:text-[#222] border border-black/[0.08]')}`}
                    title="Parametri"
                  >
                    <Sliders size={16} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Desktop params panel */}
              <AnimatePresence>
                {isChat && showParams && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: sidePanelWidth, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="hidden md:block overflow-hidden shrink-0"
                  >
                    <SettingsPanel onTogglePanel={() => setShowParams(false)} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile params overlay */}
              <AnimatePresence>
                {isChat && mobileParamsOpen && (
                  <div className="md:hidden fixed inset-0 z-40" style={{ top: 'var(--layout-header-h)' }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/50"
                      onClick={() => setMobileParamsOpen(false)}
                    />
                    <motion.div
                      initial={{ x: sidePanelWidth }}
                      animate={{ x: 0 }}
                      exit={{ x: sidePanelWidth }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="absolute right-0 top-0 bottom-0 shadow-2xl"
                      style={{ width: sidePanelWidth, maxWidth: '85vw' }}
                    >
                      <SettingsPanel onClose={() => setMobileParamsOpen(false)} onTogglePanel={() => setMobileParamsOpen(false)} />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lockedModule && !showSettings && (
          <LockedCard module={lockedModule} onClose={() => setLockedModule(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOnboarding && (
          <InterfaceOnboarding
            ambiti={ambitiState}
            onComplete={completeOnboarding}
            onSkip={completeOnboarding}
            onOpenEcosystem={goHome}
            onOpenSubscriptions={() => openThirdPartyAssistant()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
      <Toaster />
    </ThemeProvider>
  );
}
