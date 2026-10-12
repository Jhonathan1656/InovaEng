import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./reveal";

type Props = {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

// Título de seção sem rótulo acima: o título sozinho já basta (DESIGN.md, "Não fazer").
export function SectionHeading({ id, title, description, className }: Props) {
  return (
    <Reveal className={cn("max-w-2xl", className)}>
      <h2
        id={id}
        className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-balance text-ink"
      >
        {title}
      </h2>
      {description ? <p className="mt-4 text-lg leading-relaxed text-pretty text-body">{description}</p> : null}
    </Reveal>
  );
}
