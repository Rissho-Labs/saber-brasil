import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Users, Vote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { filterVotingsByStatus } from "@/lib/search/catalog";

const CATALOG_VOTING_COUNT = filterVotingsByStatus(undefined).length;

const stats = [
  {
    label: "Esferas de cobertura",
    value: "4",
    description: "Política, Judiciário, Academia e Segurança",
    icon: Users,
    accent: "bg-primary/10 text-primary",
  },
  {
    label: "Tramitações no catálogo",
    value: String(CATALOG_VOTING_COUNT),
    description: "Itens ilustrativos do hub /votacoes",
    icon: Vote,
    accent: "bg-secondary text-secondary-foreground",
  },
  {
    label: "Índice de Assiduidade (amostra)",
    value: "—",
    description: "Métrica ilustrativa; sem feed oficial neste ambiente",
    icon: CheckCircle2,
    accent: "bg-accent text-accent-foreground",
  },
  {
    label: "Projetos no perfil",
    value: "Supabase",
    description: "Lista por representante via public_projects",
    icon: FileText,
    accent: "bg-muted text-foreground",
  },
] as const;

export function KPIStats() {
  return (
    <section aria-labelledby="kpi-heading" id="pilares-metricas" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-1">
          <p className="text-xs font-bold tracking-wider text-primary uppercase">
            Painel de monitoramento
          </p>
          <h2
            id="kpi-heading"
            className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
          >
            Indicadores do monitoramento
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Leitura ilustrativa da cobertura do app. Não são séries oficiais ao vivo da Câmara ou do
            Senado.
          </p>
        </div>
        <Link
          href="/indicadores"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Veja mais
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="rounded-2xl border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="flex items-start justify-between gap-3 p-6">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${stat.accent}`}
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
