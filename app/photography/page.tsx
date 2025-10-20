import Link from "next/link";

export const metadata = {
  title: "Photography Portfolio",
  description: "Showcasing photography work and visual storytelling",
};

export default function PhotographyPage() {
  const photographyProjects = [
    {
      id: 1,
      title: "Urban Geometry",
      description: "Exploring geometric patterns in urban architecture.",
      category: "Architecture",
      color: "from-accent/30 to-accent-secondary/30",
      aspectRatio: "aspect-[4/3]",
    },
    {
      id: 2,
      title: "Minimalist Portraits",
      description: "Portrait series with minimalist composition and lighting.",
      category: "Portrait",
      color: "from-accent-secondary/30 to-accent-tertiary/30",
      aspectRatio: "aspect-[3/4]",
    },
    {
      id: 3,
      title: "Abstract Light Studies",
      description: "Experimental photography exploring light and shadow.",
      category: "Abstract",
      color: "from-accent-tertiary/30 to-accent/30",
      aspectRatio: "aspect-square",
    },
    {
      id: 4,
      title: "Urban Nightscapes",
      description: "Night photography capturing the essence of city life.",
      category: "Urban",
      color: "from-accent/30 to-accent-tertiary/30",
      aspectRatio: "aspect-[21/9]",
    },
    {
      id: 5,
      title: "Monochrome Series",
      description: "Black and white photography focusing on texture and form.",
      category: "Monochrome",
      color: "from-accent-secondary/30 to-accent/30",
      aspectRatio: "aspect-[4/5]",
    },
    {
      id: 6,
      title: "Macro Details",
      description: "Close-up photography revealing hidden details in everyday objects.",
      category: "Macro",
      color: "from-accent-tertiary/30 to-accent-secondary/30",
      aspectRatio: "aspect-square",
    },
    {
      id: 7,
      title: "Minimalist Landscapes",
      description: "Landscape photography with a focus on simplicity and negative space.",
      category: "Landscape",
      color: "from-accent/30 to-accent-secondary/30",
      aspectRatio: "aspect-[16/9]",
    },
    {
      id: 8,
      title: "Street Photography",
      description: "Candid moments capturing the essence of street life.",
      category: "Street",
      color: "from-accent-secondary/30 to-accent-tertiary/30",
      aspectRatio: "aspect-[3/4]",
    },
  ];

  const categories = ["All", "Architecture", "Portrait", "Abstract", "Urban", "Street"];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-accent-tertiary/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="fade-up flex items-center gap-2 text-sm mb-8" style={{ animationDelay: "0ms" }}>
            <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors">Home</Link>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground font-medium">Photography</span>
          </div>

          <div className="mb-16">
            <div className="fade-up inline-block mb-6" style={{ animationDelay: "100ms" }}>
              <span className="px-4 py-2 rounded-full glass border border-accent-tertiary/20 text-sm font-medium">
                📸 Gallery
              </span>
            </div>
            <h1 className="fade-up text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ animationDelay: "200ms" }}>
              Photo<span className="gradient-text">graphy</span>
            </h1>
            <p className="fade-up text-xl md:text-2xl text-foreground/70 max-w-3xl leading-relaxed" style={{ animationDelay: "300ms" }}>
              Catturare momenti, emozioni e storie attraverso l'obiettivo. 
              Una collezione di lavori che esplorano luce, composizione e narrazione visiva.
            </p>
          </div>

          <div className="fade-up flex flex-wrap gap-3" style={{ animationDelay: "400ms" }}>
            {categories.map((category, index) => (
              <button 
                key={category}
                className={`group px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-accent-tertiary to-accent text-accent-foreground shadow-lg shadow-accent-tertiary/20 hover:shadow-xl hover:shadow-accent-tertiary/30' 
                    : 'glass border border-foreground/10 hover:border-accent-tertiary/30 hover:bg-foreground/5'
                }`}
              >
                {category}
                {index === 0 && <span className="ml-2 text-xs opacity-80">(8)</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid Gallery */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {photographyProjects.map((project, index) => (
            <div
              key={project.id}
              className="fade-up break-inside-avoid"
              style={{ animationDelay: `${500 + index * 80}ms` }}
            >
              <div className="group relative overflow-hidden rounded-2xl">
                {/* Image Placeholder with gradient */}
                <div className={`${project.aspectRatio} relative bg-gradient-to-br ${project.color} transition-transform duration-700 group-hover:scale-105`}>
                  <div className="absolute inset-0 bg-foreground/5"></div>
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 backdrop-blur-xl border border-foreground/20 text-xs font-medium mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-accent-tertiary to-accent shimmer"></div>
                        {project.category}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                      <p className="text-foreground/80 text-sm mb-4">{project.description}</p>
                      
                      <button className="group/btn inline-flex items-center gap-2 text-sm font-medium text-accent-tertiary hover:text-accent transition-colors duration-300">
                        <span>View Full Size</span>
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-background/80 to-transparent backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="fade-up grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 p-8 rounded-2xl glass border border-foreground/10" style={{ animationDelay: "1200ms" }}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">100+</div>
            <div className="text-sm text-foreground/60">Progetti Completati</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">8</div>
            <div className="text-sm text-foreground/60">Categorie</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">5+</div>
            <div className="text-sm text-foreground/60">Anni di Esperienza</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">50+</div>
            <div className="text-sm text-foreground/60">Clienti Soddisfatti</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="fade-up mt-16 text-center" style={{ animationDelay: "1300ms" }}>
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl glass border border-foreground/10">
            <p className="text-foreground/70">Interessato a una sessione fotografica?</p>
            <button className="group/cta px-8 py-4 rounded-full bg-gradient-to-r from-accent-tertiary to-accent text-accent-foreground font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-accent-tertiary/30 hover:scale-105 magnetic">
              <span className="flex items-center gap-2">
                Contattami
                <svg className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}