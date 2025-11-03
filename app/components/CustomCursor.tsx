'use client';

import { useEffect, useState, useRef } from 'react';

const STORAGE_KEY = 'portfolio:custom-cursor-disabled';

// Throttle function for performance
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const isInteractiveElement = (element: HTMLElement | null) => {
  if (!element) return false;
  if (element.closest('[data-cursor="interactive"]')) return true;
  return Boolean(
    element.closest(
      'a, button, [role="button"], .magnetic, input, textarea, select, summary'
    )
  );
};

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(STORAGE_KEY) !== 'true';
  });

  const shouldRender = isPointerFine && !prefersReducedMotion && isEnabled;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pointerQuery = window.matchMedia?.('(pointer: fine)');
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    const updatePointer = () => setIsPointerFine(Boolean(pointerQuery?.matches));
    const updateMotion = () => setPrefersReducedMotion(Boolean(motionQuery?.matches));

    updatePointer();
    updateMotion();

    if (pointerQuery) {
      if (typeof pointerQuery.addEventListener === 'function') {
        pointerQuery.addEventListener('change', updatePointer);
      } else if (typeof pointerQuery.addListener === 'function') {
        pointerQuery.addListener(updatePointer);
      }
    }

    if (motionQuery) {
      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', updateMotion);
      } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener(updateMotion);
      }
    }

    return () => {
      if (pointerQuery) {
        if (typeof pointerQuery.removeEventListener === 'function') {
          pointerQuery.removeEventListener('change', updatePointer);
        } else if (typeof pointerQuery.removeListener === 'function') {
          pointerQuery.removeListener(updatePointer);
        }
      }

      if (motionQuery) {
        if (typeof motionQuery.removeEventListener === 'function') {
          motionQuery.removeEventListener('change', updateMotion);
        } else if (typeof motionQuery.removeListener === 'function') {
          motionQuery.removeListener(updateMotion);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.dataset.cursor = shouldRender ? 'enabled' : 'disabled';
    return () => {
      document.body.dataset.cursor = 'disabled';
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      setHasInteracted(false);
      setIsHovering(false);
      return;
    }

    const updatePosition = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setHasInteracted(true);
    };

    // Throttle to ~60fps (16ms) for better performance
    const throttledUpdatePosition = throttle(updatePosition, 16);

    const handleMouseLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        setHasInteracted(false);
        setIsHovering(false);
      }
    };

    const handleEnter = (event: Event) => {
      if (isInteractiveElement(event.target as HTMLElement | null)) {
        setIsHovering(true);
      }
    };

    const handleLeaveInteractive = (event: Event) => {
      if (isInteractiveElement(event.target as HTMLElement | null)) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', throttledUpdatePosition, { passive: true });
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mouseenter', handleEnter, true);
    document.addEventListener('mouseleave', handleLeaveInteractive, true);

    return () => {
      document.removeEventListener('mousemove', throttledUpdatePosition);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mouseenter', handleEnter, true);
      document.removeEventListener('mouseleave', handleLeaveInteractive, true);
    };
  }, [shouldRender]);

  const toggleCursor = () => {
    setIsEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        if (next) {
          window.localStorage.removeItem(STORAGE_KEY);
        } else {
          window.localStorage.setItem(STORAGE_KEY, 'true');
        }
      }
      return next;
    });
  };

  const toggleButtonDisabled = !isPointerFine || prefersReducedMotion;
  const toggleButtonLabel = (() => {
    if (!isPointerFine) {
      return 'Custom cursor is unavailable on touch devices';
    }
    if (prefersReducedMotion) {
      return 'Custom cursor disabled to respect reduced motion preference';
    }
    return isEnabled ? 'Disable custom cursor' : 'Enable custom cursor';
  })();

  return (
    <>
      <button
        type="button"
        onClick={toggleButtonDisabled ? undefined : toggleCursor}
        aria-pressed={isEnabled}
        aria-label={toggleButtonLabel}
        disabled={toggleButtonDisabled}
        className="sr-only focus:not-sr-only focus:fixed focus:bottom-6 focus:right-6 focus:z-[10000] focus:px-4 focus:py-2 focus:rounded-md focus:bg-background focus:text-foreground focus:shadow-lg"
      >
        {toggleButtonLabel}
      </button>

      {shouldRender && hasInteracted && (
        <>
          <div
            className="custom-cursor-dot"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: isHovering ? '6px' : '10px',
              height: isHovering ? '6px' : '10px',
            }}
          />
          <div
            className="custom-cursor-ring"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: isHovering ? '60px' : '40px',
              height: isHovering ? '60px' : '40px',
              opacity: isHovering ? 0.75 : 0.6,
            }}
          />
        </>
      )}
    </>
  );
}
