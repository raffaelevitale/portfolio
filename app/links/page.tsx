import Link from "next/link";

export const metadata = {
  title: "Links",
  description: "Connect with me",
};

export default function LinksPage() {
  const links = [
    { title: "Instagram", url: "https://www.instagram.com/josh63.exe/", color: "from-pink-500/20 to-purple-500/20" },
    { title: "LinkedIn", url: "https://www.linkedin.com/in/vitaleraffaele/", color: "from-blue-600/20 to-blue-700/20" },
    { title: "Email", url: "mailto:raffaele.stuudio@gmail.com", color: "from-accent/20 to-accent-secondary/20" },
  ];

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </Link>
          </div>
          <h1 className="reveal text-huge mb-6">
            <span className="bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">LETS</span>
            <br />CONNECT
          </h1>
          <p className="reveal text-xl text-foreground/70 max-w-2xl mb-16">
            Feel free to reach out for collaborations or just a friendly hello.
          </p>
          <div className="reveal space-y-4">
            {links.map((link, i) => (
              <a key={i} href={link.url} className="card-clean hover-lift block group">
                <div className={"aspect-[4/1] bg-gradient-to-r " + link.color + " rounded-lg flex items-center justify-center"}>
                  <h2 className="text-3xl font-bold group-hover:scale-110 transition-transform">{link.title}</h2>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
