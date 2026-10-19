"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EvaluationModal, type EvaluationPolitician } from "@/components/evaluations/evaluation-modal";
import { Button } from "@/components/ui/button";
import {
  TURNSTILE_SITE_KEY,
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/ui/turnstile-widget";
import type { PoliticalEvaluation } from "@/schemas/politicalEvaluation.schema";

type ApiBody = {
  message?: string;
  error?: string;
};

function readApiBody(value: unknown): ApiBody {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const record = value as Record<string, unknown>;
  return {
    message: typeof record.message === "string" ? record.message : undefined,
    error: typeof record.error === "string" ? record.error : undefined,
  };
}

export function EvaluationPanel({ politician }: { politician: EvaluationPolitician }) {
  const router = useRouter();
  const loginTitleId = useId();
  const loginDescriptionId = useId();
  const loginDialogRef = useRef<HTMLDialogElement>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loginHref = `/login?next=${encodeURIComponent(`/politicos/${politician.id}`)}`;
  const signupHref = `/cadastro?next=${encodeURIComponent(`/politicos/${politician.id}`)}`;

  useEffect(() => {
    const dialog = loginDialogRef.current;
    if (!dialog) {
      return;
    }

    if (loginOpen && !dialog.open) {
      dialog.showModal();
    } else if (!loginOpen && dialog.open) {
      dialog.close();
    }
  }, [loginOpen]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function onSubmit(evaluation: PoliticalEvaluation) {
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      throw new Error("Confirme a verificação anti-bot.");
    }

    let response: Response;
    try {
      response = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...evaluation,
          turnstileToken,
        }),
      });
    } catch {
      throw new Error("Erro de conexão com o servidor.");
    }

    const body = readApiBody(await response.json().catch(() => null));

    if (response.status === 401) {
      setLoginOpen(true);
      return;
    }

    if (!response.ok) {
      turnstileRef.current?.reset();
      throw new Error(body.error ?? "Não foi possível salvar a avaliação.");
    }

    setNotice(body.message ?? "Avaliação registrada.");
    turnstileRef.current?.reset();
    setTurnstileToken(null);
    router.refresh();
  }

  return (
    <section aria-labelledby="evaluation-panel-heading" className="space-y-3">
      <h2 id="evaluation-panel-heading" className="text-xl font-semibold tracking-tight">
        Avaliação cidadã
      </h2>
      <p className="text-sm text-muted-foreground">
        Abra o questionário para dar uma nota de 1 a 5 em cada competência.
      </p>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Avaliar
      </Button>
      <EvaluationModal
        politician={politician}
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={onSubmit}
      >
        <div className="mt-4">
          <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} />
        </div>
      </EvaluationModal>

      <dialog
        ref={loginDialogRef}
        aria-modal="true"
        aria-labelledby={loginTitleId}
        aria-describedby={loginDescriptionId}
        onClose={() => setLoginOpen(false)}
        className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-full max-w-none items-center justify-center border-0 bg-black/50 p-4 text-foreground backdrop:bg-transparent [&:not([open])]:hidden"
      >
        <div className="w-full max-w-md rounded-xl border border-border bg-background p-6">
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
        </div>
      </dialog>

      {notice ? (
        <p
          role="status"
          className="fixed right-4 bottom-4 z-50 max-w-sm rounded-xl border border-slate-200 bg-background px-4 py-3 text-sm shadow-lg dark:border-slate-800"
        >
          {notice}
        </p>
      ) : null}
    </section>
  );
}
