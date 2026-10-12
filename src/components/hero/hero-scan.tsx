"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { LANE_HALF, SPEED, heightAt } from "@/lib/road";

// Malha da pista, em metros.
const XMAX = 2.7; // faixa + acostamento para cada lado
const NX = 41; // pontos por linha transversal
const Z0 = 1.6; // primeira linha à frente da câmera
const ZMAX = 66; // última linha, já no horizonte
const DZ = 0.3; // distância entre linhas transversais (de longe, desenha 1 a cada 2 ou 4)
const ZL = 3.6; // barra de lasers à frente da câmera
const BAR_H = 0.5; // altura da barra: dá a altura da "cortina" de luz
const EXAG = 0.018; // exagero vertical: metros de tela por mm de pista
const NL = 61; // pontos do perfil sob o laser
const SENSORS = [-1.65, -1.25, -0.9, -0.55, -0.25, 0, 0.25, 0.55, 0.9, 1.25, 1.65];
const SIGNAL = "#f2c230";

// Cinza por desvio (mm): quanto mais funda a trilha, mais clara; fora da faixa, quase apagado.
const PALETTE = ["#f2f2f2", "#c4c4c4", "#8f8f8f", "#585858", "#6c6c6c", "#808080", "#2c2c2c"];

function bucket(dev: number, x: number): number {
  if (Math.abs(x) > LANE_HALF + 0.08) return 6;
  if (dev < -6) return 0;
  if (dev < -3) return 1;
  if (dev < -1.2) return 2;
  if (dev <= 1.6) return 3;
  if (dev <= 3) return 4;
  return 5;
}

type Layout = { hy: number; vpX: number; f: number; hc: number };

function computeLayout(w: number, h: number): Layout {
  const hy = h * 0.22;
  const vpX = w * 0.5;
  const span = h - hy;
  const halfLanePx = w * 0.4;
  const hc = Math.min(4.6, Math.max(1.4, (LANE_HALF * span) / halfLanePx));
  const f = ((span + 14) * Z0) / hc;
  return { hy, vpX, f, hc };
}

