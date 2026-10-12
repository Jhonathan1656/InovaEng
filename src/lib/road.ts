/**
 * Modelo sintético de pista usado nas animações do site (hero, gráficos, HUD).
 * Não é dado real: são senoides e gaussianas combinadas para parecer um levantamento
 * plausível — trilhas de roda, irregularidade e quilometragem coerentes entre si.
 */

export const LANE_HALF = 1.8; // meia largura da faixa (m)
export const WHEEL_X = 0.9; // eixo de cada trilha de roda a partir do centro da faixa (m)
export const SPEED = 9; // velocidade de deslocamento na animação (m/s)
export const KM_START = 127_400; // marco inicial do trecho fictício (m)
export const TRECHO_LENGTH = 3_600; // km 127+400 → km 131+000
export const IRI_LIMIT = 2.7; // limite usado para destacar segmentos (m/km)

const gauss = (d: number, sigma: number) => Math.exp(-(d * d) / (2 * sigma * sigma));

/** Profundidade da trilha de roda (mm) ao longo da pista. side −1 = interna, 1 = externa. */
export function rutDepth(s: number, side: -1 | 1): number {
  const phase = side === 1 ? 0 : 1.7;
  const v =
    5.4 +
    2.4 * Math.sin(s * 0.021 + phase) +
    1.3 * Math.sin(s * 0.057 + 1.3 + phase) +
    0.7 * Math.sin(s * 0.13 + 0.4);
  return Math.max(0.8, v);
}

/** Cota da superfície (mm) na posição transversal x (m) e longitudinal s (m). */
export function heightAt(x: number, s: number): number {
  const rutI = rutDepth(s, -1);
  const rutE = rutDepth(s, 1);
  const ruts = -rutI * gauss(x + WHEEL_X, 0.21) - rutE * gauss(x - WHEEL_X, 0.21);
  // Material empurrado para as bordas da trilha (solevamento).
  const heave =
    0.3 * rutI * (gauss(x + WHEEL_X - 0.5, 0.14) + gauss(x + WHEEL_X + 0.5, 0.14)) +
    0.3 * rutE * (gauss(x - WHEEL_X - 0.5, 0.14) + gauss(x - WHEEL_X + 0.5, 0.14));
  const camber = -1.9 * x * x;
  const rough =
    1.3 * Math.sin(s * 0.93 + x * 0.6) +
    0.8 * Math.sin(s * 2.17 + 1.7 - x * 0.9) +
    0.45 * Math.sin(s * 4.6 + x * 2.3);
  return ruts + heave + camber + rough;
}

/** Desvio em relação ao abaulamento (mm): o que interessa para colorir trilha e solevamento. */
export function deviationAt(x: number, s: number): number {
  return heightAt(x, s) + 1.9 * x * x;
}

/** Flecha sob treliça de 1,20 m centrada na trilha (mm), como na medição de ATR. */
export function rutUnderStraightedge(s: number, center: number): number {
  const half = 0.6;
  const a = center - half;
  const hA = heightAt(a, s);
  const hB = heightAt(center + half, s);
  let max = 0;
  for (let i = 1; i < 24; i++) {
    const x = a + (2 * half * i) / 24;
    const line = hA + ((hB - hA) * (x - a)) / (2 * half);
    max = Math.max(max, line - heightAt(x, s));
  }
  return max;
}

/** IRI (m/km) ao longo da pista. */
export function iriAt(s: number): number {
  const v =
    2.25 +
    0.85 * Math.sin(s * 0.0063 + 0.5) +
    0.45 * Math.sin(s * 0.017 + 2.1) +
    0.22 * Math.sin(s * 0.051 + 0.3);
  return Math.min(4.6, Math.max(1.05, v));
}

export type Segmento = { inicio: number; iri: number; atrMedio: number; atrMax: number };

/** Segmentos de 100 m do trecho fictício, com IRI médio e ATR médio/máximo (pior trilha a cada 10 m). */
export function segmentos(length = TRECHO_LENGTH, seg = 100): Segmento[] {
  const out: Segmento[] = [];
  for (let a = 0; a < length; a += seg) {
    let somaIri = 0;
    let somaAtr = 0;
    let n = 0;
    let atrMax = 0;
    for (let s = a; s < a + seg; s += 10) {
      const atr = Math.max(rutUnderStraightedge(s, -WHEEL_X), rutUnderStraightedge(s, WHEEL_X));
      somaIri += iriAt(s);
      somaAtr += atr;
      atrMax = Math.max(atrMax, atr);
      n++;
    }
    out.push({ inicio: a, iri: somaIri / n, atrMedio: somaAtr / n, atrMax });
  }
  return out;
}

/** "km 127+412" */
export function formatKm(meters: number): string {
  const m = Math.max(0, Math.floor(meters));
  return `km ${Math.floor(m / 1000)}+${String(m % 1000).padStart(3, "0")}`;
}

const formatadores = new Map<number, Intl.NumberFormat>();

/** Número no formato brasileiro, com casas decimais fixas. */
export function fmt(n: number, digits = 1): string {
  let f = formatadores.get(digits);
  if (!f) {
    f = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
    formatadores.set(digits, f);
  }
  return f.format(n);
}
