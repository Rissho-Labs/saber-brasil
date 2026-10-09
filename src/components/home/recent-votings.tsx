import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const votingsMock = [
  {
    id: "voting-1",
    title: "PL 1234/2026 - Reforma Tributária nos Serviços",
    house: "Câmara dos Deputados",
    date: "2026-10-08",
    status: "Aprovado",
    statusVariant: "default" as const,
  },
  {
    id: "voting-2",
    title: "PEC 45/2025 - Incentivos para Energias Renováveis",
    house: "Senado Federal",
    date: "2026-10-07",
    status: "Em Tramitação",
    statusVariant: "secondary" as const,
  },
];

export function RecentVotings() {
  return (
    <section aria-labelledby="votings-heading" className="space-y-4">
      <div>
        <h2 id="votings-heading" className="text-xl font-bold tracking-tight">
          Últimas Votações
        </h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe as deliberações do Poder Legislativo (dados ilustrativos)
        </p>
      </div>

      <div className="space-y-3">
        {votingsMock.map((voting) => (
          <Card key={voting.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-sm font-medium leading-snug">
                  {voting.title}
                </CardTitle>
                <Badge variant={voting.statusVariant}>{voting.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
              <span>{voting.house}</span>
              <time dateTime={voting.date}>
                {new Date(voting.date).toLocaleDateString("pt-BR")}
              </time>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}