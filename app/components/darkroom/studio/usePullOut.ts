import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { type Group, MathUtils } from "three";
import { useDarkroom } from "@/lib/darkroom/store";
import { useReducedMotion } from "../useReducedMotion";

export function usePullOut(index: number, ref: RefObject<Group | null>, turn: number, staged = true, narrowInset = 0) {
  const reduced = useReducedMotion();
  const progress = useRef(0);
  useFrame(({ size, frameloop, invalidate }, dt) => {
    const book = ref.current;
    if (!book) return;
    const out = useDarkroom.getState().selectedBook === index;
    const step = (frameloop === "demand" ? Math.min(dt, 0.05) : dt) / (staged ? 0.62 : 0.35);
    const next = reduced ? Number(out) : Math.max(0, Math.min(1, progress.current + (out ? step : -step)));
    const narrow = size.width / size.height < 0.85;
    const rotate = MathUtils.smoothstep(next, staged ? 0.55 : 0, 1);
    // Dopo l'estrazione, avvicina al centro i volumi ai bordi del quadro verticale.
    const x = narrow ? narrowInset * rotate : 0;
    if (frameloop === "demand" && next !== Number(out)) invalidate();
    if (next === progress.current && book.position.x === x) return;
    progress.current = next;
    // La rotazione comincia fuori dal ripiano, così la copertina non attraversa i libri vicini.
    const pull = MathUtils.smoothstep(progress.current, 0, staged ? 0.55 : 1);
    book.position.set(x, 0.03 * pull, 0.2 * pull);
    book.rotation.y = turn * rotate;
  });
}
