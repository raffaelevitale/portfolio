'use client';

import { useEffect } from 'react';

type CleanupFn = () => void;

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const originalScrollBehavior = root.style.scrollBehavior;
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia?.('(pointer: fine)');

    const applyScrollBehavior = () => {
      if (motionQuery?.matches) {
        root.style.scrollBehavior = originalScrollBehavior;
      } else {
        root.style.scrollBehavior = 'smooth';
      }
    };

    applyScrollBehavior();

    let parallaxCleanup: CleanupFn | undefined;
    let magneticCleanup: CleanupFn | undefined;

    const cleanupParallax = () => {
      parallaxCleanup?.();
      parallaxCleanup = undefined;
    };

    const cleanupMagnetic = () => {
      magneticCleanup?.();
      magneticCleanup = undefined;
    };

    const setupParallax = () => {
      cleanupParallax();

      if (motionQuery?.matches || !pointerQuery?.matches) return;

      const elements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-parallax]')
      );

      if (elements.length === 0) return;

      const handleScroll = () => {
        const scrolled = window.scrollY;

        elements.forEach((element) => {
          const speed = Number.parseFloat(element.getAttribute('data-parallax') ?? '0.5');
          const yPos = -(scrolled * speed);
          element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      parallaxCleanup = () => {
        window.removeEventListener('scroll', handleScroll);
        elements.forEach((element) => {
          element.style.transform = '';
        });
      };
    };

    const setupMagnetic = () => {
      cleanupMagnetic();

      if (motionQuery?.matches || !pointerQuery?.matches) return;

      const elements = Array.from(document.querySelectorAll<HTMLElement>('.magnetic'));
      if (elements.length === 0) return;

      const cleanups = elements.map((element) => {
        const strength = Number.parseFloat(element.dataset.magneticStrength ?? '0.3');

        const handleMouseMove = (event: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;

          element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        };

        const handleMouseLeave = () => {
          element.style.transform = '';
        };

        element.addEventListener('mousemove', handleMouseMove, { passive: true });
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          element.removeEventListener('mousemove', handleMouseMove);
          element.removeEventListener('mouseleave', handleMouseLeave);
          element.style.transform = '';
        };
      });

      magneticCleanup = () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    };

    setupParallax();
    setupMagnetic();

    const handleMotionChange = () => {
      applyScrollBehavior();
      cleanupParallax();
      cleanupMagnetic();
      if (!motionQuery?.matches) {
        setupParallax();
        setupMagnetic();
      }
    };

    const handlePointerChange = () => {
      cleanupParallax();
      cleanupMagnetic();

      if (pointerQuery?.matches && !motionQuery?.matches) {
        setupParallax();
        setupMagnetic();
      }
    };

    if (motionQuery) {
      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', handleMotionChange);
      } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener(handleMotionChange);
      }
    }

    if (pointerQuery) {
      if (typeof pointerQuery.addEventListener === 'function') {
        pointerQuery.addEventListener('change', handlePointerChange);
      } else if (typeof pointerQuery.addListener === 'function') {
        pointerQuery.addListener(handlePointerChange);
      }
    }

    return () => {
      cleanupParallax();
      cleanupMagnetic();
      root.style.scrollBehavior = originalScrollBehavior;

      if (motionQuery) {
        if (typeof motionQuery.removeEventListener === 'function') {
          motionQuery.removeEventListener('change', handleMotionChange);
        } else if (typeof motionQuery.removeListener === 'function') {
          motionQuery.removeListener(handleMotionChange);
        }
      }

      if (pointerQuery) {
        if (typeof pointerQuery.removeEventListener === 'function') {
          pointerQuery.removeEventListener('change', handlePointerChange);
        } else if (typeof pointerQuery.removeListener === 'function') {
          pointerQuery.removeListener(handlePointerChange);
        }
      }
    };
  }, []);

  return null;
}
