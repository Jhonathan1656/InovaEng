import { linkWhatsApp, navLinks, site } from "@/lib/site";
import { Logo } from "./logo";

const linkRodape = "text-body transition-colors hover:text-ink";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="container-x grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {site.tagline}. Processamento de levantamentos, software e pipelines no padrão do cliente.
          </p>
        </div>
        <nav aria-label="Rodapé" className="md:col-span-4">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkRodape}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#modelos" className={linkRodape}>
                Como contratar
              </a>
            </li>
            <li>
              <a href="#contato" className={linkRodape}>
                Contato
              </a>
            </li>
          </ul>
        </nav>
        <div className="space-y-3 text-sm md:col-span-3">
          <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className={`block ${linkRodape}`}>
            WhatsApp {site.whatsappExibicao}
          </a>
          <a href={`mailto:${site.email}`} className={`block break-all ${linkRodape}`}>
            {site.email}
          </a>
        </div>
      </div>
      <div className="border-t border-hairline">
        <p className="container-x py-6 text-xs text-muted">
          © {site.year} <span translate="no">INOVA</span>. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
