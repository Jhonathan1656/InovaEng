import type { ReactNode } from "react";
import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";
import { IriChart } from "./iri-chart";

const norma = (codigo: string) => (
  <span translate="no" className="font-mono text-[0.85em] text-body">
    {codigo}
  </span>
);

const grupos: { titulo: string; itens: ReactNode[] }[] = [
  {
    titulo: "Indicadores",
    itens: [
      "IRI e ATR por segmento",
      <>IGG, conforme {norma("DNIT 006/2003-PRO")}</>,
      <>LVC, conforme {norma("DNIT 008/2003-PRO")}</>,
      "Largura de faixa medida com IA",
    ],
  },
  {
    titulo: "Operação",
    itens: ["Defeitos com IA e revisão humana", "Mapas em KML e KMZ", "Relatórios do lote inteiro", "Banco central multiusuário"],
  },
];

export function Platform() {
  return (
    <section id="plataforma" aria-labelledby="plataforma-titulo" className="border-t border-hairline py-16 sm:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:order-2 lg:col-span-5">
          <SectionHeading
            id="plataforma-titulo"
            title="Software próprio, já em produção."
            description="A mesma plataforma que usamos todos os dias é a que vai para o seu escritório."
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {grupos.map((g, gi) => (
              <Reveal key={g.titulo} delay={gi * 0.06}>
                <h3 className="text-sm font-medium text-muted">{g.titulo}</h3>
                <ul className="mt-3 space-y-2.5">
                  {g.itens.map((item, i) => (
                    <li key={i} className="text-[0.95rem] text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-sm leading-relaxed text-muted">
            Aplicativo para Windows com banco PostgreSQL central, rodando na rede interna.
          </p>
        </div>
        <Reveal className="min-w-0 lg:order-1 lg:col-span-7">
          <IriChart />
        </Reveal>
      </div>
    </section>
  );
}
