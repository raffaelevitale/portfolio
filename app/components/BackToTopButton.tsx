'use client';

export default function BackToTopButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="magnetic inline-flex items-center gap-2 text-foreground/75 hover:text-accent transition-colors text-sm font-medium group"
      aria-label="Scroll to top"
      type="button"
    >
      Back to top
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-y-1 transition-transform">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}

