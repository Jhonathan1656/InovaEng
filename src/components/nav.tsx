"use client";

import { useEffect, useState } from "react";
import { ListIcon, WhatsappLogoIcon, XIcon } from "@phosphor-icons/react";
import { linkWhatsApp, navLinks } from "@/lib/site";
import { Logo } from "./logo";

export function Nav() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-canvas">
      <nav aria-label="Principal" className="container-x flex h-16 items-center justify-between gap-6">
        <a href="#topo" aria-label="INOVA, voltar ao topo" className="rounded-md">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-medium text-body transition-colors hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary hidden min-h-10 px-4 text-sm sm:inline-flex"
          >
            <WhatsappLogoIcon aria-hidden="true" size={18} weight="bold" />
            Solicitar proposta
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-elevated md:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <XIcon aria-hidden="true" size={22} /> : <ListIcon aria-hidden="true" size={22} />}
          </button>
        </div>
      </nav>

      <div id="menu-celular" hidden={!aberto} className="border-t border-hairline md:hidden">
        <ul className="container-x flex flex-col py-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setAberto(false)}
                className="block py-3 text-base font-medium text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="container-x pb-5">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setAberto(false)}
            className="btn btn-primary w-full"
          >
            <WhatsappLogoIcon aria-hidden="true" size={18} weight="bold" />
            Solicitar proposta
          </a>
        </div>
      </div>
    </header>
  );
}
