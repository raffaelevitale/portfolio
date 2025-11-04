import Link from "next/link";
import BackToTopButton from "./components/BackToTopButton";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Ambient background orbs - Reduced opacity */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl float-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl float-medium"></div>
        </div>

        {/* Hero content */}
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="reveal mb-6">
            <span className="badge-minimal">
              <span className="dot-indicator"></span>
              Disponibile per collaborazioni
            </span>
          </div>

          <h1 className="reveal text-huge mb-8">
            Creative
            <br />
            <span className="bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
              Designer & Developer
            </span>
          </h1>

          <p className="reveal text-xl md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Progetto interfacce pulite, sistemi visivi e prodotti digitali curando dettagli, performance e accessibilità.
          </p>

          {/* Primary CTAs */}
          <div className="reveal flex flex-wrap justify-center gap-4">
            <a
              href="#work"
              className="magnetic inline-flex items-center gap-3 px-10 py-5 bg-accent text-accent-foreground rounded-full font-semibold text-lg hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all"
            >
              Guarda i progetti
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="/Profile.pdf"
              download
              className="magnetic inline-flex items-center gap-3 px-10 py-5 border-2 border-foreground/20 rounded-full font-semibold text-lg hover:border-accent hover:text-accent transition-all"
            >
              Scarica CV
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 16.5V3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="reveal absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/40">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </section>

      {/* Servizi */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal text-center mb-14">
            <span className="badge-minimal mb-4">
              <span className="dot-indicator"></span>
              Cosa faccio
            </span>
            <h2 className="text-display mt-3">Servizi</h2>
            <p className="text-foreground/70 mt-3 max-w-2xl mx-auto">Dalla strategia visiva allo sviluppo front‑end, ti aiuto a lanciare e far crescere prodotti digitali.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-clean hover-lift p-6">
              <h3 className="font-semibold mb-2">Brand & Visual System</h3>
              <p className="text-sm text-foreground/70">Identità coerenti, gerarchie tipografiche e sistemi scalabili per prodotto e marketing.</p>
            </div>
            <div className="card-clean hover-lift p-6">
              <h3 className="font-semibold mb-2">UI/UX per Web App</h3>
              <p className="text-sm text-foreground/70">Wireframe, prototipi ad alta fedeltà e design system orientati a accessibilità e consistenza.</p>
            </div>
            <div className="card-clean hover-lift p-6">
              <h3 className="font-semibold mb-2">Sviluppo Front‑end</h3>
              <p className="text-sm text-foreground/70">Next.js, React e TypeScript con performance, SEO tecnica e animazioni fluide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Competenze */}
      <section className="py-24 px-6 border-y border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="reveal">
              <h3 className="text-xl font-bold mb-3">Stack</h3>
              <ul className="text-foreground/75 space-y-2 text-sm">
                <li>React, Next.js, TypeScript</li>
                <li>Tailwind, Framer Motion</li>
                <li>Node.js, REST/JSON</li>
              </ul>
            </div>
            <div className="reveal">
              <h3 className="text-xl font-bold mb-3">Design</h3>
              <ul className="text-foreground/75 space-y-2 text-sm">
                <li>Figma, Prototyping</li>
                <li>Design System & Tokens</li>
                <li>Tipografia e layout</li>
              </ul>
            </div>
            <div className="reveal">
              <h3 className="text-xl font-bold mb-3">Metodo</h3>
              <ul className="text-foreground/75 space-y-2 text-sm">
                <li>Continuous delivery</li>
                <li>Accessibilità e performance</li>
                <li>Collaborazione cross‑funzionale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="py-32 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="reveal text-center mb-16">
            <span className="badge-minimal mb-6">
              <span className="dot-indicator"></span>
              Selezione progetti
            </span>
            <h2 className="text-display mt-6">Featured Work</h2>
          </div>
          <div className="grid-obys">
            {/* Card 1 */}
            <div className="reveal group">
              <div className="card-clean hover-lift overflow-hidden relative">
                <div className="aspect-square bg-gradient-to-br from-accent/15 via-accent/5 to-background mb-4 image-overlay relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_50%)]"></div>
                  <div className="w-full h-full flex items-center justify-center relative z-10">
                    <span className="text-8xl font-bold text-foreground/[0.03] group-hover:text-foreground/[0.06] transition-colors">NEON</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">Poster Design</span>
                    <h3 className="text-xl font-bold group-hover:text-accent transition-colors">Poster Series – NEON</h3>
                  </div>
                </div>
                <p className="text-sm text-foreground/75 group-hover:text-foreground/90 transition-colors">Tipografia sperimentale e palette vibranti.</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="reveal group">
              <div className="card-clean hover-lift overflow-hidden relative">
                <div className="aspect-square bg-gradient-to-br from-accent-secondary/15 via-accent-secondary/5 to-background mb-4 image-overlay relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.15),transparent_50%)]"></div>
                  <div className="w-full h-full flex items-center justify-center relative z-10">
                    <span className="text-8xl font-bold text-foreground/[0.03] group-hover:text-foreground/[0.06] transition-colors">LUME</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-3 py-1 bg-accent-secondary/10 text-accent-secondary text-xs font-semibold rounded-full mb-3">Branding</span>
                    <h3 className="text-xl font-bold group-hover:text-accent-secondary transition-colors">Brand System – LUME</h3>
                  </div>
                </div>
                <p className="text-sm text-foreground/75 group-hover:text-foreground/90 transition-colors">Identità visiva completa e linee guida.</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="reveal group">
              <div className="card-clean hover-lift overflow-hidden relative">
                <div className="aspect-square bg-gradient-to-br from-accent-tertiary/15 via-accent-tertiary/5 to-background mb-4 image-overlay relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.15),transparent_50%)]"></div>
                  <div className="w-full h-full flex items-center justify-center relative z-10">
                    <span className="text-8xl font-bold text-foreground/[0.03] group-hover:text-foreground/[0.06] transition-colors">FRAME</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-tertiary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-3 py-1 bg-accent-tertiary/10 text-accent-tertiary text-xs font-semibold rounded-full mb-3">Editorial</span>
                    <h3 className="text-xl font-bold group-hover:text-accent-tertiary transition-colors">Editorial Grid – FRAME</h3>
                  </div>
                </div>
                <p className="text-sm text-foreground/75 group-hover:text-foreground/90 transition-colors">Layout magazine e sistemi a griglia.</p>
              </div>
            </div>
          </div>
          <div className="reveal text-center mt-16">
            <a
              href="#contact"
              className="magnetic inline-flex items-center gap-2 text-lg font-semibold hover:text-accent transition-colors"
            >
              Richiedi il portfolio completo
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="reveal text-display mb-8">Chi sono</h2>
            <div className="reveal space-y-6 text-lg text-foreground/80 leading-relaxed">
              <p>
                Designer & developer con passione per tipografia, sistemi visivi e interfacce digitali. Unisco estetica e funzionalità, con attenzione a qualità del codice e dettaglio visivo.
              </p>
              <p>
                Esperto di <span className="font-semibold text-accent">React</span>, <span className="font-semibold text-accent">Next.js</span>, <span className="font-semibold text-accent">TypeScript</span> e <span className="font-semibold text-accent">Figma</span>, lavoro end‑to‑end dal concept al rilascio.
              </p>
            </div>
            <div className="reveal mt-12 flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                className="magnetic inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all"
              >
                <span className="dot-indicator bg-accent-foreground"></span>
                Parliamo del tuo progetto
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href="mailto:raffaele.stuudio@gmail.com"
                className="magnetic inline-flex items-center gap-2 px-8 py-4 border-2 border-foreground/20 rounded-full font-semibold hover:border-accent hover:text-accent transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Contatto diretto
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent-secondary/5 to-accent-tertiary/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="reveal mb-8">
            <span className="badge-minimal">
              <span className="dot-indicator"></span>
              Disponibile su nuovi progetti
            </span>
          </div>
          <h2 className="reveal text-display mb-8">
            Lavoriamo insieme
            <br />
            <span className="bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
              per creare qualcosa di notevole
            </span>
          </h2>
          <p className="reveal text-lg text-foreground/80 mb-12 max-w-2xl mx-auto">
            Scrivimi due righe sul tuo progetto o idea. Ti rispondo presto con una proposta concreta.
          </p>
          <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:raffaele.stuudio@gmail.com"
              className="magnetic inline-flex items-center gap-3 px-10 py-5 bg-accent text-accent-foreground rounded-full font-semibold text-lg hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Invia una mail
            </a>
            <a
              href="/Profile.pdf"
              download
              className="magnetic inline-flex items-center gap-3 px-10 py-5 border-2 border-foreground/20 rounded-full font-semibold text-lg hover:border-accent hover:text-accent transition-all"
            >
              Scarica CV
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
          <div className="reveal mt-12 flex justify-center gap-6">
            <a
              href="https://www.instagram.com/josh63.exe/"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic text-foreground/75 hover:text-accent transition-colors font-medium flex items-center gap-2"
              aria-label="Instagram profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.80c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.60-4.123.60h-.80c-2.643 0-2.987-.010-4.043-.060-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.060-1.379-.060-3.808v-.630c0-2.430.013-2.784.060-3.808.049-1.064.218-1.791.465-2.427a3.097 3.097 0 00.748-1.150 3.098 3.098 0 001.150-.748c.353-.137.882-.300 1.857-.344 1.023-.047 1.351-.058 3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/vitaleraffaele/"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic text-foreground/75 hover:text-accent transition-colors font-medium flex items-center gap-2"
              aria-label="LinkedIn profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-foreground/10 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-block group mb-4">
                <span className="text-2xl font-bold gradient-text">RAFFAELE VITALE</span>
              </Link>
              <p className="text-foreground/75 leading-relaxed mb-4">
                Designer & Developer: interfacce pulite, sistemi visivi e prodotti digitali.
              </p>
              <p className="text-foreground/75 text-sm">Basato in Italia 🇮🇹</p>
            </div>

            {/* Navigation Column */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Navigazione</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#home" className="text-foreground/75 hover:text-accent transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-foreground/75 hover:text-accent transition-colors">
                    Progetti
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-foreground/75 hover:text-accent transition-colors">
                    Chi sono
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-foreground/75 hover:text-accent transition-colors">
                    Contatti
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:raffaele.stuudio@gmail.com"
                    className="text-foreground/75 hover:text-accent transition-colors"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/josh63.exe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/75 hover:text-accent transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/vitaleraffaele/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/75 hover:text-accent transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-foreground/75 flex items-center gap-2 text-sm">
              <span className="dot-indicator"></span>
              © {new Date().getFullYear()} Raffaele Vitale. All rights reserved.
            </p>
            <BackToTopButton />
          </div>
        </div>
      </footer>
    </main>
  );
}
