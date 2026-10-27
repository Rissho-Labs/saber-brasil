import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const votingsMock = [
  {
    id: "voting-1",
    code: "PL 1234/2026",
    title: "Reforma Tributária nos Serviços",
    summary: "Altera a tributação de serviços e define a regra de transição.",
    house: "Câmara dos Deputados",
    date: "2026-10-08",
    status: "Aprovado",
    statusClass: "bg-emerald-100 text-emerald-800",
    favorLabel: "Sim",
    againstLabel: "Não",
    favorPercent: 84,
    againstPercent: 16,
    favorCount: 428,
    againstCount: 82,
    quorumLabel: "Quórum: 510 votantes",
  },
  {
    id: "voting-2",
    code: "PEC 45/2025",
    title: "Incentivos para Energias Renováveis",
    summary: "Inclui incentivos para geração renovável no texto constitucional.",
    house: "Senado Federal",
    date: "2026-10-07",
    status: "Em Tramitação",
    statusClass: "bg-amber-100 text-amber-800",
    favorLabel: "Parecer Favorável",
    againstLabel: "Destaques Contrários",
    favorPercent: 68,
    againstPercent: 32,
    favorCount: null,
    againstCount: null,
    quorumLabel: "Comissão Especial de Constituição e Justiça",
  },
];

export function RecentVotings() {
  return (
    <section aria-labelledby="votings-heading" className="space-y-6">
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
            Transparência em Foco
          </p>
          <h2
            id="votings-heading"
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground"
          >
            <ClipboardCheck className="size-5 text-amber-600" aria-hidden="true" />
            Votações Recentes no Plenário
          </h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe as deliberações do Poder Legislativo (dados ilustrativos).
          </p>
        </div>
        <span className="text-xs text-muted-foreground">Quóruns Nominais</span>
      </div>

      <div className="space-y-4">
        {votingsMock.map((voting) => (
          <Card
            key={voting.id}
            className="rounded-2xl border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="space-y-3 p-5 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  {voting.code} • {voting.title}
                </span>
                <Badge className={`rounded px-2 py-0.5 text-[11px] font-bold ${voting.statusClass}`}>
                  {voting.status}
                </Badge>
              </div>
              <CardTitle className="text-sm font-bold leading-snug text-foreground">
                {voting.summary}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-2">
              <div>
                <div className="mb-1.5 flex justify-between gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1 text-emerald-700">
                    ● {voting.favorLabel}: {voting.favorPercent}%
                    {voting.favorCount !== null ? ` (${voting.favorCount} votos)` : ""}
                  </span>
                  <span className="flex items-center gap-1 text-orange-600">
                    ● {voting.againstLabel}: {voting.againstPercent}%
                    {voting.againstCount !== null ? ` (${voting.againstCount} votos)` : ""}
                  </span>
                </div>
                <div
                  className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
                  role="img"
                  aria-label={`A favor ${voting.favorPercent} por cento, contra ${voting.againstPercent} por cento`}
                >
                  <div
                    className="h-full bg-emerald-700"
                    style={{ width: `${voting.favorPercent}%` }}
                  />
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${voting.againstPercent}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span>
                  {voting.house} ·{" "}
                  <time dateTime={voting.date}>
                    {new Date(voting.date).toLocaleDateString("pt-BR")}
                  </time>
                </span>
                <span>{voting.quorumLabel}</span>
              </div>
              <Link
                href="/votacoes"
                className="inline-flex text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline"
              >
                Ver voto por partido →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
