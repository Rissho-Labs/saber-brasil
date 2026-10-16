"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TURNSTILE_SITE_KEY, TurnstileWidget, TurnstileWidgetHandle } from "@/components/ui/turnstile-widget";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import {
  CompetencyCriterion,
  CompetencyScores,
  StarScore,
} from "@/types";

const CRITERIA: {
  key: CompetencyCriterion;
  label: string;
  explanation: string;
}[] = [
  {
    key: CompetencyCriterion.POSTURE,
    label: "Postura",
    explanation: "Avalia o comportamento e a serenidade do representante nas sessões públicas.",
  },
  {
    key: CompetencyCriterion.DECORUM,
    label: "Decoro",
    explanation: "Avalia o respeito ao regimento e o tratamento dado aos pares.",
  },
  {
    key: CompetencyCriterion.DISCURSIVE_COHERENCE,
    label: "Coerência Discursiva",
    explanation: "Avalia se o discurso público permanece alinhado ao voto e às posições registradas.",
  },
  {
    key: CompetencyCriterion.ARTICULATION,
    label: "Articulação Política",
    explanation: "Avalia a capacidade de diálogo, negociação e construção de alianças.",
  },
  {
    key: CompetencyCriterion.TRANSPARENCY,
    label: "Transparência",
    explanation: "Avalia a clareza com que o representante presta contas de atos e recursos.",
  },
  {
    key: CompetencyCriterion.ACCOUNTABILITY,
    label: "Accountability",
    explanation: "Avalia se o representante assume responsabilidade pelos próprios atos.",
  },
  {
    key: CompetencyCriterion.RESPONSIVENESS,
    label: "Responsividade",
    explanation: "Avalia a atenção e a resposta às demandas diretas da população.",
  },
  {
    key: CompetencyCriterion.ETHICAL_CONDUCT,
    label: "Conduta Ética",
    explanation: "Avalia a integridade da conduta na vida pública.",
  },
  {
    key: CompetencyCriterion.PUBLIC_COMMUNICATION,
    label: "Comunicação Pública",
    explanation: "Avalia a qualidade e a clareza da informação prestada ao público.",
  },
  {
    key: CompetencyCriterion.INSTITUTIONAL_COMMITMENT,
    label: "Compromisso Institucional",
    explanation: "Avalia a defesa das instituições democráticas e das regras do mandato.",
  },
];

const STAR_VALUES: StarScore[] = [1, 2, 3, 4, 5];

interface EvaluationApiResponse {
  message?: string;
  error?: string;
}

function isStarScore(value: StarScore | undefined): value is StarScore {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

function isCompleteScores(
  scores: Partial<CompetencyScores>
): scores is CompetencyScores {
  return CRITERIA.every((criterion) => isStarScore(scores[criterion.key]));
}

function isEvaluationApiResponse(value: unknown): value is EvaluationApiResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const messageOk = record.message === undefined || typeof record.message === "string";
  const errorOk = record.error === undefined || typeof record.error === "string";
  return messageOk && errorOk;
}

