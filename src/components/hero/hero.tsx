import { WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { linkWhatsApp } from "@/lib/site";
import { Reveal } from "../reveal";
import { HeroScan } from "./hero-scan";

export function Hero() {
  return (
    <section id="topo" aria-labelledby="hero-titulo" className="pt-16">
      <div className="container-x grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <div className="lg:col-span-5">
          <Reveal>
            <h1
              id="hero-titulo"
              className="text-[clamp(2.75rem,5.5vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.04em] text-balance text-ink"
            >
              Do campo ao laudo.
            </h1>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-pretty text-body">
              Processamos FWD, perfilômetro, IRI/ATR, laudos e inspeção de pontes no padrão do seu contrato, com sigilo.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <WhatsappLogoIcon aria-hidden="true" size={18} weight="bold" />
                Solicitar proposta
              </a>
              <a href="#pipeline" className="link text-[0.9375rem] font-medium">
                Como funciona
              </a>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <HeroScan />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
