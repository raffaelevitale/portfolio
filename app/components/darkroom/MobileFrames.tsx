import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useDarkroom } from "@/lib/darkroom/store";

export default function MobileFrames() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => useDarkroom.subscribe((next, previous) => {
    if (next.phase !== previous.phase || next.focus !== previous.focus
      || next.safelight !== previous.safelight || next.selectedBook !== previous.selectedBook) invalidate();
  }), [invalidate]);

  return null;
}
