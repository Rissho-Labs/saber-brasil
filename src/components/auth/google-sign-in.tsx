"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth/social-login";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-4">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.083 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export function GoogleSignIn({
  nextPath,
  disabled = false,
  initialError = null,
  onPendingChange,
}: {
  nextPath: string;
  disabled?: boolean;
  initialError?: string | null;
  onPendingChange?: (pending: boolean) => void;
}) {
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  async function onClick() {
    if (lock.current || disabled) {
      return;
    }

    lock.current = true;
    setPending(true);
    setError(null);
    onPendingChange?.(true);

    const result = await signInWithGoogle(
      createBrowserSupabaseClient(),
      window.location.origin,
      nextPath,
    );

    if (!result.ok) {
      lock.current = false;
      setPending(false);
      setError(result.message);
      onPendingChange?.(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={disabled || pending}
        aria-busy={pending}
        onClick={onClick}
      >
        <GoogleIcon />
        {pending ? "Redirecionando..." : "Continuar com Google"}
      </Button>
      <div className="flex items-center gap-3" role="separator">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou continue com e-mail</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
