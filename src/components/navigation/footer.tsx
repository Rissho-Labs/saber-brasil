import Link from "next/link";
import { Scale } from "lucide-react";

const OFFICIAL_SOURCES = [
  {
    href: "https://dados.gov.br/",
    label: "Portal Brasileiro de Dados Abertos",
  },
  {
    href: "https://www.camara.leg.br/dados-abertos/",
    label: "Dados Abertos — Câmara dos Deputados",
  },
  {
    href: "https://www12.senado.leg.br/dados-abertos",
    label: "Dados Abertos — Senado Federal",
  },
  {
    href: "https://www.gov.br/transparencia/pt-br",
    label: "Portal da Transparência",
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground">
              <Scale className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              SABER <span className="text-success">Brasil</span>
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/80">
            Plataforma cívica de transparência e alfabetização democrática. Indicadores e placares
            exibidos no app podem ser catálogos ilustrativos até a sincronização com fontes oficiais.
          </p>
          <p className="inline-flex rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1.5 text-xs font-medium text-primary-foreground/90">
            Independente de partidos políticos
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold tracking-wider text-primary-foreground uppercase">
            Navegação
          </h2>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link href="/" className="hover:text-primary-foreground hover:underline">
                Início
              </Link>
            </li>
            <li>
              <Link href="/busca" className="hover:text-primary-foreground hover:underline">
                Políticos
              </Link>
            </li>
            <li>
              <Link href="/votacoes" className="hover:text-primary-foreground hover:underline">
                Votações
              </Link>
            </li>
            <li>
              <Link href="/indicadores" className="hover:text-primary-foreground hover:underline">
                Indicadores
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold tracking-wider text-primary-foreground uppercase">
            Fontes oficiais
          </h2>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {OFFICIAL_SOURCES.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground hover:underline"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-primary-foreground/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} SABER Brasil. Conteúdo sob licença Creative Commons Atribuição 4.0.</p>
          <p>Dados públicos oficiais pertencem às respectivas instituições de origem.</p>
        </div>
      </div>
    </footer>
  );
}
