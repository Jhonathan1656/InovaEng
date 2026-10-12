"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { linkWhatsApp, site } from "@/lib/site";

const OPCOES = ["FWD", "Perfilômetro", "IRI/ATR", "Laudo", "Pontes", "Implantação", "Outro"];
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const campo =
  "block w-full rounded-lg border border-hairline-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-muted transition-colors hover:border-[#4a4a4a] aria-[invalid=true]:border-signal";
const rotulo = "mb-2 block text-sm font-medium text-ink";

type Erros = { nome?: string; email?: string };

// Sem backend: o envio abre uma conversa no WhatsApp com o pedido já escrito; o visitante só aperta enviar.
export function ContactForm() {
  const [servicos, setServicos] = useState<string[]>([]);
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState(false);
  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const alternar = (s: string) => setServicos((atual) => (atual.includes(s) ? atual.filter((x) => x !== s) : [...atual, s]));
  const limpar = (campoComErro: keyof Erros) => {
    if (erros[campoComErro]) setErros((e) => ({ ...e, [campoComErro]: undefined }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    const valor = (k: string) => String(dados.get(k) ?? "").trim();
    const nome = valor("nome");
    const empresa = valor("empresa");
    const email = valor("email");
    const mensagem = valor("mensagem");

    const novos: Erros = {};
    if (!nome) novos.nome = "Informe seu nome para a mensagem sair identificada.";
    if (email && !EMAIL_VALIDO.test(email)) novos.email = "Confira o e-mail: falta o @ ou o domínio, como em voce@empresa.com.br.";
    setErros(novos);
    if (novos.nome) return nomeRef.current?.focus();
    if (novos.email) return emailRef.current?.focus();

    const linhas = ["Olá! Vim pelo site da INOVA e gostaria de uma proposta.", "", `*Nome:* ${nome}`];
    if (empresa) linhas.push(`*Empresa:* ${empresa}`);
    if (email) linhas.push(`*E-mail:* ${email}`);
    if (servicos.length > 0) linhas.push(`*Serviços:* ${servicos.join(", ")}`);
    if (mensagem) linhas.push("", "*Mensagem:*", mensagem);
    const url = linkWhatsApp(linhas.join("\n"));
    // Nova aba no computador; se o navegador bloquear, segue na mesma aba.
    const aba = window.open(url, "_blank");
    if (aba) aba.opener = null;
    else window.location.href = url;
    setEnviado(true);
  };

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-xl bg-card p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contato-nome" className={rotulo}>
            Nome
          </label>
          <input
            ref={nomeRef}
            id="contato-nome"
            name="nome"
            autoComplete="name"
            required
            aria-invalid={erros.nome ? true : undefined}
            aria-describedby={erros.nome ? "contato-nome-erro" : undefined}
            onInput={() => limpar("nome")}
            className={campo}
            placeholder="Seu nome…"
          />
          {erros.nome ? (
            <p id="contato-nome-erro" className="mt-2 text-sm text-signal">
              {erros.nome}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contato-empresa" className={rotulo}>
            Empresa
          </label>
          <input
            id="contato-empresa"
            name="empresa"
            autoComplete="organization"
            className={campo}
            placeholder="Construtora, concessionária ou órgão…"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contato-email" className={rotulo}>
          E-mail <span className="font-normal text-muted">(opcional)</span>
        </label>
        <input
          ref={emailRef}
          id="contato-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          aria-invalid={erros.email ? true : undefined}
          aria-describedby={erros.email ? "contato-email-erro" : undefined}
          onInput={() => limpar("email")}
          className={campo}
          placeholder="voce@empresa.com.br…"
        />
        {erros.email ? (
          <p id="contato-email-erro" className="mt-2 text-sm text-signal">
            {erros.email}
          </p>
        ) : null}
      </div>

      <fieldset className="mt-6">
        <legend className={rotulo}>O que você precisa</legend>
        <div className="flex flex-wrap gap-2">
          {OPCOES.map((o) => {
            const ativo = servicos.includes(o);
            return (
              <button
                key={o}
                type="button"
                aria-pressed={ativo}
                onClick={() => alternar(o)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                  ativo
                    ? "border-signal bg-signal text-on-signal"
                    : "border-hairline-strong text-body hover:border-[#4a4a4a] hover:text-ink",
                )}
              >
                {ativo ? <CheckIcon aria-hidden="true" size={14} weight="bold" /> : null}
                {o}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="contato-mensagem" className={rotulo}>
          Mensagem
        </label>
        <textarea
          id="contato-mensagem"
          name="mensagem"
          autoComplete="off"
          rows={4}
          className={cn(campo, "resize-y")}
          placeholder="Trecho, extensão, equipamento, prazo e padrão de entrega…"
        />
      </div>

      <button type="submit" className="btn btn-primary mt-7 w-full">
        {enviado ? (
          <CheckIcon aria-hidden="true" size={18} weight="bold" />
        ) : (
          <WhatsappLogoIcon aria-hidden="true" size={18} weight="bold" />
        )}
        {enviado ? "Conversa aberta no WhatsApp" : "Solicitar proposta"}
      </button>
      <p aria-live="polite" className="mt-3 text-center text-sm text-muted">
        {enviado ? (
          <>
            Se a conversa não abriu, chame no{" "}
            <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="link">
              WhatsApp {site.whatsappExibicao}
            </a>
            .
          </>
        ) : (
          "Abre o WhatsApp com o pedido já escrito."
        )}
      </p>
    </form>
  );
}
