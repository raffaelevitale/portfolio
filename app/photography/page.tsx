import Link from "next/link";

export const metadata = {
  title: "Photography",
  description: "Visual explorations",
};

export default function PhotographyPage() {
  const photos = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: "Frame " + String(i + 1).padStart(2, "0"),
  }));

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
            <span className="bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">PHOTO</span>
            <br />GRAPHY
          </h1>
          <p className="reveal text-xl text-foreground/70 max-w-3xl">
            Visual explorations through the lens.
          </p>
        </div>
      </section>
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid-obys">
          {photos.map((photo) => (
            <div key={photo.id} className="reveal group card-clean hover-lift overflow-hidden cursor-pointer">
              <div className="aspect-[4/5] bg-gradient-to-br from-foreground/5 to-foreground/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-foreground/10">{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
