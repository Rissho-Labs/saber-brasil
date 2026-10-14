import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PublicProfile } from "@/types";

type DualScoreGraphicProps = Pick<PublicProfile, "carisma_rating" | "gestao_score">;

function clamp(value: number, min: number, max: number): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return min;
  }

  return Math.min(max, Math.max(min, numeric));
}

export function DualScoreGraphic({
  carisma_rating,
  gestao_score,
}: DualScoreGraphicProps) {
  const carisma = clamp(carisma_rating, 0, 5);
  const gestao = Math.trunc(clamp(gestao_score, 0, 100));
  const filledStars = Math.round(carisma);
  const carismaWidth = `${(carisma / 5) * 100}%`;
  const gestaoWidth = `${gestao}%`;

  return (
    <section aria-labelledby="dual-score-heading" className="space-y-3">
      <div className="space-y-1">
        <h2 id="dual-score-heading" className="text-xl font-semibold tracking-tight">
          Dupla nota
        </h2>
        <p className="text-sm text-muted-foreground">
          O carisma é a avaliação subjetiva da comunidade. O Índice de Gestão é a
          métrica objetiva de assiduidade, coerência TSE e impacto cruzado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border/80">
          <CardContent className="space-y-4 p-6">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Avaliação subjetiva
              </h3>
              <p className="mt-2 text-sm font-medium">Carisma</p>
            </div>
            <p className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">
                {carisma.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
            </p>
            <div
              className="flex items-center gap-1 text-amber-500"
              role="img"
              aria-label={`${filledStars} de 5 estrelas`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "size-4",
                    index < filledStars ? "fill-amber-500" : "fill-transparent"
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div
              role="meter"
              aria-label="Avaliação subjetiva de carisma"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={Number(carisma.toFixed(1))}
              aria-valuetext={`${carisma.toFixed(1)} de 5.0 estrelas`}
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: carismaWidth }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="space-y-4 p-6">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Métrica objetiva
              </h3>
              <p className="mt-2 text-sm font-medium">Índice de Gestão</p>
            </div>
            <p className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{gestao}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </p>
            <div
              role="meter"
              aria-label="Índice de Gestão"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={gestao}
              aria-valuetext={`${gestao} de 100 pontos`}
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: gestaoWidth }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Assiduidade 20%, coerência TSE 30% e impacto cruzado 50%.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
