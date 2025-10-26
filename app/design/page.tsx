import Link from "next/link";

export const metadata = {
  title: "Design Portfolio",
  description: "Showcasing graphic design work",
};

export default function DesignPage() {
  const projects = [
    { title: "NEON Poster Series", category: "Poster Design", color: "from-accent/10" },
    { title: "LUME Brand System", category: "Branding", color: "from-accent-secondary/10" },
    { title: "FRAME Editorial", category: "Editorial", color: "from-accent-tertiary/10" },
    { title: "FLUX UI Design", category: "UI/UX", color: "from-accent/10" },
    { title: "TYPE Exploration", category: "Typography", color: "from-accent-secondary/10" },
    { title: "MINIMAL Packaging", category: "Packaging", color: "from-accent-tertiary/10" },
  ];

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </Link>
          </div>
          <h1 className="reveal text-huge mb-6">
            <span className="bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">DESIGN</span>
            <br />PORTFOLIO
          </h1>
        </div>
      </section>
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid-obys">
          {projects.map((project, i) => (
            <div key={i} className="reveal group card-clean hover-lift overflow-hidden cursor-pointer">
              <div className={`aspect-square bg-gradient-to-br ${project.color} via-background to-background mb-4 flex items-center justify-center`}>
                <span className="text-6xl font-bold text-foreground/5">{project.title.split(' ')[0]}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-foreground/60">{project.category}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