export function EvaluationModal({
  profileId,
  initialScores,
  triggerLabel = "Avaliar representante",
}: {
  profileId: string;
  initialScores?: CompetencyScores;
  triggerLabel?: string;
}) {
  const router = useRouter();
  const titleId = useId();
  const descriptionId = useId();
  const loginTitleId = useId();
  const loginDescriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const loginDialogRef = useRef<HTMLDialogElement>(null);
  const [scores, setScores] = useState<Partial<CompetencyScores>>(initialScores ?? {});
  const [openHints, setOpenHints] = useState<Partial<Record<CompetencyCriterion, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const loginHref = `/login?next=${encodeURIComponent(`/politicos/${profileId}`)}`;
  const signupHref = `/cadastro?next=${encodeURIComponent(`/politicos/${profileId}`)}`;

  const ratedValues = CRITERIA.map((criterion) => scores[criterion.key]).filter(isStarScore);
  const average =
    ratedValues.length === 0
      ? null
      : ratedValues.reduce((total, value) => total + value, 0) / ratedValues.length;
  const complete = isCompleteScores(scores);

  function openLoginPrompt() {
    loginDialogRef.current?.showModal();
  }

  async function openDialog() {
    setIsCheckingSession(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        openLoginPrompt();
        return;
      }
      dialogRef.current?.showModal();
    } catch {
      openLoginPrompt();
    } finally {
      setIsCheckingSession(false);
    }
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function setScore(criterion: CompetencyCriterion, score: StarScore) {
    setScores((current) => ({ ...current, [criterion]: score }));
  }

  function onStarKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    criterion: CompetencyCriterion,
    star: StarScore
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
      document.getElementById(`${criterion}-star-${nextStar}`)?.focus();
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isCompleteScores(scores)) {
      setFeedback("Avalie os 10 critérios antes de enviar.");
      return;
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setFeedback("Confirme a verificação anti-bot.");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payload: { profileId: string; scores: CompetencyScores; turnstileToken: string | null } = {
      profileId,
      scores,
      turnstileToken,
    };

    try {
      const response = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body: unknown = await response.json();
      const data = isEvaluationApiResponse(body) ? body : {};

      if (response.status === 401) {
        dialogRef.current?.close();
        openLoginPrompt();
        return;
      }

      if (response.ok) {
        setFeedback(data.message ?? "Avaliação registrada com sucesso.");
        router.refresh();
      } else {
        setFeedback(data.error ?? "Erro ao salvar avaliação.");
      }
      turnstileRef.current?.reset();
    } catch {
      setFeedback("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="evaluation-trigger-heading" className="space-y-3">
      <h2 id="evaluation-trigger-heading" className="text-xl font-semibold tracking-tight">
        Avaliação cidadã
      </h2>
      <p className="text-sm text-muted-foreground">
        Abra o questionário para dar uma nota de 1 a 5 em cada competência.
      </p>
      <Button type="button" onClick={openDialog} disabled={isCheckingSession}>
        {isCheckingSession ? "Verificando sessão..." : triggerLabel}
      </Button>

      <dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="w-[min(100%-2rem,44rem)] max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background p-6 text-foreground backdrop:bg-black/50"
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1">
            <h2 id={titleId} className="text-lg font-semibold">
              Questionário de 10 competências
            </h2>
            <p id={descriptionId} className="text-sm text-muted-foreground">
              Cada critério vale de 1 a 5 estrelas. Use as setas do teclado para
              alterar a nota. Pressione Esc para fechar.
            </p>
          </div>

          <ol className="space-y-4">
            {CRITERIA.map((criterion) => {
              const selected = scores[criterion.key];
              const hintOpen = openHints[criterion.key] === true;
              const hintId = `${criterion.key}-hint`;
              const labelId = `${criterion.key}-label`;

              return (
                <li key={criterion.key} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p id={labelId} className="text-sm font-medium">
                      {criterion.label}
                    </p>
                    <button
                      type="button"
                      className="rounded-md px-1 text-base leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-expanded={hintOpen}
                      aria-controls={hintId}
                      aria-label={`Explicar o critério ${criterion.label}`}
                      onClick={() =>
                        setOpenHints((current) => ({
                          ...current,
                          [criterion.key]: !hintOpen,
                        }))
                      }
                    >
                      <span aria-hidden="true">ℹ️</span>
                    </button>
                  </div>
                  <p id={hintId} className={hintOpen ? "mt-1 text-xs text-muted-foreground" : "sr-only"}>
                    {criterion.explanation}
                  </p>
                  <div
                    role="radiogroup"
                    aria-labelledby={labelId}
                    aria-describedby={hintId}
                    className="mt-2 flex gap-1"
                  >
                    {STAR_VALUES.map((star) => {
                      const checked = selected === star;
                      const tabStop = selected === undefined ? star === 1 : checked;
                      return (
                        <button
                          key={star}
                          id={`${criterion.key}-star-${star}`}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          aria-label={`${star} de 5 estrelas em ${criterion.label}`}
                          tabIndex={tabStop ? 0 : -1}
                          onClick={() => setScore(criterion.key, star)}
                          onKeyDown={(event) => onStarKeyDown(event, criterion.key, star)}
                          className={`size-8 rounded border text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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
                </li>
              );
            })}
          </ol>

          <p aria-live="polite" className="text-sm font-medium">
            {average === null
              ? "Média geral: aguardando a primeira nota."
              : `Média geral: ${average.toFixed(1)} de 5 (${ratedValues.length} de 10 critérios).`}
          </p>
          <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} />
          {feedback ? <p role="status" className="text-sm">{feedback}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!complete || isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar avaliação"}
            </Button>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Fechar
            </Button>
          </div>
        </form>
      </dialog>

      <dialog
        ref={loginDialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={loginTitleId}
        aria-describedby={loginDescriptionId}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="w-[min(100%-2rem,28rem)] rounded-xl border border-border bg-background p-6 text-foreground backdrop:bg-black/50"
      >
        <h2 id={loginTitleId} className="text-lg font-semibold">
          Entre para avaliar
        </h2>
        <p id={loginDescriptionId} className="mt-2 text-sm text-muted-foreground">
          Cada cidadão autenticado registra uma avaliação por representante. Entre para continuar.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href={loginHref}>Entrar</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={signupHref}>Criar conta</Link>
          </Button>
          <Button type="button" variant="outline" onClick={() => loginDialogRef.current?.close()}>
            Fechar
          </Button>
        </div>
      </dialog>
    </section>
  );
}
