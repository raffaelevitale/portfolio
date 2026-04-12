'use client';

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';

function NavPill({ activeKey, items }: { activeKey: string; items: { key: string; label: string }[] }) {
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
  const activeIdx = items.findIndex((item) => item.key === activeKey);
  const isActive = activeIdx !== -1;

  useLayoutEffect(() => {
    if (!isActive) {
      setPillStyle(null);
      return;
    }
    const container = document.querySelector('[data-nav-idx="0"]')?.parentElement;
    if (!container) return;
    const target = container.querySelector(`[data-nav-idx="${activeIdx}"]`) as HTMLElement | null;
    if (!target) return;
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setPillStyle({
      left: targetRect.left - containerRect.left,
      width: targetRect.width,
    });
  }, [activeKey, activeIdx, isActive]);

  if (!isActive || !pillStyle) return null;

  return (
    <motion.span
      className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm ring-1 ring-[var(--border)]/50"
      initial={false}
      animate={{ left: pillStyle.left, width: pillStyle.width }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
    />
  );
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string>('home');
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = isMenuOpen ? 'hidden' : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 20);

        if (y > 400) {
          setHidden(y > lastScrollYRef.current && y - lastScrollYRef.current > 8);
        } else {
          setHidden(false);
        }
        lastScrollYRef.current = y;

        const ids = ['home', 'work', 'about', 'contact'];
        const viewportH = window.innerHeight;
        let best = 'home';
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportH * 0.4) best = id;
        }
        setSection(best);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    e.preventDefault();
    const el = document.getElementById(key);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  }, []);

  const navItems = [
    { key: 'work', label: 'Lavori' },
    { key: 'about', label: 'Chi sono' },
    { key: 'contact', label: 'Contatto' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hidden && !isMenuOpen ? -100 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[var(--bg)]/70 backdrop-blur-xl backdrop-saturate-[1.8] border-b border-[var(--border)]/40 shadow-[0_1px_8px_rgba(0,0,0,0.04),0_0_1px_rgba(0,0,0,0.06)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="font-display text-lg hover:text-[var(--accent)] transition-colors duration-300"
          >
            Raffaele Vitale
          </a>

          <button
            className="md:hidden relative p-2.5 -m-2 rounded-xl hover:bg-[var(--fg)]/5 active:scale-95 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <motion.span
                className="block w-full h-[1.5px] bg-current rounded-full origin-left"
                animate={isMenuOpen ? { rotate: 45, y: -1, x: 1 } : { rotate: 0, y: 0, x: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="block w-full h-[1.5px] bg-current rounded-full"
                animate={isMenuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-full h-[1.5px] bg-current rounded-full origin-left"
                animate={isMenuOpen ? { rotate: -45, y: 1, x: 1 } : { rotate: 0, y: 0, x: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </button>

          <div className="hidden md:flex items-center gap-0.5">
            <div className="relative flex items-center bg-[var(--fg)]/[0.03] rounded-full p-1 gap-0.5">
              {navItems.map((item, idx) => (
                <a
                  key={item.key}
                  href={`#${item.key}`}
                  onClick={(e) => handleNavClick(e, item.key)}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full z-10 ${
                    section === item.key
                      ? 'text-[var(--fg)]'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                  }`}
                  aria-current={section === item.key ? 'page' : undefined}
                  data-nav-idx={idx}
                >
                  {item.label}
                </a>
              ))}
              <NavPill activeKey={section} items={navItems} />
            </div>

            <div className="w-px h-5 bg-[var(--border)] mx-4" />

            <motion.a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-[var(--fg)] text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent)]/10"
            >
              <span className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <Mail className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Contattami</span>
            </motion.a>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-full left-0 right-0 z-50 overflow-hidden"
          >
            <div className="bg-[var(--bg)]/90 backdrop-blur-xl backdrop-saturate-[1.6] border-b border-[var(--border)]/60 shadow-xl shadow-black/5">
              <div className="flex flex-col p-6 space-y-1">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.key}
                    href={`#${item.key}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className={`py-3.5 px-4 rounded-xl text-base font-medium transition-all duration-200 ${
                      section === item.key
                        ? 'text-[var(--accent)] bg-[var(--accent)]/[0.08]'
                        : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--fg)]/[0.03] active:bg-[var(--fg)]/[0.06]'
                    }`}
                    onClick={(e) => handleNavClick(e, item.key)}
                    aria-current={section === item.key ? 'page' : undefined}
                  >
                    {item.label}
                  </motion.a>
                ))}

                <motion.a
                  href="#contact"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.23, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="mt-3 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-base font-semibold bg-[var(--fg)] text-white active:scale-[0.98] transition-transform"
                >
                  <Mail className="w-4 h-4" />
                  Contattami
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
