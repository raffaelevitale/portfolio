"use client";

import dynamic from "next/dynamic";

// Lazy load heavy interactive components on the client only
const CustomCursor = dynamic(() => import("./CustomCursor"), {
  ssr: false,
});
const SmoothScroll = dynamic(() => import("./SmoothScroll"), {
  ssr: false,
});
const ScrollReveal = dynamic(() => import("./ScrollReveal"), {
  ssr: false,
});

export default function ClientEnhancements() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll />
      <ScrollReveal />
    </>
  );
}