export function HeroScan() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const pausadoRef = useRef(false);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 1;
    let h = 1;
    let L = computeLayout(w, h);
    let s = 0;
    let raf = 0;
    let last = 0;
    let running = false;
    let visible = true;
    const rowX = new Float32Array(NX);
    const rowY = new Float32Array(NX);
    const rowB = new Uint8Array(NX);
    const lx = new Float32Array(NL);
    const ly = new Float32Array(NL);

    const draw = () => {
      const { hy, vpX, f, hc } = L;
      const bend = 0.0016 * Math.sin(s * 0.0045);
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // 1) Cortina de luz da barra de lasers, esmaecida nas pontas. Vem primeiro porque o
      //    destination-in afeta tudo o que já está no canvas.
      const sl = s + ZL;
      const offL = bend * ZL * ZL;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let i = 0; i < NL; i++) {
        const x = -XMAX + (2 * XMAX * i) / (NL - 1);
        lx[i] = vpX + (f * (x + offL)) / ZL;
        ly[i] = hy + (f * (hc - heightAt(x, sl) * EXAG)) / ZL;
        minY = Math.min(minY, ly[i]);
        maxY = Math.max(maxY, ly[i]);
      }
      const curtain = (f * BAR_H) / ZL;
      const sheet = ctx.createLinearGradient(0, minY - curtain, 0, maxY);
      sheet.addColorStop(0, "rgba(242,194,48,0)");
      sheet.addColorStop(1, "rgba(242,194,48,0.16)");
      ctx.fillStyle = sheet;
      ctx.beginPath();
      ctx.moveTo(lx[0], ly[0]);
      for (let i = 1; i < NL; i++) ctx.lineTo(lx[i], ly[i]);
      for (let i = NL - 1; i >= 0; i--) ctx.lineTo(lx[i], ly[i] - curtain);
      ctx.closePath();
      ctx.fill();
      const fade = ctx.createLinearGradient(lx[0], 0, lx[NL - 1], 0);
      fade.addColorStop(0, "rgba(0,0,0,0)");
      fade.addColorStop(0.22, "rgba(0,0,0,1)");
      fade.addColorStop(0.78, "rgba(0,0,0,1)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // 2) Horizonte.
      ctx.fillStyle = "#262626";
      ctx.fillRect(0, Math.round(hy), w, 1);

      // 3) Malha: linhas transversais (de trás para a frente) com um ponto por amostra.
      //    Perto da câmera todas as linhas; ao longe, uma a cada 2 ou 4 (ancoradas na pista).
      const first = Math.ceil((s + Z0) / DZ);
      const lastRow = Math.floor((s + ZMAX) / DZ);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#4a4a4a";
      for (let r = lastRow; r >= first; r--) {
        const sw = r * DZ;
        const z = sw - s;
        if ((z > 44 && r % 4 !== 0) || (z > 22 && r % 2 !== 0)) continue;
        const a = Math.pow(1 - (z - Z0) / (ZMAX - Z0), 1.5);
        const off = bend * z * z;
        for (let i = 0; i < NX; i++) {
          const x = -XMAX + (2 * XMAX * i) / (NX - 1);
          const hm = heightAt(x, sw);
          rowX[i] = vpX + (f * (x + off)) / z;
          rowY[i] = hy + (f * (hc - hm * EXAG)) / z;
          rowB[i] = bucket(hm + 1.9 * x * x, x);
        }
        ctx.globalAlpha = 0.06 + 0.4 * a;
        ctx.beginPath();
        ctx.moveTo(rowX[0], rowY[0]);
        for (let i = 1; i < NX; i++) ctx.lineTo(rowX[i], rowY[i]);
        ctx.stroke();

        const size = 0.7 + 2 * a;
        const half = size / 2;
        ctx.globalAlpha = 0.12 + 0.88 * a;
        for (let i = 0; i < NX; i++) {
          ctx.fillStyle = PALETTE[rowB[i]];
          ctx.fillRect(rowX[i] - half, rowY[i] - half, size, size);
        }
      }

      // 4) Pintura de bordo: tracejada à esquerda (divisão de faixa), contínua à direita.
      const edge = (xe: number, dashed: boolean) => {
        let x0 = 0;
        let y0 = 0;
        let on0 = false;
        let has = false;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#d4d4d4";
        for (let r = lastRow; r >= first; r--) {
          const sw = r * DZ;
          const z = sw - s;
          const a = Math.pow(1 - (z - Z0) / (ZMAX - Z0), 1.5);
          const off = bend * z * z;
          const x1 = vpX + (f * (xe + off)) / z;
          const y1 = hy + (f * (hc - heightAt(xe, sw) * EXAG)) / z;
          const on = !dashed || ((sw % 12) + 12) % 12 < 4.5;
          if (has && on && on0) {
            ctx.globalAlpha = 0.08 + 0.5 * a;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
          }
          x0 = x1;
          y0 = y1;
          on0 = on;
          has = true;
        }
      };
      edge(-LANE_HALF, true);
      edge(LANE_HALF, false);

      // 5) O laser: perfil transversal em amarelo e os pontos de leitura de cada sensor.
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(lx[0], ly[0]);
      for (let i = 1; i < NL; i++) ctx.lineTo(lx[i], ly[i]);
      ctx.strokeStyle = SIGNAL;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = SIGNAL;
      for (const x of SENSORS) {
        const sx = vpX + (f * (x + offL)) / ZL;
        const sy = hy + (f * (hc - heightAt(x, sl) * EXAG)) / ZL;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      s += dt * SPEED;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce || !visible || document.hidden || pausadoRef.current) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    controlsRef.current = { start, stop };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      L = computeLayout(w, h);
      draw();
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    ro.observe(wrap);
    io.observe(wrap);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    start();

    return () => {
      stop();
      controlsRef.current = null;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    pausadoRef.current = pausado;
    if (pausado) controlsRef.current?.stop();
    else controlsRef.current?.start();
  }, [pausado]);

  return (
    <figure>
      <div ref={wrapRef} className="relative h-[340px] overflow-hidden rounded-xl bg-surface sm:h-[440px] lg:h-[520px]">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-4 text-sm leading-relaxed text-muted">
        <span>
          Ilustração: a barra de lasers do perfilômetro lê o perfil transversal da faixa enquanto o veículo anda.
        </span>
        <button
          type="button"
          onClick={() => setPausado((p) => !p)}
          className="-mr-2 inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-medium text-body transition-colors hover:text-ink motion-reduce:hidden"
        >
          {pausado ? <PlayIcon aria-hidden="true" size={16} /> : <PauseIcon aria-hidden="true" size={16} />}
          {pausado ? "Retomar animação" : "Pausar animação"}
        </button>
      </figcaption>
    </figure>
  );
}
