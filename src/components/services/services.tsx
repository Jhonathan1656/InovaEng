import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";
import { BridgeViz, DeflectionViz, IriViz, LaudoViz, ProfileViz } from "./viz";

type Servico = {
  titulo: string;
  texto: string;
  viz: ReactNode;
  span: string;
};

// Seis células para seis conteúdos, larguras diferentes por linha (nada de três cards iguais lado a lado).
const servicos: Servico[] = [
  {
    titulo: "Deflectometria (FWD)",
    texto: "Bacias de deflexão tratadas, normalizadas e divididas em segmentos homogêneos para o projeto de restauração.",
    viz: <DeflectionViz />,
    span: "md:col-span-2 lg:col-span-7",
  },
  {
    titulo: "Perfilômetro a laser",
    texto: "Perfis longitudinais e transversais convertidos em indicadores por faixa e por trilha de roda.",
    viz: <ProfileViz />,
    span: "lg:col-span-5",
  },
  {
    titulo: "IRI e ATR",
    texto: "Irregularidade em m/km e afundamento de trilha em mm, por segmento, com os trechos críticos marcados.",
    viz: <IriViz />,
    span: "lg:col-span-4",
  },
  {
    titulo: "Inspeção de pontes",
    texto: "Registro fotográfico, mapa de anomalias e classificação das obras de arte especiais conforme norma.",
    viz: <BridgeViz />,
    span: "lg:col-span-5",
  },
  {
    titulo: "Laudos técnicos",
    texto: "Relatórios no modelo do seu contrato, com cada número rastreável até o arquivo de origem.",
    viz: <LaudoViz />,
    span: "lg:col-span-3",
  },
];

const extras = ["IGG", "LVC", "Defeitos com IA", "Largura de faixa", "Vídeo-registro", "Segmentos homogêneos", "Mapas KML/KMZ"];

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-titulo" className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading
          id="servicos-titulo"
          title="Do pavimento à ponte."
          description="Recebemos o arquivo bruto de cada equipamento e devolvemos indicadores, laudos e mapas prontos para decisão."
        />

        <ul className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-12">
          {servicos.map((s, i) => (
            <li key={s.titulo} className={cn("min-w-0", s.span)}>
              <Reveal delay={(i % 3) * 0.05} className="flex h-full flex-col rounded-xl bg-card p-6 sm:p-7">
                <div aria-hidden="true" className="relative h-44">
                  {s.viz}
                </div>
                <h3 className="mt-7 text-[1.3125rem] font-semibold tracking-[-0.01em] text-ink">{s.titulo}</h3>
                <p className="mt-2 max-w-prose text-[0.95rem] leading-relaxed text-body">{s.texto}</p>
              </Reveal>
            </li>
          ))}
          <li className="md:col-span-2 lg:col-span-12">
            <Reveal className="grid gap-5 rounded-xl bg-signal p-6 text-on-signal sm:p-7 lg:grid-cols-12 lg:items-center">
              <h3 className="text-[1.3125rem] font-bold tracking-[-0.01em] lg:col-span-3">Também processamos</h3>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-medium lg:col-span-9">
                {extras.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </Reveal>
          </li>
        </ul>
      </div>
    </section>
  );
}
