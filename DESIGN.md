---
version: 1
name: INOVA
description: Site da INOVA, engenharia de dados para infraestrutura. Canvas quase preto, um único amarelo de sinalização como acento, tipografia Geist em peso 700 com tracking negativo, superfícies chapadas sem sombra e sem brilho.
source: Adaptado do DESIGN.md da ClickHouse em VoltAgent/awesome-design-md (MIT). Mantida a estrutura (preto + um amarelo, cards chapados, faixa amarela de CTA); trocados a cor, a fonte e os componentes para a identidade da INOVA.

colors:
  canvas: "#0b0b0b"
  surface: "#121212"
  card: "#171717"
  elevated: "#1f1f1f"
  hairline: "#262626"
  hairline-strong: "#383838"
  ink: "#f2f2f2"
  body: "#c7c7c7"
  muted: "#8b8b8b"
  subtle: "#5e5e5e"
  signal: "#f2c230"
  signal-hover: "#f6cf55"
  signal-press: "#d9ad26"
  on-signal: "#0b0b0b"

typography:
  family: "Geist (texto e títulos), Geist Mono (números, códigos de norma, km)"
  display-xl: { size: "clamp(2.5rem, 5vw, 4.25rem)", weight: 700, lineHeight: 1.04, tracking: "-0.035em" }
  display-lg: { size: "clamp(2rem, 3.4vw, 3rem)", weight: 700, lineHeight: 1.08, tracking: "-0.03em" }
  title-lg: { size: 22px, weight: 600, lineHeight: 1.3, tracking: "-0.01em" }
  title-md: { size: 17px, weight: 600, lineHeight: 1.4 }
  body-lg: { size: 18px, weight: 400, lineHeight: 1.6 }
  body-md: { size: 16px, weight: 400, lineHeight: 1.6 }
  body-sm: { size: 14px, weight: 400, lineHeight: 1.55 }
  data: { family: "Geist Mono", numeric: "tabular-nums" }

rounded:
  button: 8px
  input: 8px
  card: 12px
  band: 12px

spacing:
  base: 4px
  section: 96px (desktop), 64px (celular)
  card-padding: 28px a 32px
  container: 1280px
---

## Atmosfera

Engenharia, não ficção científica. O site parece um bom relatório técnico em tela: fundo quase preto,
texto claro, números em fonte mono e um único amarelo, o mesmo da sinalização de rodovia. O amarelo é
escasso nos elementos (botão principal, o laser do perfilômetro, o que está acima do limite) e generoso
em um único bloco por página (a faixa de contato).

Tema escuro único, por decisão de marca, como no sistema de referência.

## Cores

- `signal` é o único acento. Botão principal, linha do laser, dados acima do limite, faixa de contato.
- Cinzas neutros, sem tom quente ou frio. `body` para texto corrido, `muted` para apoio, `subtle` só para
  detalhes não essenciais (contraste baixo de propósito).
- Proibido: segundo acento, degradê em texto, brilho (glow), sombra preta, preto puro, branco puro.

## Tipografia

- Geist em tudo. Títulos em 700 com tracking negativo; corpo em 400; rótulos em 500/600.
- Números, quilometragem e códigos de norma em Geist Mono com `tabular-nums`.
- Caixa de frase nos títulos (padrão do português). Sem rótulos em caixa alta acima dos títulos.

## Formas

- Botões e campos: 8px. Cards, painéis e a faixa amarela: 12px. Nada de pílula em botão.
- Sem bordas duplas, sem caixa dentro de caixa. Agrupar com espaço e linhas finas (`hairline`).

## Componentes

- **Botão principal:** fundo `signal`, texto `on-signal`, 600, altura 44px, raio 8px. Hover clareia,
  pressionado escurece e desce 1px.
- **Botão secundário:** fundo `elevated`, texto `ink`. Link de texto quando a ação é só navegar.
- **Card:** fundo `card`, raio 12px, sem borda, sem sombra. A visualização fica direto na superfície do card.
- **Card amarelo:** um por página, texto `on-signal`.
- **Faixa de contato:** fundo `signal`, raio 12px, título em 700 preto e botão escuro.
- **Tabela de dados:** cabeçalho com uma linha fina embaixo; linhas sem borda; números alinhados à direita
  em mono.

## Movimento

- Intensidade baixa (4 de 10). Entrada suave das seções (subir 16px e aparecer, uma vez).
- Animações só quando explicam algo: o laser lendo a pista, a bacia de deflexão se formando, o perfil
  sendo desenhado. Tocam uma vez ao entrar na tela; a do hero tem botão de pausa.
- Tudo respeita `prefers-reduced-motion`.

## Não fazer

- Rótulo numerado acima de seção ("01 — Serviços"), selo com bolinha pulsando, bolinhas de status.
- Interface falsa (terminal, janela de software, dashboard feito de divs).
- Travessão (— ou –) em qualquer texto visível; no máximo um ponto médio (·) por linha.
- Estrutura "não é X, é Y" no texto; verbos vazios (elevar, revolucionar, potencializar).
- Mais de uma faixa rolando sozinha; três cards iguais lado a lado.
