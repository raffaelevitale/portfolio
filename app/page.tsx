import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Ambient background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl float-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl float-medium"></div>
        </div>

        {/* Hero content */}
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="reveal mb-6">
            <span className="badge-minimal">
              <span className="dot-indicator"></span>
              Available for Work
            </span>
          </div>

          <h1 className="reveal text-huge mb-6">
            CREATIVE
            <br />
            <span className="bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
              PORTFOLIO
            </span>
          </h1>

          <p className="reveal text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Designer & Developer.
          </p>

          <div className="reveal flex flex-wrap justify-center gap-3 mb-12">
            <span className="badge-minimal">Design + Code</span>
            <span className="badge-minimal">Posters · Branding · Photography</span>
          </div>

          <p className="reveal text-base text-foreground/60 mb-12 max-w-3xl mx-auto leading-relaxed">
            Progetto interfacce pulite e sistemi visivi per brand e prodotti digitali, unendo rigore
            tipografico e sperimentazione creativa.
          </p>

          {/* CTAs */}
          <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/design" 
              className="magnetic inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold hover:scale-105 transition-transform"
            >
              View Design Work
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link 
              href="/photography" 
              className="magnetic inline-flex items-center gap-2 px-8 py-4 border-2 border-foreground/20 rounded-full font-semibold hover:border-accent hover:text-accent transition-all"
            >
              Explore Photography
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="reveal flex flex-wrap justify-center gap-8 mt-16 text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent">
                  <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z"/>
                  <path fillRule="evenodd" d="M5.25 6.75A2.25 2.25 0 017.5 4.5h9a2.25 2.25 0 012.25 2.25v12A2.25 2.25 0 0116.5 21H7.5a2.25 2.25 0 01-2.25-2.25v-12zM12 9a.75.75 0 00-.75.75v6.5a.75.75 0 001.5 0v-6.5A.75.75 0 0012 9z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">5+ anni</span>
              </div>
              <div className="text-foreground/60">di esperienza</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent">
                  <path d="M4.5 6a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v9.75A2.25 2.25 0 0117.25 18H6.75A2.25 2.25 0 014.5 15.75V6z"/>
                  <path d="M8.25 19.5a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z"/>
                </svg>
                <span className="font-semibold">40+ progetti</span>
              </div>
              <div className="text-foreground/60">completati</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent">
                  <path fillRule="evenodd" d="M12 3.75a6.75 6.75 0 00-6.75 6.75c0 5.25 6.75 9.75 6.75 9.75s6.75-4.5 6.75-9.75A6.75 6.75 0 0012 3.75zm0 9.75a3 3 0 110-6 3 3 0 010 6z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Clienti selezionati</span>
              </div>
              <div className="text-foreground/60">collaborazioni</div>
            </div>
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

      {/* About Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text column */}
            <div>
              <h2 className="reveal text-display mb-8">About</h2>
              <div className="reveal space-y-6 text-lg text-foreground/70 leading-relaxed">
                <p>
                  Ciao! Sono un designer e developer appassionato di tipografia, sistemi visivi
                  e interfacce digitali.
                </p>
                <p>
                  Creo esperienze digitali che bilanciano estetica e funzionalità, con
                  particolare attenzione al dettaglio e alla qualità del codice.
                </p>
              </div>
              <div className="reveal mt-8">
                <Link 
                  href="/links" 
                  className="magnetic inline-flex items-center gap-2 px-6 py-3 border-2 border-accent text-accent rounded-full font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <span className="dot-indicator"></span>
                  Let's Work Together
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
            {/* Visual column */}
            <div className="reveal">
              <div className="aspect-[4/5] card-clean hover-lift overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent-secondary/10 to-accent-tertiary/5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-accent/40 via-accent-secondary/30 to-accent-tertiary/20 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-32 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="reveal text-center mb-16">
            <span className="badge-minimal mb-6">
              <span className="dot-indicator"></span>
              Selected Projects
            </span>
            <h2 className="text-display mt-6">Featured Work</h2>
          </div>
          <div className="grid-obys">
            <Link href="/design" className="reveal group">
              <div className="card-clean hover-lift overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-accent/10 via-background to-background mb-4 image-overlay">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-foreground/5">NEON</span>
                  </div>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">Poster Series – NEON</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
                <p className="text-sm text-foreground/60">Poster Design</p>
              </div>
            </Link>
            <Link href="/design" className="reveal group">
              <div className="card-clean hover-lift overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-accent-secondary/10 via-background to-background mb-4 image-overlay">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-foreground/5">LUME</span>
                  </div>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">Brand System – LUME</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
                <p className="text-sm text-foreground/60">Branding</p>
              </div>
            </Link>
            <Link href="/design" className="reveal group">
              <div className="card-clean hover-lift overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-accent-tertiary/10 via-background to-background mb-4 image-overlay">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-foreground/5">FRAME</span>
                  </div>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">Editorial Grid – FRAME</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
                <p className="text-sm text-foreground/60">Editorial</p>
              </div>
            </Link>
          </div>
          <div className="reveal text-center mt-16">
            <Link 
              href="/design" 
              className="magnetic inline-flex items-center gap-2 text-lg font-semibold hover:text-accent transition-colors"
            >
              View all projects
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="reveal text-foreground/60 flex items-center gap-2">
              <span className="dot-indicator"></span>
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
            <div className="reveal flex gap-6">
              <a href="#" className="magnetic text-foreground/60 hover:text-foreground transition-colors font-medium">Instagram</a>
              <a href="#" className="magnetic text-foreground/60 hover:text-foreground transition-colors font-medium">Behance</a>
              <a href="#" className="magnetic text-foreground/60 hover:text-foreground transition-colors font-medium">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
