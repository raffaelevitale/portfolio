"use client";

import { useCallback, useSyncExternalStore } from "react";

function useMediaQuery(query: string) {
  const subscribe = useCallback((change: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

export function useCompactLayout() {
  return useMediaQuery("(max-width: 760px), (pointer: coarse) and (max-height: 520px)");
}

export function useTouchInput() {
  return useMediaQuery("(pointer: coarse)");
}
