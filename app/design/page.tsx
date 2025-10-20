import Link from "next/link";

export const metadata = {
  title: "Design Portfolio",
  description: "Showcasing graphic design and poster art work",
};

export default function DesignPage() {
  const designProjects = [
    {
      id: 1,
      title: "Minimalist Poster Series",
      description: "A series of minimalist posters exploring geometric shapes and typography.",
      category: "Poster Design",
      color: "from-accent/20 to-accent-secondary/20",
      featured: true,
    },
    {
      id: 2,
      title: "Brand Identity System",
      description: "Complete brand identity system including logo, typography, and color palette.",
      category: "Branding",
      color: "from-accent-secondary/20 to-accent-tertiary/20",
      featured: true,
    },
    {
      id: 3,
      title: "Editorial Layout",
      description: "Magazine layout design with a focus on typography and whitespace.",
      category: "Editorial",
      color: "from-accent-tertiary/20 to-accent/20",
      featured: false,
    },
    {
      id: 4,
      title: "Futuristic UI Design",
      description: "User interface design for a futuristic application concept.",
      category: "UI/UX",
      color: "from-accent/20 to-accent-tertiary/20",
      featured: true,
    },
    {
      id: 5,
      title: "Typography Exploration",
      description: "Experimental typography project exploring the boundaries of legibility.",
      category: "Typography",
      color: "from-accent-secondary/20 to-accent/20",
      featured: false,
    },
    {
      id: 6,
      title: "Album Cover Design",
      description: "Conceptual album cover design for an electronic music artist.",
      category: "Album Art",
      color: "from-accent-tertiary/20 to-accent-secondary/20",
      featured: false,
    },
  ];

  const categories = ["All", "Posters", "Branding", "Typography", "UI/UX", "Editorial"];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-secondary/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="fade-up flex items-center gap-2 text-sm mb-8" style={{ animationDelay: "0ms" }}>
            <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors">Home</Link>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground font-medium">Design</span>
          </div>

          <div className="mb-16">
            <div className="fade-up inline-block mb-6" style={{ animationDelay: "100ms" }}>
              <span className="px-4 py-2 rounded-full glass border border-accent/20 text-sm font-medium">
                💼 Portfolio
              </span>
            </div>
            <h1 className="fade-up text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ animationDelay: "200ms" }}>
              <span className="gradient-text">Design</span> Work
            </h1>
            <p className="fade-up text-xl md:text-2xl text-foreground/70 max-w-3xl leading-relaxed" style={{ animationDelay: "300ms" }}>
              Una collezione di progetti che uniscono creatività visiva e precisione tecnica, 
              dal branding alle interfacce digitali.
            </p>
          </div>

          <div className="fade-up flex flex-wrap gap-3" style={{ animationDelay: "400ms" }}>
            {categories.map((category, index) => (
              <button 
                key={category}
                className={`group px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30' 
                    : 'glass border border-foreground/10 hover:border-accent/30 hover:bg-foreground/5'
                }`}
              >
                {category}
                {index === 0 && <span className="ml-2 text-xs opacity-80">(6)</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
          {designProjects.map((project, index) => {
            const isFeatured = project.featured;
            const colSpan = isFeatured ? "lg:col-span-2" : "lg:col-span-1";
            const rowSpan = isFeatured && index === 0 ? "lg:row-span-2" : "";
            
            return (
              <div
                key={project.id}
                className={`fade-up group relative ${colSpan} ${rowSpan}`}
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <div className="relative h-full overflow-hidden rounded-2xl glass border border-foreground/10 p-8 transition-all duration-500 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10 card-glow">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className={`relative z-10 flex flex-col justify-between h-full ${isFeatured ? 'min-h-[400px]' : 'min-h-[300px]'}`}>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-xs font-medium mb-6 group-hover:border-accent/30 group-hover:bg-accent/10 transition-all duration-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-accent to-accent-secondary shimmer"></div>
                        {project.category}
                      </div>

                      <h3 className={`font-bold mb-4 tracking-tight ${isFeatured ? 'text-3xl md:text-4xl' : 'text-2xl'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-accent-secondary transition-all duration-300`}>
                        {project.title}
                      </h3>

                      <p className={`text-foreground/70 leading-relaxed ${isFeatured ? 'text-lg' : 'text-base'}`}>
                        {project.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                      <button className="group/btn flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-secondary transition-colors duration-300">
                        <span>View Project</span>
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>

                      {isFeatured && (
                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-accent/20 to-accent-secondary/20 border border-accent/30 text-xs font-medium text-accent">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 float"></div>
                  <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-accent-secondary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 float" style={{ animationDelay: "0.5s" }}></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fade-up mt-16 text-center" style={{ animationDelay: "1100ms" }}>
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl glass border border-foreground/10">
            <p className="text-foreground/70">Vuoi vedere altri progetti?</p>
            <button className="group/cta px-8 py-4 rounded-full bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-accent/30 hover:scale-105 magnetic">
              <span className="flex items-center gap-2">
                Esplora Tutti i Progetti
                <svg className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}