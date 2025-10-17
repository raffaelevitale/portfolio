import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[92vh] flex flex-col justify-start items-center p-6 pt-28 md:pt-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50 z-0"></div>

        {/* Futuristic grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:40px_40px] z-[-1]"></div>

        <div className="z-10 text-center max-w-4xl">
          <h1 className="fade-up text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70" style={{ animationDelay: "0ms" }}>
            CREATIVE PORTFOLIO
          </h1>
          <p className="fade-up text-2xl md:text-3xl text-foreground/90 mb-4 font-[family-name:var(--font-geist-mono)] font-medium" style={{ animationDelay: "120ms" }}>
            Designer & Developer.
          </p>
          <div className="fade-up flex justify-center gap-3 mb-8" style={{ animationDelay: "240ms" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/70 px-4 py-1.5 backdrop-blur text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
              Design + Code
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/70 px-4 py-1.5 backdrop-blur text-sm">
              Posters · Branding · Photography
            </span>
          </div>
          <p className="fade-up max-w-2xl mx-auto text-foreground/70 mb-6" style={{ animationDelay: "300ms" }}>
            Progetto interfacce pulite e sistemi visivi per brand e prodotti digitali, unendo rigore tipografico e sperimentazione.
          </p>
          <div className="fade-up flex flex-col md:flex-row gap-4 justify-center" style={{ animationDelay: "360ms" }}>
            <Link 
              href="/design" 
              className="px-8 py-3 rounded-full bg-accent text-accent-foreground hover:brightness-110 hover:shadow-[0_8px_30px_-10px_rgba(59,130,246,0.45)] transition-all duration-300 font-medium transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View Design Work
            </Link>
            <Link 
              href="/photography" 
              className="px-8 py-3 rounded-full border border-foreground/20 text-foreground/90 hover:border-foreground/50 hover:bg-foreground/5 transition-all duration-300 font-medium transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explore Photography
            </Link>
          </div>
          <div className="fade-up mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-foreground/60" style={{ animationDelay: "480ms" }}>
            <span className="inline-flex items-center rounded-full border border-foreground/10 bg-background/60 px-3 py-1 backdrop-blur">5+ anni</span>
            <span className="inline-flex items-center rounded-full border border-foreground/10 bg-background/60 px-3 py-1 backdrop-blur">40+ progetti</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text column */}
          <div>
            <h2 className="reveal text-3xl md:text-4xl font-bold mb-6 tracking-tight">About</h2>
            <p className="reveal text-lg text-foreground/80 mb-4">
              Welcome to my portfolio, a showcase of my work in graphic design, poster art, and photography. My style combines minimalism with futuristic elements, creating visual experiences that are both elegant and forward‑thinking.
            </p>
            <p className="reveal text-lg text-foreground/80 mb-8">
              I blend creativity with technical precision to deliver impactful visual solutions — from brand systems to interfaces and imagery.
            </p>

            {/* Stats with small icons */}
            <div className="reveal grid grid-cols-3 gap-4 mb-8 text-sm">
              <div className="rounded-lg border border-foreground/10 bg-background/60 backdrop-blur p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent"><path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z"/><path fillRule="evenodd" d="M5.25 6.75A2.25 2.25 0 017.5 4.5h9a2.25 2.25 0 012.25 2.25v12A2.25 2.25 0 0116.5 21H7.5a2.25 2.25 0 01-2.25-2.25v-12zM12 9a.75.75 0 00-.75.75v6.5a.75.75 0 001.5 0v-6.5A.75.75 0 0012 9z" clipRule="evenodd"/></svg>
                  <span className="font-medium">Esperienza</span>
                </div>
                <div className="text-foreground/70">5+ anni</div>
              </div>
              <div className="rounded-lg border border-foreground/10 bg-background/60 backdrop-blur p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent"><path d="M4.5 6a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v9.75A2.25 2.25 0 0117.25 18H6.75A2.25 2.25 0 014.5 15.75V6z"/><path d="M8.25 19.5a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z"/></svg>
                  <span className="font-medium">Progetti</span>
                </div>
                <div className="text-foreground/70">40+ completati</div>
              </div>
              <div className="rounded-lg border border-foreground/10 bg-background/60 backdrop-blur p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent"><path fillRule="evenodd" d="M12 3.75a6.75 6.75 0 00-6.75 6.75c0 5.25 6.75 9.75 6.75 9.75s6.75-4.5 6.75-9.75A6.75 6.75 0 0012 3.75zm0 9.75a3 3 0 110-6 3 3 0 010 6z" clipRule="evenodd"/></svg>
                  <span className="font-medium">Clienti</span>
                </div>
                <div className="text-foreground/70">Selezionati</div>
              </div>
            </div>

            {/* CTA */}
            <div className="reveal">
              <a href="/links" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:brightness-110 hover:shadow-[0_8px_30px_-10px_rgba(59,130,246,0.45)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Let’s Work Together
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3"/></svg>
              </a>
            </div>
          </div>

          {/* Visual column */}
          <div className="reveal relative rounded-xl p-px bg-gradient-to-b from-foreground/20 to-transparent">
            <div className="aspect-[4/5] rounded-[calc(theme(borderRadius.xl)-1px)] bg-background/80 backdrop-blur-sm border border-foreground/10 overflow-hidden flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-accent/20 via-foreground/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-20 px-6 bg-foreground/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="fade-up text-3xl md:text-4xl font-bold mb-12 tracking-tight text-center" style={{ animationDelay: "120ms" }}>Featured Work</h2>

          <div className="fade-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ animationDelay: "240ms" }}>
            {/* These would be replaced with actual project images */}
            <div className="group">
              <div className="relative rounded-xl p-px bg-gradient-to-b from-foreground/20 to-transparent hover:from-foreground/40 transition-colors cursor-pointer">
                <div className="aspect-square rounded-[calc(theme(borderRadius.xl)-1px)] bg-background/80 backdrop-blur-sm border border-foreground/10 group-hover:border-foreground/20 transition-all duration-300"></div>
              </div>
              <div className="mt-3 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium">Poster Series – NEON</h3>
                  <p className="text-xs text-foreground/60">Poster Design</p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative rounded-xl p-px bg-gradient-to-b from-foreground/20 to-transparent hover:from-foreground/40 transition-colors cursor-pointer">
                <div className="aspect-square rounded-[calc(theme(borderRadius.xl)-1px)] bg-background/80 backdrop-blur-sm border border-foreground/10 group-hover:border-foreground/20 transition-all duration-300"></div>
              </div>
              <div className="mt-3 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium">Brand System – LUME</h3>
                  <p className="text-xs text-foreground/60">Branding</p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative rounded-xl p-px bg-gradient-to-b from-foreground/20 to-transparent hover:from-foreground/40 transition-colors cursor-pointer">
                <div className="aspect-square rounded-[calc(theme(borderRadius.xl)-1px)] bg-background/80 backdrop-blur-sm border border-foreground/10 group-hover:border-foreground/20 transition-all duration-300"></div>
              </div>
              <div className="mt-3 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium">Editorial Grid – FRAME</h3>
                  <p className="text-xs text-foreground/60">Editorial</p>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-up mt-12 text-center" style={{ animationDelay: "360ms" }}>
            <Link 
              href="/design" 
              className="inline-flex items-center text-lg font-medium hover:underline underline-offset-4"
            >
              View all projects
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5 ml-1"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-foreground/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 mb-4 md:mb-0">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
              Behance
            </a>
            <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
