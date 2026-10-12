"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";

/**
 * Relógio 0 → `ate` que toca uma vez quando o elemento entra na tela e para no quadro final.
 * `replay` toca de novo (ex.: ao passar o mouse). Com "reduzir movimento", vai direto ao quadro final.
 */
export function usePlayOnce<T extends Element>(duracao: number, ate = 1) {
  const ref = useRef<T>(null);
  const progress = useMotionValue(0);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();
  const tocando = useRef(false);
  const controles = useRef<ReturnType<typeof animate> | null>(null);

  const replay = useCallback(() => {
    if (reduce || tocando.current) return;
    tocando.current = true;
    progress.jump(0);
    controles.current = animate(progress, ate, {
      duration: duracao * ate,
      ease: "linear",
      onComplete: () => {
        tocando.current = false;
      },
    });
  }, [reduce, progress, ate, duracao]);

  useEffect(() => {
    if (reduce) {
      progress.jump(ate);
      return;
    }
    if (inView) replay();
  }, [inView, reduce, replay, progress, ate]);

  useEffect(() => () => controles.current?.stop(), []);

  return { ref, progress, replay };
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
