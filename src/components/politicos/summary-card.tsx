import Image from "next/image";
import Link from "next/link";
import { Award, ChevronRight, Star, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MandateStatus,
  mandateStatusFromProfile,
  ProfileStatus,
  PublicProfile,
  SphereType,
} from "@/types";

const SPHERE_LABEL: Record<SphereType, string> = {
  [SphereType.POLITICA]: "Política",
  [SphereType.JUDICIARIO]: "Judiciário",
  [SphereType.ACADEMIA]: "Academia",
  [SphereType.SEGURANCA]: "Segurança",
};

const DEFAULT_HIGHLIGHTS: Record<SphereType, readonly string[]> = {
  [SphereType.POLITICA]: ["Assiduidade", "Orçamento", "Transparência"],
  [SphereType.JUDICIARIO]: ["Produtividade", "Tramitação", "Integridade"],
  [SphereType.ACADEMIA]: ["Pesquisa", "Gestão", "Extensão"],
  [SphereType.SEGURANCA]: ["Resposta", "Investimento", "Prevenção"],
};

export interface SummaryCardProps {
  profile: PublicProfile;
  /** Local public path only (e.g. `/avatars/x.jpg`). Remote hosts fall back to initials. */
  photoUrl?: string | null;
  /** Plain-language blurb; derived from role and scores when omitted. */
  summary?: string | null;
  /** Theme chips; sphere defaults when omitted. */
  highlights?: readonly string[] | null;
}

function finiteNumber(value: number, fallback: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isLocalImagePath(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//");
}

function buildSummary(profile: PublicProfile, summary?: string | null): string {
  const custom = summary?.trim();
  if (custom) {
    return custom;
  }

  const role = profile.current_role?.trim() || "Representante público";
  const sphere = SPHERE_LABEL[profile.sphere];
  const gestao = clamp(Math.trunc(finiteNumber(profile.gestao_score, 0)), 0, 100);
  const carisma = clamp(finiteNumber(profile.carisma_rating, 0), 0, 5).toFixed(1);

  return `${role} na esfera ${sphere}. Índice de Gestão em ${gestao}/100 e percepção pública (Carisma) em ${carisma}/5.0.`;
}

function ProfileAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl?: string | null;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const localSrc = photoUrl && isLocalImagePath(photoUrl) ? photoUrl : null;

  return (
    <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted sm:size-24">
      {localSrc ? (
        <Image
          src={localSrc}
          alt={`Foto de ${name}`}
          fill
          sizes="96px"
          className="object-cover"
        />
      ) : (
        <div
          className="flex size-full items-center justify-center text-2xl font-bold text-muted-foreground sm:text-3xl"
          aria-hidden="true"
        >
          {initial}
        </div>
      )}
    </div>
  );
}

function MandateStatusBadge({ status }: { status: ProfileStatus }) {
  const mandate = mandateStatusFromProfile(status);
  const isActive = mandate === MandateStatus.EM_MANDATO;

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
        <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
        <UserCheck className="size-3" aria-hidden="true" />
        Em Exercício
      </span>
    );
  }

  const label =
    mandate === MandateStatus.CANDIDATO
      ? "Candidato"
      : mandate === MandateStatus.EX_MANDATO
        ? "Ex-mandatário"
        : "Status não informado";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
      {label}
    </span>
  );
}

function DualScores({
  carisma,
  gestao,
}: {
  carisma: number;
  gestao: number;
}) {
  const filledStars = Math.round(carisma);
  const gestaoWidth = `${gestao}%`;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <Award className="size-3.5 text-primary" aria-hidden="true" />
          Índice de Gestão
        </div>
        <p className="text-2xl font-bold tracking-tight text-card-foreground">
          {gestao}
          <span className="text-sm font-medium text-muted-foreground"> / 100</span>
        </p>
        <div
          role="meter"
          aria-label="Índice ponderado de gestão"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={gestao}
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: gestaoWidth }} />
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Percepção pública (Carisma)
        </p>
        <p className="text-2xl font-bold tracking-tight text-card-foreground">
          {carisma.toFixed(1)}
          <span className="text-sm font-medium text-muted-foreground"> / 5.0</span>
        </p>
        <div
          className="flex items-center gap-1 text-primary"
          role="img"
          aria-label={`${filledStars} de 5 estrelas`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={cn(
                "size-4",
                index < filledStars ? "fill-primary" : "fill-transparent text-muted-foreground",
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SummaryCard({
  profile,
  photoUrl = null,
  summary = null,
  highlights = null,
}: SummaryCardProps) {
  const carisma = clamp(finiteNumber(profile.carisma_rating, 0), 0, 5);
  const gestao = clamp(Math.trunc(finiteNumber(profile.gestao_score, 0)), 0, 100);
  const blurb = buildSummary(profile, summary);
  const chips =
    highlights && highlights.length > 0
      ? highlights
      : DEFAULT_HIGHLIGHTS[profile.sphere];
  const titleId = `summary-card-${profile.id}-name`;

  return (
    <article aria-labelledby={titleId} className="w-full">
      <Card className="border-border bg-card text-card-foreground shadow-sm">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <ProfileAvatar name={profile.name} photoUrl={photoUrl} />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id={titleId}
                  className="truncate text-xl font-bold tracking-tight text-card-foreground sm:text-2xl"
                >
                  {profile.name}
                </h2>
                <MandateStatusBadge status={profile.status} />
              </div>

              <p className="text-sm text-muted-foreground">
                {profile.current_role?.trim() || "Cargo não informado"}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{SPHERE_LABEL[profile.sphere]}</Badge>
              </div>
            </div>
          </div>

          <DualScores carisma={carisma} gestao={gestao} />

          <p className="text-sm leading-relaxed text-muted-foreground">{blurb}</p>

          <ul className="flex flex-wrap gap-2" aria-label="Temas em destaque">
            {chips.map((chip) => (
              <li key={chip}>
                <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                  {chip}
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-1">
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/politicos/${profile.id}`}>
                Raio-X Completo
                <ChevronRight data-icon="inline-end" aria-hidden="true" />
                <span className="sr-only"> de {profile.name}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
