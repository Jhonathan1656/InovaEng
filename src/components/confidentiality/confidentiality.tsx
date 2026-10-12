import {
  ClockCounterClockwiseIcon,
  HardDrivesIcon,
  IdentificationBadgeIcon,
  SignatureIcon,
} from "@phosphor-icons/react/ssr";
import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";

const pilares = [
  {
    icon: HardDrivesIcon,
    titulo: "Na sua rede",
    texto: "Banco central na rede interna, sem nuvem e sem envio de dados para fora.",
  },
  {
    icon: IdentificationBadgeIcon,
    titulo: "Acesso por perfil",
    texto: "Cada pessoa entra com o próprio login e vê só o que a função permite.",
  },
  {
    icon: ClockCounterClockwiseIcon,
    titulo: "Trilha de auditoria",
    texto: "Edições, exclusões e revisões ficam registradas: quem, o quê e quando.",
  },
  {
    icon: SignatureIcon,
    titulo: "Sigilo em contrato",
    texto: "Confidencialidade formalizada do primeiro arquivo à entrega.",
  },
];

export function Confidentiality() {
  return (
    <section
      id="confidencialidade"
      aria-labelledby="confidencialidade-titulo"
      className="border-t border-hairline py-16 sm:py-24"
    >
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <SectionHeading
          id="confidencialidade-titulo"
          className="lg:col-span-5"
          title="Seus dados ficam sob o seu controle."
          description="O levantamento é um ativo da sua empresa. A plataforma roda na sua rede e registra cada acesso."
        />
        <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:col-span-7 lg:pt-3">
          {pilares.map((p, i) => {
            const Icon = p.icon;
            return (
              <li key={p.titulo}>
                <Reveal delay={i * 0.05}>
                  <Icon aria-hidden="true" size={26} className="text-signal" />
                  <h3 className="mt-4 text-lg font-semibold text-ink">{p.titulo}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-body">{p.texto}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
