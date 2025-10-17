import Link from "next/link";

export const metadata = {
  title: "Design Portfolio",
  description: "Showcasing graphic design and poster art work",
};

export default function DesignPage() {
  // Sample design projects - in a real portfolio, these would come from a CMS or data file
  const designProjects = [
    {
      id: 1,
      title: "Minimalist Poster Series",
      description: "A series of minimalist posters exploring geometric shapes and typography.",
      category: "Poster Design",
      thumbnail: "/placeholder-1.jpg", // These would be replaced with actual images
    },
    {
      id: 2,
      title: "Brand Identity System",
      description: "Complete brand identity system including logo, typography, and color palette.",
      category: "Branding",
      thumbnail: "/placeholder-2.jpg",
    },
    {
      id: 3,
      title: "Editorial Layout",
      description: "Magazine layout design with a focus on typography and whitespace.",
      category: "Editorial",
      thumbnail: "/placeholder-3.jpg",
    },
    {
      id: 4,
      title: "Futuristic UI Design",
      description: "User interface design for a futuristic application concept.",
      category: "UI/UX",
      thumbnail: "/placeholder-4.jpg",
    },
    {
      id: 5,
      title: "Typography Exploration",
      description: "Experimental typography project exploring the boundaries of legibility.",
      category: "Typography",
      thumbnail: "/placeholder-5.jpg",
    },
    {
      id: 6,
      title: "Album Cover Design",
      description: "Conceptual album cover design for an electronic music artist.",
      category: "Album Art",
      thumbnail: "/placeholder-6.jpg",
    },
  ];

  const truncate = (str: string, words = 12) => {
    const parts = str.split(/\s+/);
    return parts.length > words ? parts.slice(0, words).join(" ") + "…" : str;
  };
  
  return (
    <div className="min-h-screen py-20 px-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Design Portfolio</h1>
        <p className="text-xl text-foreground/70 max-w-2xl">
          A collection of graphic design work, poster art, and visual experiments that showcase
          my minimalist and futuristic aesthetic.
        </p>
      </header>

      {/* Filter Categories - could be made interactive with client-side JavaScript */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-wrap gap-3 mb-8">
          <button className="px-4 py-2 rounded-full bg-foreground text-background text-sm">
            All
          </button>
          <button className="px-4 py-2 rounded-full border border-foreground/20 text-sm hover:border-foreground/50 transition-colors">
            Posters
          </button>
          <button className="px-4 py-2 rounded-full border border-foreground/20 text-sm hover:border-foreground/50 transition-colors">
            Branding
          </button>
          <button className="px-4 py-2 rounded-full border border-foreground/20 text-sm hover:border-foreground/50 transition-colors">
            Typography
          </button>
          <button className="px-4 py-2 rounded-full border border-foreground/20 text-sm hover:border-foreground/50 transition-colors">
            UI/UX
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designProjects.map((project) => (
            <div key={project.id} className="group reveal">
              {/* Project thumbnail - using a div as placeholder since we don't have actual images */}
              <div 
                className="relative aspect-[4/3] bg-foreground/10 rounded-lg mb-4 overflow-hidden group-hover:shadow-lg transition-all duration-300"
              >
                <div className="w-full h-full bg-gradient-to-br from-foreground/5 to-foreground/20 group-hover:scale-105 transition-transform duration-500"></div>
                <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-background/60 via-transparent to-transparent">
                  <span className="text-xs font-medium">View Project</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 bg-background/60 backdrop-blur">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </div>
              </div>
              
              {/* Project info */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-medium">{project.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent">
                    {project.category}
                  </span>
                </div>
                <p className="text-foreground/70 text-sm">{truncate(project.description, 12)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-6xl mx-auto mt-24 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Interested in working together?</h2>
        <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        <Link 
          href="/links" 
          className="px-8 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 font-medium inline-block"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}