"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { IRI_LIMIT, fmt, iriAt } from "@/lib/road";
import { clamp01, easeInOut, easeOutBack, usePlayOnce } from "../use-play-once";

// Paleta do DESIGN.md: cinzas neutros e o amarelo só no que importa em cada quadro.
const INK = "#f2f2f2";
const BODY = "#c7c7c7";
const MUTED = "#8b8b8b";
const SUBTLE = "#5e5e5e";
const LINE = "#333333";
const SIGNAL = "#f2c230";

const legenda = "text-xs text-muted";

/* ---------------------------------------------------------------- FWD ---- */

const SURFACE = 66;
const PLATE_X = 46;
const D0 = 48.6; // ×0,01 mm
const PX_PER_UNIT = 0.8;
const GEOFONES = [0, 20, 30, 45, 60, 90, 120, 150, 180]; // cm a partir do centro da placa
const bacia = (cm: number) => D0 * (0.09 + 0.91 * Math.exp(-cm / 55));

// Impacto em 0,15; a bacia se forma até 0,23 e segura.
function bowlK(p: number) {
  if (p < 0.15) return 0;
  if (p < 0.23) return easeOutBack((p - 0.15) / 0.08);
  return 1;
}

function weightLift(p: number) {
  if (p < 0.06) return 30;
  if (p < 0.15) return 30 * (1 - Math.pow((p - 0.06) / 0.09, 2));
  return 0;
}

const surfaceY = (cm: number, k: number) => SURFACE + k * PX_PER_UNIT * bacia(cm);

// A escala horizontal acompanha a largura real do cartão: os 180 cm vão até a borda direita.
const pxPorCm = (largura: number) => (largura - PLATE_X - 28) / 180;

function bowlPath(k: number, largura: number, closed: boolean) {
  const escala = pxPorCm(largura);
  const fim = largura - 8;
  let d = "";
  for (let x = 8; x <= fim; x += 4) {
    const cm = Math.abs(x - PLATE_X) / escala;
    d += `${x === 8 ? "M" : "L"}${x} ${surfaceY(cm, k).toFixed(2)}`;
  }
  return closed ? `${d}L${fim} 160L8 160Z` : d;
}

/** Largura do viewBox (altura fixa) que preenche a caixa sem distorcer. */
function useLarguraViewBox(ref: RefObject<HTMLDivElement | null>, altura: number, padrao: number) {
  const [largura, setLargura] = useState(padrao);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setLargura(Math.max(300, Math.round((width / height) * altura)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, altura]);
  return largura;
}

function Geofone({ progress, cm, x }: { progress: MotionValue<number>; cm: number; x: number }) {
  const y = useTransform(progress, (p) => surfaceY(cm, bowlK(p)));
  return (
    <motion.g style={{ y }}>
      <path d={`M${x - 3.5} -7L${x + 3.5} -7L${x} 0Z`} fill={BODY} />
    </motion.g>
  );
}

