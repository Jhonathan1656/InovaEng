import { CheckIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const modelos = [
  {
    titulo: "Implantação no seu escritório",
    texto:
      "A plataforma e o pipeline rodam na rede interna da sua empresa. Instalamos, treinamos a equipe e acompanhamos a operação.",
    itens: ["Sem nuvem: o dado não sai do prédio", "Banco central para toda a equipe", "Treinamento e suporte", "Atualizações contínuas"],
  },
  {
    titulo: "Processamento sob demanda",
    texto: "Você envia os dados de um levantamento e recebe tudo processado e revisado, no seu padrão. Sem instalar nada.",
    itens: [
      "Prazo combinado por lote",
      "Transferência com acesso restrito",
      "Entrega no formato do contrato",
      "Bom para levantamentos avulsos",
    ],
  },
];

export function DeliveryModels() {
  return (
    <section id="modelos" aria-labelledby="modelos-titulo" className="border-t border-hairline py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading id="modelos-titulo" title="Dois jeitos de contratar." />

        <Reveal className="mt-12 grid gap-px overflow-hidden rounded-xl bg-hairline-strong p-px lg:grid-cols-2">
          {modelos.map((m, i) => (
            <article
              key={m.titulo}
              className={cn(
                "bg-canvas p-7 sm:p-10",
                // Só os cantos de fora acompanham o raio da moldura; os do meio ficam retos.
                i === 0
                  ? "rounded-tl-[11px] rounded-tr-[11px] lg:rounded-tr-none lg:rounded-bl-[11px]"
                  : "rounded-bl-[11px] rounded-br-[11px] lg:rounded-bl-none lg:rounded-tr-[11px]",
              )}
            >
              <h3 className="text-2xl font-semibold tracking-[-0.015em] text-ink">{m.titulo}</h3>
              <p className="mt-3 max-w-md text-[1.0625rem] leading-relaxed text-body">{m.texto}</p>
              <ul className="mt-7 space-y-3">
                {m.itens.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] text-ink">
                    <CheckIcon aria-hidden="true" size={18} weight="bold" className="mt-0.5 shrink-0 text-signal" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
