'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string>('home');
  const pathname = usePathname();

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
      setScrolled(window.scrollY > 20);

      // Active section detection
      const ids = ['home', 'work', 'about', 'contact'];
      const offsets = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Number.POSITIVE_INFINITY };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top - 100) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) setSection(offsets[0].id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseLink = "group relative px-4 py-2 rounded-lg hover:text-foreground transition-all duration-300 hover:bg-foreground/5";
  const active = ' text-foreground bg-foreground/10 font-medium';
  const navLink = (key: string) => baseLink + (section === key ? active : '');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-xl border-b border-foreground/10 shadow-lg' 
        : 'bg-background/60 backdrop-blur-md border-b border-foreground/5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="group relative text-xl font-bold tracking-tighter">
            <span className="gradient-text">PORTFOLIO</span>
            <div className="absolute -inset-2 bg-gradient-to-r from-accent/20 via-accent-secondary/20 to-accent-tertiary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -m-2 rounded-lg hover:bg-foreground/5 transition-colors relative group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-accent-secondary/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 relative z-10"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="#work" className={`${navLink('work')} magnetic`} aria-current={section === 'work' ? 'page' : undefined}>
              <span className="relative z-10">Work</span>
              {section === 'work' && (
                <span className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent-secondary/10 rounded-lg -z-0"></span>
              )}
            </Link>
            <Link href="#about" className={`${navLink('about')} magnetic`} aria-current={section === 'about' ? 'page' : undefined}>
              <span className="relative z-10">About</span>
              {section === 'about' && (
                <span className="absolute inset-0 bg-gradient-to-r from-accent-secondary/10 to-accent-tertiary/10 rounded-lg -z-0"></span>
              )}
            </Link>
            <Link href="#contact" className={`${navLink('contact')} magnetic`} aria-current={section === 'contact' ? 'page' : undefined}>
              <span className="relative z-10">Contact</span>
              {section === 'contact' && (
                <span className="absolute inset-0 bg-gradient-to-r from-accent-tertiary/10 to-accent/10 rounded-lg -z-0"></span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 top-[73px] bg-background/80 backdrop-blur-md z-40 animate-in fade-in duration-200" 
          onClick={() => setIsMenuOpen(false)} 
          aria-hidden 
        />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-full left-0 right-0 border-b border-foreground/10 transition-all duration-300 origin-top z-50 ${
          isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col p-6 space-y-2">
            <Link
              href="#work"
              className={`py-4 px-4 rounded-lg hover:bg-foreground/5 transition-all duration-300 ${section === 'work' ? 'bg-foreground/10 font-medium' : ''}`}
              onClick={() => setIsMenuOpen(false)}
              aria-current={section === 'work' ? 'page' : undefined}
            >
              Work
            </Link>
            <Link
              href="#about"
              className={`py-4 px-4 rounded-lg hover:bg-foreground/5 transition-all duration-300 ${section === 'about' ? 'bg-foreground/10 font-medium' : ''}`}
              onClick={() => setIsMenuOpen(false)}
              aria-current={section === 'about' ? 'page' : undefined}
            >
              About
            </Link>
            <Link
              href="#contact"
              className={`py-4 px-4 rounded-lg hover:bg-foreground/5 transition-all duration-300 ${section === 'contact' ? 'bg-foreground/10 font-medium' : ''}`}
              onClick={() => setIsMenuOpen(false)}
              aria-current={section === 'contact' ? 'page' : undefined}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}