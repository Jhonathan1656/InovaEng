# INOVA · site (preview)

Landing page da INOVA em Next.js 16, Tailwind CSS 4, Motion e ícones Phosphor. Página única, estática,
tema escuro.

O sistema visual está em [`DESIGN.md`](DESIGN.md): canvas quase preto, um único amarelo de sinalização,
Geist em peso 700, superfícies chapadas. Antes de mudar cor, fonte ou componente, leia o "Não fazer" de lá.

## Rodar

```bash
npm install
npm run dev                 # desenvolvimento: http://localhost:3000
npm run build && npm start  # produção
```

## Onde mexer

| O quê | Arquivo |
|---|---|
| Nome, e-mail, WhatsApp, links do menu | `src/lib/site.ts` |
| Cores e componentes base (botões, link, skip link) | `src/app/globals.css` |
| Hero e a pista em canvas (com botão de pausa) | `src/components/hero/` |
| Normas atendidas | `src/components/norms.tsx` |
| Serviços e as mini-animações (FWD, perfil, IRI, laudo, ponte) | `src/components/services/` |
| Etapas do pipeline e a tabela de exemplo | `src/components/pipeline/` |
| Implantação × sob demanda | `src/components/delivery-models.tsx` |
| Confidencialidade | `src/components/confidentiality/` |
| Plataforma e o gráfico de IRI | `src/components/platform/` |
| Faixa de contato e formulário | `src/components/contact/` |

Os números das animações, da tabela e do gráfico saem de um modelo sintético em `src/lib/road.ts`.
Não são dados de cliente, e o site avisa isso onde aparecem.

## WhatsApp

Os botões "Solicitar proposta" (menu, hero, faixa de contato), os links de WhatsApp e o envio do
formulário abrem uma conversa com o número de `site.whatsapp`, pelo link oficial `wa.me` com a mensagem
já digitada. Não precisa de API nem de chave. O formulário valida nome e e-mail na própria linha do campo
e monta a mensagem com nome, empresa, e-mail, serviços marcados e o texto.

O número vai só com dígitos e exatamente como o WhatsApp o mostra. No DDD 61 a conta aparece sem o nono
dígito (`556181814507`); se algum dia o link não abrir a conversa certa, teste com o 9 (`5561981814507`).

## Antes de publicar

- [ ] Conferir a lista de normas em `src/components/norms.tsx`.
- [ ] Revisar as promessas do texto (sigilo em contrato, implantação na rede do cliente, sem nuvem) contra o que a INOVA oferece de fato.
- [ ] Fotos reais de campo (veículo do perfilômetro, FWD, inspeção de ponte): é o que mais falta para o site parecer de uma empresa de verdade.
- [ ] Trocar a marca provisória (`src/components/logo.tsx` e `src/app/icon.svg`) pelo logo definitivo.
