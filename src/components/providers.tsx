"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

// Quem pede "reduzir movimento" no sistema operacional recebe o site sem deslocamentos.
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
