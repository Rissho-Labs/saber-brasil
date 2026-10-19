import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Vote, CheckCircle2, FileText } from "lucide-react";

const stats = [
  {
    label: "Parlamentares Monitorados",
    value: "594",
    description: "513 Deputados + 81 Senadores",
    icon: Users,
  },
  {
    label: "Votações Registradas",
    value: "1.240+",
    description: "Dados de amostragem inicial",
    icon: Vote,
  },
  {
    label: "Índice de Assiduidade",
    value: "92%",
    description: "Média estimada em plenário",
    icon: CheckCircle2,
  },
  {
    label: "Projetos Monitorados",
    value: "3.450",
    description: "Propostas legislativas ativas",
    icon: FileText,
  },
];

export function KPIStats() {
  return (
    <section aria-labelledby="kpi-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="kpi-heading" className="text-lg font-semibold tracking-tight">
          Indicadores do monitoramento
        </h2>
        <Link
          href="/indicadores"
          className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Veja mais
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted text-foreground" aria-hidden="true">
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