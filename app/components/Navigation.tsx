'use client';

import {useState} from 'react';
import Link from 'next/link';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (<nav
            className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-foreground/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 hover:via-foreground/90 hover:to-foreground transition-colors">
                    PORTFOLIO
                </Link>

                {/* Mobile menu button */}
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>) : (
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>)}
                    </svg>
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/design" className="group relative hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:scale-x-0 after:origin-left after:bg-gradient-to-r after:from-transparent after:via-foreground/70 after:to-transparent after:transition-transform hover:after:scale-x-100">
                        Design
                    </Link>
                    <Link href="/photography" className="group relative hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:scale-x-0 after:origin-left after:bg-gradient-to-r after:from-transparent after:via-foreground/70 after:to-transparent after:transition-transform hover:after:scale-x-100">
                        Photography
                    </Link>
                    <Link href="/links" className="group relative hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:scale-x-0 after:origin-left after:bg-gradient-to-r after:from-transparent after:via-foreground/70 after:to-transparent after:transition-transform hover:after:scale-x-100">
                        Links
                    </Link>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-foreground/10">
                    <div className="flex flex-col space-y-4 p-6">
                        <Link
                            href="/design"
                            className="hover:text-foreground/70 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Design
                        </Link>
                        <Link
                            href="/photography"
                            className="hover:text-foreground/70 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Photography
                        </Link>
                        <Link
                            href="/links"
                            className="hover:text-foreground/70 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Links
                        </Link>
                    </div>
                </div>)}
        </nav>);
}