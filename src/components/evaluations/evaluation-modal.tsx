"use client";

import { FormEvent, ReactNode, useEffect, useId, useRef, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { politicalEvaluationSchema, type PoliticalEvaluation } from "@/schemas/politicalEvaluation.schema";
import { CompetencyCriterion, type StarScore } from "@/types";

const CRITERIA: { key: CompetencyCriterion; label: string }[] = [
  { key: CompetencyCriterion.POSTURE, label: "Postura" },
  { key: CompetencyCriterion.DECORUM, label: "Decoro" },
  { key: CompetencyCriterion.DISCURSIVE_COHERENCE, label: "Coerência discursiva" },
  { key: CompetencyCriterion.ARTICULATION, label: "Articulação política" },
  { key: CompetencyCriterion.TRANSPARENCY, label: "Transparência" },
  { key: CompetencyCriterion.ACCOUNTABILITY, label: "Accountability" },
  { key: CompetencyCriterion.RESPONSIVENESS, label: "Responsividade" },
  { key: CompetencyCriterion.ETHICAL_CONDUCT, label: "Conduta ética" },
  { key: CompetencyCriterion.PUBLIC_COMMUNICATION, label: "Comunicação pública" },
  { key: CompetencyCriterion.INSTITUTIONAL_COMMITMENT, label: "Compromisso institucional" },
];

const STAR_VALUES: StarScore[] = [1, 2, 3, 4, 5];

export type EvaluationPolitician = {
  id: string;
  name: string;
  role: string | null;
  photoUrl?: string | null;
};

type ScoreDraft = Partial<Record<CompetencyCriterion, StarScore>>;

function isCriterion(value: unknown): value is CompetencyCriterion {
  return CRITERIA.some((criterion) => criterion.key === value);
}

function scoreErrors(error: z.ZodError): Partial<Record<CompetencyCriterion, string>> {
  const messages: Partial<Record<CompetencyCriterion, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[1];
    if (issue.path[0] === "scores" && isCriterion(field) && messages[field] === undefined) {
      messages[field] = "Escolha uma nota de 1 a 5.";
    }
  }
  return messages;
}