export function DeflectionViz() {
  const { ref, progress, replay } = usePlayOnce<SVGSVGElement>(3.6, 0.42);
  const caixaRef = useRef<HTMLDivElement>(null);
  const largura = useLarguraViewBox(caixaRef, 160, 360);
  const geoX = (cm: number) => PLATE_X + cm * pxPorCm(largura);
  const line = useTransform(progress, (p) => bowlPath(bowlK(p), largura, false));
  const area = useTransform(progress, (p) => bowlPath(bowlK(p), largura, true));
  const plateY = useTransform(progress, (p) => bowlK(p) * PX_PER_UNIT * D0);
  const weightY = useTransform(progress, (p) => bowlK(p) * PX_PER_UNIT * D0 - weightLift(p));
  const d0 = useTransform(progress, (p) => fmt(D0 * Math.max(0, bowlK(p)), 1));

  return (
    <div ref={caixaRef} onPointerEnter={replay} className="absolute inset-0">
      <svg ref={ref} viewBox={`0 0 ${largura} 160`} className="size-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="fwd-area" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor={INK} stopOpacity="0.1" />
            <stop offset="1" stopColor={INK} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="8" x2={largura - 8} y1={SURFACE} y2={SURFACE} stroke={SUBTLE} strokeDasharray="2 4" />
        <motion.path d={area} fill="url(#fwd-area)" />
        <motion.path d={line} fill="none" stroke={INK} strokeWidth="1.6" />
        {GEOFONES.map((cm) => (
          <Geofone key={cm} progress={progress} cm={cm} x={geoX(cm)} />
        ))}
        <line x1={PLATE_X} x2={PLATE_X} y1="28" y2="44" stroke={SUBTLE} />
        <motion.g style={{ y: plateY }}>
          <rect x={PLATE_X - 11} y={SURFACE - 6} width="22" height="6" rx="1.5" fill={BODY} />
        </motion.g>
        <motion.g style={{ y: weightY }}>
          <rect x={PLATE_X - 13} y={SURFACE - 22} width="26" height="14" rx="2" fill={SIGNAL} />
        </motion.g>
        {[0, 30, 60, 90, 120, 150, 180].map((cm) => (
          <text key={cm} x={geoX(cm)} y="152" textAnchor="middle" fill={SUBTLE} className="font-mono" style={{ fontSize: 8.5 }}>
            {cm}
          </text>
        ))}
        <text x={largura - 8} y="140" textAnchor="end" fill={SUBTLE} style={{ fontSize: 8.5 }}>
          distância da carga (cm)
        </text>
      </svg>
      <p className={`absolute left-0 top-0 ${legenda}`}>Bacia de deflexão</p>
      <p className="absolute right-0 top-0 text-xs text-muted">
        D0{" "}
        <motion.span className="font-mono text-sm font-semibold text-ink tabular-nums">{d0}</motion.span> ×0,01 mm
      </p>
    </div>
  );
}

/* -------------------------------------------------------- Perfilômetro ---- */

const profileY = (x: number) => 104 + 11 * Math.sin(x * 0.045) + 6 * Math.sin(x * 0.13 + 1) + 2.6 * Math.sin(x * 0.37 + 2);
const PROFILE_D = (() => {
  let d = "";
  for (let x = 14; x <= 346; x += 2) d += `${x === 14 ? "M" : "L"}${x} ${profileY(x).toFixed(2)}`;
  return d;
})();

const drawn = (p: number) => clamp01(p / 0.78);

export function ProfileViz() {
  const { ref, progress, replay } = usePlayOnce<SVGSVGElement>(4.2, 0.8);
  const pathLength = useTransform(progress, drawn);
  const carX = useTransform(progress, (p) => 14 + drawn(p) * 332);
  const hitY = useTransform(carX, profileY);

  return (
    <div onPointerEnter={replay} className="absolute inset-0">
      <svg ref={ref} viewBox="0 0 360 160" className="size-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="perfil-beam" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="40" y2="128">
            <stop stopColor={SIGNAL} stopOpacity="0.1" />
            <stop offset="1" stopColor={SIGNAL} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d={PROFILE_D} fill="none" stroke={LINE} strokeWidth="1.2" />
        <motion.path d={PROFILE_D} fill="none" stroke={INK} strokeWidth="1.8" style={{ pathLength }} />
        <motion.line x1={carX} x2={carX} y1="40" y2={hitY} stroke="url(#perfil-beam)" strokeWidth="1.5" />
        <motion.circle cx={carX} cy={hitY} r="3" fill={SIGNAL} />
        <motion.g style={{ x: carX }}>
          <rect x="-15" y="24" width="30" height="13" rx="3" fill={BODY} />
          <rect x="-9" y="27" width="10" height="5" rx="1" fill="#0b0b0b" fillOpacity="0.7" />
          <circle cx="-9" cy="38" r="2.6" fill="#0b0b0b" stroke={BODY} strokeWidth="1" />
          <circle cx="9" cy="38" r="2.6" fill="#0b0b0b" stroke={BODY} strokeWidth="1" />
        </motion.g>
      </svg>
      <p className={`absolute left-0 top-0 ${legenda}`}>Perfil longitudinal</p>
      <p className={`absolute right-0 top-0 ${legenda}`}>trilha externa</p>
    </div>
  );
}

/* ------------------------------------------------------------- IRI/ATR ---- */

const BARS = 18;
const barY = (v: number) => 140 - (v / 5) * 118;
const VALORES = Array.from({ length: BARS }, (_, i) => iriAt(i * 100 + 50));
const MEDIA = VALORES.reduce((a, b) => a + b, 0) / BARS;

