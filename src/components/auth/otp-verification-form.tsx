"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "").slice(0, OTP_LENGTH);
}

export function OtpVerificationForm({
  email,
  nextPath,
}: {
  email: string;
  nextPath: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const cadastroHref = `/cadastro?next=${encodeURIComponent(nextPath)}`;

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = digitsOnly(code);

    if (token.length !== OTP_LENGTH) {
      setError("Digite os 6 dígitos do e-mail.");
      return;
    }

    setPending(true);
    setError(null);
    setInfo(null);

    const supabase = createBrowserSupabaseClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (verifyError) {
      setPending(false);
      setError("Código inválido ou expirado. Peça um novo código e tente de novo.");
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  async function resendCode() {
    setError(null);
    setInfo(null);

    const supabase = createBrowserSupabaseClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError("Não foi possível reenviar o código agora.");
      return;
    }

    setSecondsLeft(RESEND_SECONDS);
    setInfo("Enviamos outro código para o seu e-mail.");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Confirme seu e-mail</h1>
        <p className="text-sm text-muted-foreground">
          Digite o código de 6 dígitos enviado para <span className="font-medium text-foreground">{email}</span>.
        </p>
      </div>
      <div className="w-full space-y-2">
        <label htmlFor="otp-code" className="text-sm font-medium">
          Código de verificação
        </label>
        <input
          id="otp-code"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          required
          maxLength={OTP_LENGTH}
          pattern="[0-9]{6}"
          value={code}
          aria-label="Código de verificação de 6 dígitos"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "otp-error" : "otp-hint"}
          onChange={(event) => {
            setCode(digitsOnly(event.target.value));
            setError(null);
          }}
          className="w-full rounded-xl border border-input bg-background px-4 py-5 text-center font-mono text-3xl tracking-[0.5em] text-foreground sm:text-4xl"
        />
        <p id="otp-hint" className="text-xs text-muted-foreground">
          Exatamente 6 dígitos.
        </p>
      </div>
      {error ? (
        <p id="otp-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {info ? (
        <p role="status" className="text-sm text-muted-foreground">
          {info}
        </p>
      ) : null}
      <Button type="submit" disabled={pending || code.length !== OTP_LENGTH} className="w-full">
        {pending ? "Verificando..." : "Confirmar código"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={secondsLeft > 0}
        onClick={resendCode}
      >
        {secondsLeft > 0 ? `Reenviar código em ${secondsLeft}s` : "Reenviar código"}
      </Button>
      <Link href={cadastroHref} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Voltar ao cadastro
      </Link>
    </form>
  );
}
