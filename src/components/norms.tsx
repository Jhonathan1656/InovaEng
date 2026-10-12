// Conferir a lista com a equipe técnica antes de publicar: entram só normas que vocês atendem de fato.
const normas = [
  "DNIT 006/2003-PRO",
  "DNIT 008/2003-PRO",
  "DNER-PRO 273/96",
  "ASTM E1926",
  "ASTM E950",
  "ABNT NBR 9452",
  "DNIT 010/2004-PRO",
];

export function Norms() {
  return (
    <section aria-label="Normas atendidas" className="border-y border-hairline">
      <div className="container-x flex flex-col gap-3 py-6 lg:flex-row lg:items-baseline lg:gap-10">
        <p className="shrink-0 text-sm font-medium text-muted">Entregamos conforme</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {normas.map((n) => (
            <li key={n} translate="no" className="font-mono text-body">
              {n}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
