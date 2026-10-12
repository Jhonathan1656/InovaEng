import { cn } from "@/lib/cn";

// Placa de advertência (losango amarelo) com o perfil de uma pista: estrada + dado.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect x="6" y="6" width="20" height="20" rx="3" transform="rotate(45 16 16)" fill="#f2c230" />
      <path
        d="M8.8 17h3.2l1.8-4.4 2.8 7.2 2.2-5h4.4"
        stroke="#0b0b0b"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-7" />
      <span translate="no" className="text-[1.05rem] font-bold tracking-[0.16em] text-ink">
        INOVA
      </span>
    </span>
  );
}