export function IriViz() {
  const slot = 328 / BARS;
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 360 160" className="size-full" preserveAspectRatio="xMidYMid meet">
        <line x1="16" x2="344" y1="140.5" y2="140.5" stroke={LINE} />
        {VALORES.map((v, i) => (
          <motion.rect
            key={i}
            x={16 + i * slot + (slot - 11) / 2}
            y={barY(v)}
            width="11"
            height={140 - barY(v)}
            rx="2"
            fill={v > IRI_LIMIT ? SIGNAL : "#4a4a4a"}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
          />
        ))}
        <line x1="16" x2="344" y1={barY(IRI_LIMIT)} y2={barY(IRI_LIMIT)} stroke={MUTED} strokeDasharray="4 4" />
        <text x="344" y={barY(IRI_LIMIT) - 6} textAnchor="end" fill={MUTED} className="font-mono" style={{ fontSize: 8.5 }}>
          limite {fmt(IRI_LIMIT, 1)}
        </text>
      </svg>
      <p className={`absolute left-0 top-0 ${legenda}`}>IRI por segmento de 100 m</p>
      <p className="absolute right-0 top-0 text-xs text-muted">
        média <span className="font-mono text-sm font-semibold text-ink tabular-nums">{fmt(MEDIA, 2)}</span>
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- Laudo ---- */

const FONTES = [
  { y: 34, label: "FWD" },
  { y: 78, label: "PERFIL" },
  { y: 122, label: "FOTOS" },
];
const LINHAS = [
  { y: 52, w: 104, at: 0.1 },
  { y: 62, w: 96, at: 0.18 },
  { y: 72, w: 82, at: 0.26 },
  { y: 82, w: 100, at: 0.34 },
];

function LinhaLaudo({ progress, y, w, at }: { progress: MotionValue<number>; y: number; w: number; at: number }) {
  const width = useTransform(progress, (p) => w * easeInOut(clamp01((p - at) / 0.1)));
  return <motion.rect x="160" y={y} height="4" rx="2" width={width} fill="#4a4a4a" />;
}

function BarraLaudo({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const alvo = [14, 22, 17, 26, 12, 20][i];
  const height = useTransform(progress, (p) => alvo * easeInOut(clamp01((p - 0.42 - i * 0.03) / 0.1)));
  const y = useTransform(height, (h) => 124 - h);
  return <motion.rect x={162 + i * 14} width="9" rx="1.5" y={y} height={height} fill={MUTED} />;
}

export function LaudoViz() {
  const { ref, progress, replay } = usePlayOnce<SVGSVGElement>(4.4, 0.85);
  const stamp = useTransform(progress, (p) => easeInOut(clamp01((p - 0.66) / 0.12)));

  return (
    <div onPointerEnter={replay} className="absolute inset-0">
      <svg ref={ref} viewBox="0 0 360 160" className="size-full" preserveAspectRatio="xMidYMid meet">
        {FONTES.map((f) => (
          <g key={f.label}>
            <rect x="18" y={f.y - 11} width="76" height="22" rx="5" fill="none" stroke={LINE} />
            <text x="56" y={f.y + 3} textAnchor="middle" fill={MUTED} className="font-mono" style={{ fontSize: 8.5 }}>
              {f.label}
            </text>
            <path d={`M94 ${f.y}C122 ${f.y} 124 80 150 80`} fill="none" stroke={LINE} />
          </g>
        ))}
        <rect x="150" y="14" width="130" height="134" rx="6" fill="#1f1f1f" stroke={LINE} />
        <rect x="160" y="25" width="30" height="6" rx="2" fill={SIGNAL} />
        <rect x="196" y="25" width="56" height="6" rx="2" fill="#3a3a3a" />
        <line x1="160" x2="270" y1="40" y2="40" stroke={LINE} />
        {LINHAS.map((l) => (
          <LinhaLaudo key={l.y} progress={progress} {...l} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <BarraLaudo key={i} progress={progress} i={i} />
        ))}
        <line x1="160" x2="246" y1="124.5" y2="124.5" stroke={LINE} />
        <line x1="160" x2="214" y1="138" y2="138" stroke={SUBTLE} strokeDasharray="2 2" />
        <motion.g style={{ opacity: stamp }}>
          <motion.circle cx="262" cy="126" r="17" fill="#0b0b0b" stroke={SIGNAL} strokeWidth="1.6" style={{ pathLength: stamp }} />
          <motion.path
            d="M254 126l5.5 5.5L271 120"
            fill="none"
            stroke={SIGNAL}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: stamp }}
          />
        </motion.g>
      </svg>
      <p className={`absolute right-0 top-0 ${legenda}`}>laudo.pdf</p>
    </div>
  );
}

