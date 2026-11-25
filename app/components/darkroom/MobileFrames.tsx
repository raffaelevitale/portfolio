import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useDarkroom } from "@/lib/darkroom/store";

export default function MobileFrames() {
  const invalidate = useThree((state) => state.invalidate);
  const focus = useDarkroom((state) => state.focus);

  useEffect(() => useDarkroom.subscribe((next, previous) => {
    if (next.phase !== previous.phase || next.room !== previous.room || next.focus !== previous.focus
      || next.switching !== previous.switching || next.selectedBook !== previous.selectedBook) invalidate();
  }), [invalidate]);

  useEffect(() => {
    if (focus !== "vetrina") return;
    // Le lancette restano aggiornate, mentre il resto della stanza può rimanere fermo.
    const timer = window.setInterval(() => {
      if (!document.hidden) invalidate();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [focus, invalidate]);

  return null;
}
