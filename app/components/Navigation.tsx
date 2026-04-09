'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string>('home');
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = isMenuOpen ? 'hidden' : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      if (y > 400) {
        setHidden(y > lastScrollY && y - lastScrollY > 5);
      } else {
        setHidden(false);
      }
      setLastScrollY(y);

      const ids = ['home', 'work', 'about', 'contact'];
      const offsets = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Number.POSITIVE_INFINITY };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top - 120) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) setSection(offsets[0].id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
          ? 'bg-[var(--bg)]/80 backdrop-blur-2xl border-b border-[var(--border)]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
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
            className="md:hidden p-2 -m-2 rounded-lg hover:bg-[var(--fg)]/5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={`#${item.key}`}
                onClick={(e) => handleNavClick(e, item.key)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  section === item.key
                    ? 'text-[var(--fg)]'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                }`}
                aria-current={section === item.key ? 'page' : undefined}
              >
                {item.label}
                {section === item.key && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[var(--accent)] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}

            <div className="w-px h-5 bg-[var(--border)] mx-3" />

            <motion.a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-[var(--fg)] text-white hover:bg-[var(--accent)] transition-colors duration-300"
            >
              <Mail className="w-3.5 h-3.5" />
              Contattami
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
            className="md:hidden fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-full left-0 right-0 border-b border-[var(--border)] z-50"
          >
            <div className="bg-[var(--bg)]/95 backdrop-blur-2xl">
              <div className="flex flex-col p-6 space-y-1">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.key}
                    href={`#${item.key}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                      section === item.key
                        ? 'text-[var(--accent)] bg-[var(--accent)]/5'
                        : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                    }`}
                    onClick={(e) => handleNavClick(e, item.key)}
                    aria-current={section === item.key ? 'page' : undefined}
                  >
                    {item.label}
                  </motion.a>
                ))}

                <motion.a
                  href="#contact"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-[var(--fg)] text-white"
                >
                  <Mail className="w-3.5 h-3.5" />
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
