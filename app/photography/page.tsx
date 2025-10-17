import Link from "next/link";

export const metadata = {
  title: "Photography Portfolio",
  description: "Showcasing photography work and visual storytelling",
};

export default function PhotographyPage() {
  // Sample photography projects - in a real portfolio, these would come from a CMS or data file
  const photographyProjects = [
    {
      id: 1,
      title: "Urban Geometry",
      description: "Exploring geometric patterns in urban architecture.",
      category: "Architecture",
      thumbnail: "/photo-placeholder-1.jpg", // These would be replaced with actual images
    },
    {
      id: 2,
      title: "Minimalist Portraits",
      description: "Portrait series with minimalist composition and lighting.",
      category: "Portrait",
      thumbnail: "/photo-placeholder-2.jpg",
    },
    {
      id: 3,
      title: "Abstract Light Studies",
      description: "Experimental photography exploring light and shadow.",
      category: "Abstract",
      thumbnail: "/photo-placeholder-3.jpg",
    },
    {
      id: 4,
      title: "Urban Nightscapes",
      description: "Night photography capturing the essence of city life.",
      category: "Urban",
      thumbnail: "/photo-placeholder-4.jpg",
    },
    {
      id: 5,
      title: "Monochrome Series",
      description: "Black and white photography focusing on texture and form.",
      category: "Monochrome",
      thumbnail: "/photo-placeholder-5.jpg",
    },
    {
      id: 6,
      title: "Macro Details",
      description: "Close-up photography revealing hidden details in everyday objects.",
      category: "Macro",
      thumbnail: "/photo-placeholder-6.jpg",
    },
    {
      id: 7,
      title: "Minimalist Landscapes",
      description: "Landscape photography with a focus on simplicity and negative space.",
      category: "Landscape",
      thumbnail: "/photo-placeholder-7.jpg",
    },
    {
      id: 8,
      title: "Street Photography",
      description: "Candid moments capturing the essence of street life.",
      category: "Street",
      thumbnail: "/photo-placeholder-8.jpg",
    },
  ];

  const counts = photographyProjects.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const total = photographyProjects.length;

  return (
    <div className="min-h-screen py-20 px-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-16">
        <h1 className="reveal text-4xl md:text-5xl font-bold tracking-tight mb-6">Photography</h1>
        <p className="reveal text-xl text-foreground/70 max-w-2xl">
          A collection of photographic work exploring composition, light, and storytelling
          through a minimalist and contemporary lens.
        </p>
      </header>

      {/* Filter Categories */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-wrap gap-3 mb-8">
          <button className="px-4 py-2 rounded-full bg-foreground text-background text-sm">
            {`All (${total})`}
          </button>
          <button className="px-4 py-2 rounded-full border border-foreground/20 text-sm hover:border-foreground/50 transition-colors">
            {`Portrait (${counts["Portrait"] ?? 0})`}
          </button>
          <button className="px-4 py-2 rounded-full border border-foreground/20 text-sm hover:border-foreground/50 transition-colors">
            {`Architecture (${counts["Architecture"] ?? 0})`}
          </button>
          <button className="px-4 py-2 rounded-full border border-foreground/20 text-sm hover:border-foreground/50 transition-colors">
            {`Abstract (${counts["Abstract"] ?? 0})`}
          </button>
          <button className="px-4 py-2 rounded-full border border-foreground/20 text-sm hover:border-foreground/50 transition-colors">
            {`Street (${counts["Street"] ?? 0})`}
          </button>
        </div>
      </div>

      {/* Gallery - Using a masonry-like layout */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {photographyProjects.map((project, index) => {
            // Alternate between different aspect ratios for visual interest
            const aspectRatios = ["aspect-square", "aspect-[3/4]", "aspect-[4/3]"];
            const isWide = index % 7 === 0;
            const ar = isWide ? "aspect-[21/9]" : aspectRatios[index % aspectRatios.length];
            
            return (
              <div 
                key={project.id} 
                className={`group reveal ${isWide ? "lg:col-span-3" : index % 3 === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                {/* Photo thumbnail */}
                <div 
                  className={`${ar} bg-foreground/10 rounded-lg overflow-hidden group-hover:shadow-lg transition-all duration-300 mb-3`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-foreground/5 to-foreground/20 group-hover:scale-105 transition-transform duration-500"></div>
                </div>
                
                {/* Photo info */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">{project.title}</h3>
                    <span className="text-xs px-2 py-1 bg-foreground/5 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-foreground/70 text-sm mt-1">{project.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Photography approach section */}
      <div className="max-w-4xl mx-auto mt-24 py-16 border-t border-b border-foreground/10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">My Approach to Photography</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Vision</h3>
            <p className="text-foreground/70">
              I approach photography as a means to reveal the extraordinary in the ordinary. 
              My work focuses on finding beauty in simplicity, using light, composition, and 
              timing to create images that tell a story or evoke an emotion.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-4">Process</h3>
            <p className="text-foreground/70">
              Each photograph is carefully composed and edited to maintain a consistent aesthetic 
              that balances minimalism with emotional impact. I work primarily with natural light 
              and focus on creating images that feel both contemporary and timeless.
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-6xl mx-auto mt-24 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Interested in a photography session?</h2>
        <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
          I'm available for commissioned photography work. Let's discuss how we can create 
          something beautiful together.
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