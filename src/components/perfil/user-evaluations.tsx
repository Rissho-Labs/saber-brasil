"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EvaluationModal } from "@/components/politicos/evaluation-modal";
import { Button } from "@/components/ui/button";
import { UserEvaluationHistoryItem } from "@/lib/services/user-history";
import { CompetencyCriterion, SphereType } from "@/types";

const SPHERE_LABEL: Record<SphereType, string> = {
  [SphereType.POLITICA]: "Política",
  [SphereType.JUDICIARIO]: "Judiciário",
  [SphereType.ACADEMIA]: "Academia",
  [SphereType.SEGURANCA]: "Segurança",
};

const CRITERION_LABEL: Record<CompetencyCriterion, string> = {
  [CompetencyCriterion.POSTURE]: "Postura",
  [CompetencyCriterion.DECORUM]: "Decoro",
  [CompetencyCriterion.DISCURSIVE_COHERENCE]: "Coerência discursiva",
  [CompetencyCriterion.ARTICULATION]: "Articulação política",
  [CompetencyCriterion.TRANSPARENCY]: "Transparência",
  [CompetencyCriterion.ACCOUNTABILITY]: "Accountability",
  [CompetencyCriterion.RESPONSIVENESS]: "Responsividade",
  [CompetencyCriterion.ETHICAL_CONDUCT]: "Conduta ética",
  [CompetencyCriterion.PUBLIC_COMMUNICATION]: "Comunicação pública",
  [CompetencyCriterion.INSTITUTIONAL_COMMITMENT]: "Compromisso institucional",
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

function EvaluationRow({ item }: { item: UserEvaluationHistoryItem }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setPending(true);
    setError(null);
    const response = await fetch(`/api/avaliacoes/${item.id}`, { method: "DELETE" });
    const body: unknown = await response.json().catch(() => null);
    const message =
      typeof body === "object" && body !== null && "error" in body && typeof body.error === "string"
        ? body.error
        : "Não foi possível excluir a avaliação.";

    if (!response.ok) {
      setPending(false);
      setError(message);
      return;
    }

    setConfirming(false);
    router.refresh();
  }

  return (
    <article className="space-y-4 rounded-xl border border-border p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">
            {item.sphere ? SPHERE_LABEL[item.sphere] : "Esfera indisponível"}
            {item.role ? ` · ${item.role}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">Atualizada em {formatDate(item.updatedAt)}</p>
        </div>
        <p className="text-sm font-medium">Carisma {item.carisma.toFixed(1)} / 5</p>
      </div>
      <ul className="grid gap-1 text-sm sm:grid-cols-2">
        {(Object.keys(CRITERION_LABEL) as CompetencyCriterion[]).map((criterion) => (
          <li key={criterion} className="flex justify-between gap-3">
            <span className="text-muted-foreground">{CRITERION_LABEL[criterion]}</span>
            <span>{item.scores[criterion].toFixed(1)}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2">
        {item.profileId ? (
          <EvaluationModal
            profileId={item.profileId}
            initialScores={item.scores}
            triggerLabel="Editar"
          />
        ) : null}
        {item.profileId ? (
          <Button variant="outline" asChild>
            <Link href={`/politicos/${item.profileId}`}>Ver perfil</Link>
          </Button>
        ) : null}
        {confirming ? (
          <>
            <Button type="button" variant="destructive" disabled={pending} onClick={onDelete}>
              {pending ? "Excluindo..." : "Confirmar exclusão"}
            </Button>
            <Button type="button" variant="outline" disabled={pending} onClick={() => setConfirming(false)}>
              Cancelar
            </Button>
          </>
        ) : (
          <Button type="button" variant="outline" onClick={() => setConfirming(true)}>
            Excluir
          </Button>
        )}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </article>
  );
}

export function UserEvaluations({ items }: { items: UserEvaluationHistoryItem[] }) {
  return (
    <section aria-labelledby="history-heading" className="space-y-4">
      <div>
        <h2 id="history-heading" className="text-lg font-semibold">
          Minhas avaliações
        </h2>
        <p className="text-sm text-muted-foreground">
          Cada pessoa mantém uma avaliação por representante.
        </p>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Você ainda não avaliou um representante.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <EvaluationRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
