import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";
import { EntregaExemplo } from "./entrega-exemplo";

const etapas = [
  {
    titulo: "Recebemos",
    texto: "O dado bruto de cada equipamento, enviado por você ou lido direto do seu servidor.",
  },
  {
    titulo: "Validamos",
    texto: "GPS, odômetro, calibração e lacunas, antes de qualquer cálculo.",
  },
  {
    titulo: "Processamos",
    texto: "Cálculo automatizado e revisão de engenharia. A IA sugere, o engenheiro decide.",
  },
  {
    titulo: "Entregamos",
    texto: "Laudo, planilhas e mapas no modelo do contrato, com cada número rastreável.",
  },
];

export function Pipeline() {
  return (
    <section id="pipeline" aria-labelledby="pipeline-titulo" className="border-t border-hairline py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading
          id="pipeline-titulo"
          title="Um pipeline no padrão da sua empresa."
          description="Cada cliente tem o próprio modelo de planilha e de laudo. O pipeline é montado em cima dele."
        />

        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {etapas.map((e, i) => (
            <li key={e.titulo}>
              <Reveal delay={i * 0.05} className="relative border-t border-hairline-strong pt-5">
                <span aria-hidden="true" className="absolute -top-px left-0 h-0.5 w-10 bg-signal" />
                <h3 className="text-lg font-semibold text-ink">{e.titulo}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-body">{e.texto}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-14 lg:mt-20">
          <EntregaExemplo />
        </Reveal>
      </div>
    </section>
  );
}
