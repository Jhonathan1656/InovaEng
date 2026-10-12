// Dados do site num lugar só. Troque os marcados com TODO antes de publicar.
export const site = {
  name: "INOVA",
  tagline: "Engenharia de dados para infraestrutura",
  description:
    "Processamento de FWD, perfilômetro, IRI/ATR, laudos e inspeção de pontes. Pipelines no padrão do cliente, com confiabilidade técnica e confidencialidade total dos dados.",
  email: "inovateam.01@gmail.com",
  // WhatsApp do Rodrigo. Só dígitos, exatamente como o WhatsApp mostra o número: no DDD 61 a conta
  // fica sem o nono dígito, e é esse o formato que o link wa.me reconhece.
  whatsapp: "556181814507",
  whatsappExibicao: "+55 61 8181-4507",
  year: 2026,
} as const;

export const mensagemProposta = "Olá! Vim pelo site da INOVA e gostaria de solicitar uma proposta.";

/** Link oficial de conversa do WhatsApp (wa.me) com a mensagem já digitada. */
export function linkWhatsApp(texto: string = mensagemProposta): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export const navLinks = [
  { href: "#servicos", label: "Serviços" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#confidencialidade", label: "Confidencialidade" },
  { href: "#plataforma", label: "Plataforma" },
] as const;
