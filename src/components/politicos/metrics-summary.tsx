import { Card, CardContent } from "@/components/ui/card";
import { Star, Award } from "lucide-react";

interface MetricsSummaryProps {
  carismaRating: number;
  gestaoScore: number;
}

export function MetricsSummary({ carismaRating, gestaoScore }: MetricsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="border-border/80">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Avaliação do Público (Carisma)
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold tracking-tight">
                {carismaRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Média das notas da comunidade</p>
          </div>
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500" aria-hidden="true">
            <Star className="size-6 fill-amber-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Índice de Gestão
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold tracking-tight">{gestaoScore}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pontuação técnica e assiduidade</p>
          </div>
          <div className="p-3 rounded-full bg-primary/10 text-primary" aria-hidden="true">
            <Award className="size-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}