import { VoteBadge } from "@/components/votacoes/vote-badge";
import { votingsForProfile } from "@/lib/search/catalog";

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
}

export function VotingPositions({ profileId }: { profileId: string }) {
  const positions = votingsForProfile(profileId);

  return (
    <section aria-labelledby="votacoes-heading" className="space-y-4">
      <div className="space-y-1">
        <h2 id="votacoes-heading" className="text-xl font-semibold tracking-tight">
          Votações e Posicionamentos
        </h2>
        <p className="text-sm text-muted-foreground">
          Votações recentes deste perfil no catálogo ilustrativo. O distintivo é o voto deste
          representante, não o resultado da Casa.
        </p>
      </div>

      {positions.length === 0 ? (
        <p role="status" className="text-sm text-muted-foreground">
          Nenhuma votação registrada para este perfil.
        </p>
      ) : (
        <ul className="m-0 list-none space-y-3 p-0">
          {positions.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold">{item.code}</p>
                <p className="text-sm text-foreground">{item.title}</p>
                <time dateTime={item.date} className="block text-xs text-muted-foreground">
                  {formatDate(item.date)}
                </time>
              </div>
              <VoteBadge vote={item.vote} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
