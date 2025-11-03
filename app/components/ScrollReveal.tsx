"use client";

import { useEffect } from "react";

const MAX_AUTO_DELAY = 200;
const AUTO_DELAY_STEP = 40;

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    if (elements.length === 0) return;

    const applyInstantReveal = () => {
      elements.forEach((element) => {
        element.classList.add("revealed");
      });
    };

    elements.forEach((element, index) => {
      if (element.style.getPropertyValue("--reveal-delay")) {
        return;
      }

      const customDelay = element.dataset.revealDelay;

      if (customDelay) {
        element.style.setProperty("--reveal-delay", customDelay);
        return;
      }

      const autoDelay = Math.min(index * AUTO_DELAY_STEP, MAX_AUTO_DELAY);
      element.style.setProperty("--reveal-delay", `${autoDelay}ms`);
    });

    let observer: IntersectionObserver | null = null;

    const registerObserver = () => {
      if (observer) {
        observer.disconnect();
      }

      observer = new IntersectionObserver(
        (entries, activeObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            requestAnimationFrame(() => entry.target.classList.add("revealed"));
            activeObserver.unobserve(entry.target);
          });
        },
        { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
      );

      elements.forEach((element) => {
        if (!element.classList.contains("revealed")) {
          observer?.observe(element);
        }
      });
    };

    if (motionQuery?.matches) {
      applyInstantReveal();
    } else {
      registerObserver();
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        applyInstantReveal();
        observer?.disconnect();
        observer = null;
      } else {
        registerObserver();
      }
    };

    if (motionQuery) {
      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", handleMotionChange);
      } else if (typeof motionQuery.addListener === "function") {
        motionQuery.addListener(handleMotionChange);
      }
    }

    return () => {
      if (motionQuery) {
        if (typeof motionQuery.removeEventListener === "function") {
          motionQuery.removeEventListener("change", handleMotionChange);
        } else if (typeof motionQuery.removeListener === "function") {
          motionQuery.removeListener(handleMotionChange);
        }
      }

      observer?.disconnect();
    };
  }, []);

  return null;
}
