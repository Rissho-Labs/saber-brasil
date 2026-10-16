import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GemBadge, gemTierFromGestaoScore } from "@/components/ui/gem-badge";
import { MandateBadge } from "@/components/ui/mandate-badge";
import { PublicProfile, SphereType } from "@/types";

const SPHERE_BORDER: Record<SphereType, string> = {
  [SphereType.POLITICA]: "border-green-600",
  [SphereType.JUDICIARIO]: "border-blue-600",
  [SphereType.ACADEMIA]: "border-zinc-300",
  [SphereType.SEGURANCA]: "border-zinc-700",
};

const SPHERE_LABEL: Record<SphereType, string> = {
  [SphereType.POLITICA]: "Política",
  [SphereType.JUDICIARIO]: "Judiciário",
  [SphereType.ACADEMIA]: "Academia",
  [SphereType.SEGURANCA]: "Segurança",
};

interface ProfileCardProps {
  profile: PublicProfile;
}

function finiteNumber(value: number, fallback: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const rating = Math.min(5, Math.max(0, finiteNumber(profile.carisma_rating, 0)));
  const score = Math.min(100, Math.max(0, Math.trunc(finiteNumber(profile.gestao_score, 0))));
  const gemTier = gemTierFromGestaoScore(score);
  const filledStars = Math.round(rating);
  const titleId = `profile-${profile.id}-name`;

  return (
    <article aria-labelledby={titleId} className="h-full">
      <Card className={cn("flex h-full flex-col border-2", SPHERE_BORDER[profile.sphere])}>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold"
            aria-hidden="true"
          >
            {profile.name.charAt(0) || "?"}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle id={titleId} className="truncate text-base">
              {profile.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {profile.current_role ?? "Cargo não informado"}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{SPHERE_LABEL[profile.sphere]}</Badge>
              <MandateBadge status={profile.status} />
              <GemBadge
                tier={gemTier}
                criteria={`Faixa visual do Índice de Gestão: ${score} de 100. O esquema não persiste esta gema.`}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div
              className="flex items-center gap-1 text-amber-500"
              role="img"
              aria-label={`Avaliação do público: ${rating.toFixed(1)} de 5 estrelas`}
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
              <span className="ml-1 text-xs font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
            </div>
            <p>
              <span className="text-muted-foreground">Índice de Gestão </span>
              <span className="font-medium">{score}</span>
              <span className="text-muted-foreground"> / 100</span>
            </p>
          </div>
          <Link
            href={`/politicos/${profile.id}`}
            className="inline-flex rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Ver perfil
            <span className="sr-only"> de {profile.name}</span>
          </Link>
        </CardContent>
      </Card>
    </article>
  );
}
