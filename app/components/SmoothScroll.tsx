'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY;
      
      // Parallax elements
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax') || '0.5');
        const yPos = -(scrolled * speed);
        (el as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      // Reveal elements on scroll
      const revealElements = document.querySelectorAll('.reveal:not(.revealed)');
      revealElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;
        
        if (isVisible) {
          // Add stagger delay based on index
          setTimeout(() => {
            el.classList.add('revealed');
          }, index * 100); // 100ms delay between each element
        }
      });
    };

    // Magnetic hover effect
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach((el) => {
      const element = el as HTMLElement;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const strength = 0.3;
        element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      };
      
      const handleMouseLeave = () => {
        element.style.transform = 'translate(0, 0)';
      };
      
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}