export function EvaluationModal({
  politician,
  onSubmit,
  triggerLabel = "Avaliar",
  open,
  onOpenChange,
  children,
}: {
  politician: EvaluationPolitician;
  onSubmit: (evaluation: PoliticalEvaluation) => Promise<void> | void;
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  children?: ReactNode;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [scores, setScores] = useState<ScoreDraft>({});
  const [touched, setTouched] = useState<Partial<Record<CompetencyCriterion, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const controlled = open !== undefined;

  const parsed = politicalEvaluationSchema.safeParse({
    profileId: politician.id,
    scores,
  });
  const errors = parsed.success ? {} : scoreErrors(parsed.error);
  const invalidProfile =
    !parsed.success && parsed.error.issues.some((issue) => issue.path[0] === "profileId")
      ? "O perfil informado não pode receber uma avaliação."
      : null;
  const canSubmit = parsed.success && !isSubmitting;
  const photoUrl = politician.photoUrl?.startsWith("https://") && !photoFailed ? politician.photoUrl : null;
  const initial = politician.name.trim().charAt(0).toUpperCase() || "?";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !controlled) {
      return;
    }

    if (open && !dialog.open) {
      setStatus(null);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [controlled, open]);

  function openDialog() {
    setStatus(null);
    if (controlled) {
      onOpenChange?.(true);
      return;
    }
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function setScore(criterion: CompetencyCriterion, score: StarScore) {
    setScores((current) => ({ ...current, [criterion]: score }));
    setTouched((current) => ({ ...current, [criterion]: true }));
  }

  function onStarKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    criterion: CompetencyCriterion,
    star: StarScore,
  ) {
    const index = STAR_VALUES.indexOf(star);
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextIndex = Math.min(STAR_VALUES.length - 1, index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextIndex = Math.max(0, index - 1);
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = STAR_VALUES.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextStar = STAR_VALUES[nextIndex];
    setScore(criterion, nextStar);
    window.requestAnimationFrame(() => {
      document.getElementById(`${criterion}-score-${nextStar}`)?.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    const result = politicalEvaluationSchema.safeParse({
      profileId: politician.id,
      scores,
    });
    if (!result.success) {
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    try {
      await onSubmit(result.data);
      closeDialog();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível enviar a avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {controlled ? null : (
        <Button type="button" onClick={openDialog}>
          {triggerLabel}
        </Button>
      )}
      <dialog
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={() => onOpenChange?.(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-full max-w-none items-end justify-center border-0 bg-black/50 p-0 text-foreground backdrop:bg-transparent sm:items-center sm:p-4 [&:not([open])]:hidden"
      >
        <form
          onSubmit={handleSubmit}
          onClick={(event) => event.stopPropagation()}
          className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-background p-4 shadow-lg sm:max-w-lg sm:rounded-xl sm:p-6"
        >
          <div className="flex items-center gap-3">
            {photoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 rounded-full border border-border object-cover"
                  onError={() => setPhotoFailed(true)}
                />
              </>
            ) : (
              <span
                aria-hidden="true"
                className="flex size-14 items-center justify-center rounded-full border border-border bg-muted text-lg font-semibold"
              >
                {initial}
              </span>
            )}
            <div className="min-w-0">
              <h2 id={titleId} className="truncate text-lg font-semibold">
                {politician.name}
              </h2>
              <p id={descriptionId} className="truncate text-sm text-muted-foreground">
                {politician.role ?? "Cargo não informado"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Dê uma nota de 1 a 5 em cada competência. Use as setas do teclado para alterar a nota.
            Esc fecha o diálogo.
          </p>
          {invalidProfile ? (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {invalidProfile}
            </p>
          ) : null}

          <ol className="mt-4 space-y-3">
            {CRITERIA.map((criterion) => {
              const selected = scores[criterion.key];
              const message = errors[criterion.key];
              const visible = message !== undefined && (attempted || touched[criterion.key] === true);
              const errorId = `${criterion.key}-error`;
              const labelId = `${criterion.key}-label`;

              return (
                <li key={criterion.key} className="rounded-lg border border-border p-3">
                  <p id={labelId} className="text-sm font-medium">
                    {criterion.label}
                  </p>
                  <div
                    role="radiogroup"
                    aria-labelledby={labelId}
                    aria-describedby={visible ? errorId : undefined}
                    aria-invalid={visible}
                    className="mt-2 flex flex-wrap gap-1"
                    onBlur={(event) => {
                      const next = event.relatedTarget;
                      if (next instanceof Node && event.currentTarget.contains(next)) {
                        return;
                      }
                      setTouched((current) => ({ ...current, [criterion.key]: true }));
                    }}
                  >
                    {STAR_VALUES.map((star) => {
                      const checked = selected === star;
                      const tabStop = selected === undefined ? star === 1 : checked;
                      return (
                        <button
                          key={star}
                          id={`${criterion.key}-score-${star}`}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          aria-label={`${star} de 5 em ${criterion.label}`}
                          tabIndex={tabStop ? 0 : -1}
                          onClick={() => setScore(criterion.key, star)}
                          onKeyDown={(event) => onStarKeyDown(event, criterion.key, star)}
                          className={`size-10 rounded-md border text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            selected !== undefined && selected >= star
                              ? "border-amber-500 bg-amber-500 text-white"
                              : "border-input bg-background hover:bg-muted"
                          }`}
                        >
                          {star}
                        </button>
                      );
                    })}
                  </div>
                  {visible ? (
                    <p id={errorId} role="alert" className="mt-2 text-sm text-destructive">
                      {message}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>

          {status ? (
            <p role="status" className="mt-4 text-sm">
              {status}
            </p>
          ) : null}
          {children}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Enviando..." : "Enviar avaliação"}
            </Button>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Fechar
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
