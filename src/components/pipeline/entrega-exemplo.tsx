import { IRI_LIMIT, KM_START, fmt, formatKm, segmentos } from "@/lib/road";
import { cn } from "@/lib/cn";

const SEGS = segmentos();
const LINHAS_TABELA = 6;

// Janela de seis segmentos seguidos com dois ou três acima do limite: mostra os dois casos.
const inicio = (() => {
  for (let i = 0; i + LINHAS_TABELA <= SEGS.length; i++) {
    const acima = SEGS.slice(i, i + LINHAS_TABELA).filter((s) => s.iri > IRI_LIMIT).length;
    if (acima >= 2 && acima <= 3) return i;
  }
  return 0;
})();
const linhas = SEGS.slice(inicio, inicio + LINHAS_TABELA);
const estaca = (m: number) => formatKm(KM_START + m).replace("km ", "");

export function EntregaExemplo() {
  return (
    <figure className="rounded-xl bg-card p-6 sm:p-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-ink">Exemplo de entrega</h3>
        <p className="text-sm text-muted">Dados fictícios, só para mostrar o formato.</p>
      </figcaption>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-b border-hairline-strong text-muted">
              <th scope="col" className="py-3 pr-4 font-medium">
                Segmento (km)
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-medium">
                IRI (m/km)
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-medium">
                ATR médio (mm)
              </th>
              <th scope="col" className="py-3 pl-4 font-medium">
                Situação
              </th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((s) => {
              const acima = s.iri > IRI_LIMIT;
              return (
                <tr key={s.inicio}>
                  <td className="py-3 pr-4 font-mono text-body tabular-nums">
                    {estaca(s.inicio)} a {estaca(s.inicio + 100)}
                  </td>
                  <td className={cn("py-3 pr-4 text-right font-mono tabular-nums", acima ? "text-signal" : "text-ink")}>
                    {fmt(s.iri, 2)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-ink tabular-nums">{fmt(s.atrMedio, 1)}</td>
                  <td className={cn("py-3 pl-4", acima ? "text-signal" : "text-muted")}>
                    {acima ? "Acima do limite" : "Dentro do limite"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        Limite de IRI usado no exemplo: {fmt(IRI_LIMIT, 1)} m/km. O trecho completo tem {SEGS.length} segmentos de 100 m, e a
        entrega sai em PDF, em planilha no seu modelo e em KMZ.
      </p>
    </figure>
  );
}