/* --------------------------------------------------------------- Ponte ---- */

const ANOMALIAS = [
  { x: 64, y: 62 },
  { x: 142, y: 69 },
  { x: 180, y: 102 },
  { x: 222, y: 62 },
  { x: 256, y: 118 },
  { x: 302, y: 69 },
];
const scanX = (p: number) => 18 + p * 324;

function Anomalia({ progress, x, y }: { progress: MotionValue<number>; x: number; y: number }) {
  const lit = useTransform(progress, (p) => (scanX(p) >= x ? 1 : 0));
  const ring = useTransform(progress, (p) => {
    const t = (scanX(p) - x) / 70;
    return t < 0 || t > 1 ? 0 : 1 - t;
  });
  const r = useTransform(ring, (o) => 4 + (1 - o) * 10);
  return (
    <g>
      <circle cx={x} cy={y} r="2.5" fill={SUBTLE} />
      <motion.circle cx={x} cy={y} r="3.6" fill={SIGNAL} style={{ opacity: lit }} />
      <motion.circle cx={x} cy={y} r={r} fill="none" stroke={SIGNAL} strokeWidth="1.2" style={{ opacity: ring }} />
    </g>
  );
}

export function BridgeViz() {
  const { ref, progress, replay } = usePlayOnce<SVGSVGElement>(4, 1);
  const x = useTransform(progress, scanX);
  const scanOpacity = useTransform(progress, [0, 0.92, 1], [1, 1, 0]);
  const contagem = useTransform(progress, (p) => `${ANOMALIAS.filter((a) => scanX(p) >= a.x).length} de ${ANOMALIAS.length}`);

  return (
    <div onPointerEnter={replay} className="absolute inset-0">
      <svg ref={ref} viewBox="0 0 360 160" className="size-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="ponte-scan" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="30" y2="150">
            <stop stopColor={BODY} stopOpacity="0" />
            <stop offset="0.5" stopColor={BODY} stopOpacity="0.8" />
            <stop offset="1" stopColor={BODY} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[138, 146, 154].map((y, i) => (
          <path
            key={y}
            d={`M0 ${y}q15 -3 30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0`}
            fill="none"
            stroke={SUBTLE}
            strokeOpacity={0.7 - i * 0.2}
          />
        ))}
        <path d="M6 70h20l12 64H6z" fill="#1f1f1f" stroke="#4a4a4a" />
        <path d="M354 70h-20l-12 64h32z" fill="#1f1f1f" stroke="#4a4a4a" />
        {[104, 180, 256].map((px) => (
          <g key={px}>
            <rect x={px - 11} y="71" width="22" height="5" fill="#262626" stroke="#4a4a4a" />
            <rect x={px - 5} y="76" width="10" height="60" fill="#1f1f1f" stroke="#4a4a4a" />
          </g>
        ))}
        <rect x="22" y="58" width="316" height="9" fill="#262626" stroke="#5a5a5a" />
        <rect x="22" y="67" width="316" height="4" fill="#1f1f1f" stroke="#3a3a3a" />
        <line x1="22" x2="338" y1="49" y2="49" stroke="#4a4a4a" />
        {Array.from({ length: 21 }, (_, i) => (
          <line key={i} x1={22 + i * 15.8} x2={22 + i * 15.8} y1="49" y2="58" stroke="#3a3a3a" />
        ))}
        {ANOMALIAS.map((a) => (
          <Anomalia key={a.x} progress={progress} {...a} />
        ))}
        <motion.line x1={x} x2={x} y1="30" y2="150" stroke="url(#ponte-scan)" strokeWidth="1.5" style={{ opacity: scanOpacity }} />
      </svg>
      <p className={`absolute left-0 top-0 ${legenda}`}>Inspeção de OAE</p>
      <p className="absolute right-0 top-0 text-xs text-muted">
        anomalias <motion.span className="font-mono text-sm font-semibold text-ink tabular-nums">{contagem}</motion.span>
      </p>
    </div>
  );
}
