import { WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { linkWhatsApp, site } from "@/lib/site";
import { Reveal } from "../reveal";
import { ContactForm } from "./contact-form";

const etapas = [
  { titulo: "Conversa de escopo", texto: "Você conta o que tem em mãos e o que precisa entregar." },
  { titulo: "Proposta com prazo", texto: "Escopo, formato de entrega e cronograma por escrito." },
  { titulo: "Piloto com um lote", texto: "Começamos por um lote, no seu padrão, antes de escalar." },
];

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="border-t border-hairline py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="flex flex-col gap-8 rounded-xl bg-signal p-8 text-on-signal sm:p-12 lg:flex-row lg:items-end lg:justify-between lg:p-14">
          <div className="max-w-2xl">
            <h2
              id="contato-titulo"
              className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-balance"
            >
              Tem levantamento parado?
              <br />A gente processa.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed">
              Conte o que você tem e o padrão que precisa entregar. A resposta vem com escopo, prazo e proposta.
            </p>
          </div>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark shrink-0 self-start lg:self-auto"
          >
            <WhatsappLogoIcon aria-hidden="true" size={18} weight="bold" />
            Solicitar proposta
          </a>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h3 className="text-2xl font-semibold tracking-[-0.015em] text-ink">Prefere mandar os detalhes?</h3>
            <p className="mt-3 max-w-md leading-relaxed text-body">
              O formulário monta a mensagem e abre o WhatsApp com tudo escrito.
            </p>
            <ol className="mt-8 space-y-5">
              {etapas.map((e) => (
                <li key={e.titulo}>
                  <p className="font-medium text-ink">{e.titulo}</p>
                  <p className="mt-0.5 text-sm text-muted">{e.texto}</p>
                </li>
              ))}
            </ol>
            <dl className="mt-10 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className="text-muted">WhatsApp</dt>
                <dd className="mt-1">
                  <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="link">
                    {site.whatsappExibicao}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted">E-mail</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="link break-all">
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <Reveal delay={0.05} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
