import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[92vh] flex flex-col justify-start items-center p-6 pt-28 md:pt-40 relative overflow-hidden cyber-grid">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50 z-0"></div>
        
        {/* Aurora effect background - with parallax */}
        <div className="absolute inset-0 opacity-40 particles" data-parallax="0.3">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl float-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-secondary/30 rounded-full blur-3xl float-medium" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent-tertiary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }}></div>
        </div>

        <div className="z-10 text-center max-w-4xl" data-parallax="0.1">
          {/* Badge */}
          <div className="fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full frosted-card text-sm font-medium mb-8" style={{ animationDelay: "0ms" }}>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-accent to-accent-secondary animate-pulse glow-text"></div>
            <span>Disponibile per nuovi progetti</span>
          </div>

          <h1 className="fade-up text-6xl md:text-8xl font-bold tracking-tighter mb-6" style={{ animationDelay: "100ms" }}>
            <span className="gradient-text glow-text">CREATIVE</span>
            <br />
            <span className="text-foreground">PORTFOLIO</span>
          </h1>
          
          <p className="fade-up text-2xl md:text-3xl text-foreground/90 mb-4 font-[family-name:var(--font-geist-mono)] font-medium" style={{ animationDelay: "200ms" }}>
            Designer & Developer.
          </p>
          
          <div className="fade-up flex justify-center gap-3 mb-8 flex-wrap" style={{ animationDelay: "300ms" }}>
            <span className="inline-flex items-center gap-2 rounded-full frosted-card px-4 py-1.5 text-sm hover:border-accent/30 transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-accent-secondary shimmer"></span>
              Design + Code
            </span>
            <span className="inline-flex items-center gap-2 rounded-full frosted-card px-4 py-1.5 text-sm hover:border-accent/30 transition-colors">
              Posters · Branding · Photography
            </span>
          </div>
          
          <p className="fade-up max-w-2xl mx-auto text-lg text-foreground/70 mb-8 leading-relaxed" style={{ animationDelay: "400ms" }}>
            Progetto interfacce pulite e sistemi visivi per brand e prodotti digitali, 
            unendo rigore tipografico e sperimentazione creativa.
          </p>
          
          <div className="fade-up flex flex-col md:flex-row gap-4 justify-center" style={{ animationDelay: "500ms" }}>
            <Link 
              href="/design" 
              className="group magnetic btn-futuristic inline-flex items-center justify-center gap-2"
            >
              <span>View Design Work</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              href="/photography" 
              className="magnetic px-8 py-4 rounded-full frosted-card text-foreground/90 font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <span>Explore Photography</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
          
          <div className="fade-up mt-8 flex flex-wrap items-center justify-center gap-4 text-sm" style={{ animationDelay: "600ms" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full frosted-card">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-foreground/70">5+ anni di esperienza</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-foreground/10">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="text-foreground/70">40+ progetti completati</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
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
          <div className="reveal neon-border p-6">
            <div className="aspect-[4/5] rounded-xl frosted-card overflow-hidden flex items-center justify-center holographic">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-accent/20 via-foreground/10 to-transparent float-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-20 px-6 cyber-grid">
        <div className="max-w-6xl mx-auto">
          <h2 className="reveal text-3xl md:text-4xl font-bold mb-12 tracking-tight text-center">Featured Work</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* These would be replaced with actual project images */}
            <div className="reveal group">
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

            <div className="reveal group">
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

            <div className="reveal group">
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

          <div className="reveal mt-12 text-center">
            <Link 
              href="/design" 
              className="magnetic inline-flex items-center text-lg font-medium hover:underline underline-offset-4"
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
          <p className="reveal text-foreground/60 mb-4 md:mb-0">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <div className="reveal flex space-x-6">
            <a href="#" className="magnetic text-foreground/60 hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="#" className="magnetic text-foreground/60 hover:text-foreground transition-colors">
              Behance
            </a>
            <a href="#" className="magnetic text-foreground/60 hover:text-foreground transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
