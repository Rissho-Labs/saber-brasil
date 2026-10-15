"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signupSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().regex(EMAIL_PATTERN),
    password: z.string().min(8).max(72),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
  });

type SignupField = "fullName" | "email" | "password" | "confirmPassword";

const FIELD_MESSAGES: Record<SignupField, string> = {
  fullName: "Informe seu nome completo.",
  email: "Informe um e-mail válido.",
  password: "A senha precisa ter entre 8 e 72 caracteres.",
  confirmPassword: "A confirmação precisa ser idêntica à senha.",
};

function fieldErrors(error: z.ZodError): Partial<Record<SignupField, string>> {
  const messages: Partial<Record<SignupField, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      field === "fullName" ||
      field === "email" ||
      field === "password" ||
      field === "confirmPassword"
    ) {
      messages[field] = FIELD_MESSAGES[field];
    }
  }

  return messages;
}

export function SignupForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<SignupField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setPending(true);

    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.fullName },
      },
    });

    if (error || (data.user?.identities && data.user.identities.length === 0)) {
      setPending(false);
      setFormError(
        error?.message.toLowerCase().includes("password")
          ? "A senha não atende às regras da conta."
          : "Não foi possível criar a conta. Se o e-mail já existir, entre."
      );
      return;
    }

    if (data.session) {
      router.push(nextPath);
      router.refresh();
      return;
    }

    const verifyHref = `/verificar-email?email=${encodeURIComponent(parsed.data.email)}&next=${encodeURIComponent(nextPath)}`;
    router.push(verifyHref);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="signup-name" className="text-sm font-medium">
          Nome completo
        </label>
        <input
          id="signup-name"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          aria-invalid={errors.fullName ? true : undefined}
          aria-describedby={errors.fullName ? "signup-name-error" : undefined}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {errors.fullName ? (
          <p id="signup-name-error" className="text-sm text-destructive">
            {errors.fullName}
          </p>
        ) : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="signup-email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "signup-email-error" : undefined}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {errors.email ? (
          <p id="signup-email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="signup-password" className="text-sm font-medium">
          Senha
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "signup-password-error" : undefined}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {errors.password ? (
          <p id="signup-password-error" className="text-sm text-destructive">
            {errors.password}
          </p>
        ) : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="signup-confirm" className="text-sm font-medium">
          Confirmar senha
        </label>
        <input
          id="signup-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={errors.confirmPassword ? "signup-confirm-error" : undefined}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {errors.confirmPassword ? (
          <p id="signup-confirm-error" className="text-sm text-destructive">
            {errors.confirmPassword}
          </p>
        ) : null}
      </div>
      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Criando conta..." : "Criar conta"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href={loginHref} className="font-medium text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
