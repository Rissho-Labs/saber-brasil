import { Badge } from "@/components/ui/badge";
import { LEGISLATIVE_STAGES, type LegislativeStage } from "@/lib/search/catalog";

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
}

export function ProgressTimeline({
  currentStage,
  stageDates,
}: {
  currentStage: LegislativeStage;
  stageDates: readonly [string | null, string | null, string | null, string | null];
}) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {LEGISLATIVE_STAGES.map((label, index) => {
        const stage = (index + 1) as LegislativeStage;
        const date = stageDates[index];
        const state = stage < currentStage ? "done" : stage === currentStage ? "current" : "upcoming";
        const badge =
          state === "current" ? "Etapa atual" : state === "done" ? "Concluída" : "Pendente";

        return (
          <li
            key={label}
            aria-current={state === "current" ? "step" : undefined}
            className={
              state === "current"
                ? "rounded-lg border border-primary bg-primary/5 p-3"
                : "rounded-lg border border-border p-3"
            }
          >
            <Badge variant={state === "current" ? "default" : state === "done" ? "secondary" : "outline"}>
              {badge}
            </Badge>
            <p className="mt-2 text-sm font-medium leading-snug">{label}</p>
            {date ? (
              <time dateTime={date} className="mt-1 block text-xs text-muted-foreground">
                {formatDate(date)}
              </time>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">Sem data</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
