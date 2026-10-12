"use client";

import { motion, useReducedMotion } from "motion/react";
import { IRI_LIMIT, KM_START, TRECHO_LENGTH, fmt, formatKm, iriAt, segmentos } from "@/lib/road";

const cx = (s: number) => (s / TRECHO_LENGTH) * 600;
const cy = (iri: number) => 190 - ((iri - 0.5) / 4.5) * 180;
const SERIE = Array.from({ length: 181 }, (_, i) => ({ s: i * 20, iri: iriAt(i * 20) }));
const LINHA = SERIE.map((p, i) => `${i ? "L" : "M"}${cx(p.s).toFixed(1)} ${cy(p.iri).toFixed(1)}`).join("");
const ACIMA = `M0 ${cy(IRI_LIMIT)}${SERIE.map((p) => `L${cx(p.s).toFixed(1)} ${Math.min(cy(p.iri), cy(IRI_LIMIT)).toFixed(1)}`).join("")}L600 ${cy(IRI_LIMIT)}Z`;
const SEGS = segmentos();
const ATR_TOPO = Math.max(...SEGS.map((s) => s.atrMedio));
const ATR_DESTAQUE = 9; // mm: só para destacar no exemplo
const IRI_MIN = Math.min(...SERIE.map((p) => p.iri));
const IRI_MAX = Math.max(...SERIE.map((p) => p.iri));
const ACIMA_DO_LIMITE = SEGS.filter((s) => s.iri > IRI_LIMIT).length;

export function IriChart() {
  // Largura não é transform: o MotionConfig não desliga sozinho, então zeramos a duração.
  const reduce = useReducedMotion();
  return (
    <figure className="rounded-xl bg-card p-6 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="text-base font-semibold text-ink">IRI ao longo de {fmt(TRECHO_LENGTH / 1000, 1)} km</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="w-5 border-t border-dashed border-muted" />
            limite de {fmt(IRI_LIMIT, 1)} m/km
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-sm bg-signal/60" />
            acima do limite
          </li>
        </ul>
      </div>

      <div className="mt-5 h-56 sm:h-64">
        <svg
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
          className="size-full"
          role="img"
          aria-label={`Gráfico de exemplo: o IRI varia entre ${fmt(IRI_MIN, 1)} e ${fmt(IRI_MAX, 1)} m/km ao longo do trecho, com ${ACIMA_DO_LIMITE} de ${SEGS.length} segmentos acima do limite.`}
        >
          {/* Revela da esquerda para a direita com um recorte. pathLength não serve aqui: com
              non-scaling-stroke num SVG esticado, o tracejado é medido na tela e a linha para antes do fim. */}
          <defs>
            <clipPath id="iri-revelar">
              <motion.rect
                x="0"
                y="0"
                height="200"
                initial={{ width: 0 }}
                whileInView={{ width: 600 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: reduce ? 0 : 1.6, ease: "easeInOut" }}
              />
            </clipPath>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2="600" y1={200 * f} y2={200 * f} stroke="#262626" vectorEffect="non-scaling-stroke" />
          ))}
          <line
            x1="0"
            x2="600"
            y1={cy(IRI_LIMIT)}
            y2={cy(IRI_LIMIT)}
            stroke="#8b8b8b"
            strokeDasharray="5 5"
            vectorEffect="non-scaling-stroke"
          />
          <g clipPath="url(#iri-revelar)">
            <path d={ACIMA} fill="#f2c230" fillOpacity="0.3" />
            <path d={LINHA} fill="none" stroke="#f2f2f2" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[0.7rem] text-muted tabular-nums">
        <span>{formatKm(KM_START)}</span>
        <span className="hidden sm:inline">{formatKm(KM_START + TRECHO_LENGTH / 2)}</span>
        <span>{formatKm(KM_START + TRECHO_LENGTH)}</span>
      </div>

      <p className="mt-7 text-xs text-muted">ATR médio por segmento de 100 m</p>
      <div aria-hidden="true" className="mt-2 flex h-10 items-end gap-[2px]">
        {SEGS.map((s) => (
          <span
            key={s.inicio}
            style={{ height: `${(s.atrMedio / ATR_TOPO) * 100}%` }}
            className={s.atrMedio > ATR_DESTAQUE ? "flex-1 rounded-[1px] bg-signal" : "flex-1 rounded-[1px] bg-[#4a4a4a]"}
          />
        ))}
      </div>

      <figcaption className="mt-6 text-xs text-muted">Dados fictícios. Exemplo de saída da plataforma.</figcaption>
    </figure>
  );
}
