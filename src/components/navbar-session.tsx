"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function NavbarSession({
  name,
  email,
}: {
  name: string | null;
  email: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  if (!email) {
    return (
      <Link
        href="/login"
        className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        Entrar
      </Link>
    );
  }

  const label = name && name !== "Nome não informado" ? name : email;
  const initial = label.charAt(0).toUpperCase() || "?";

  async function onSignOut() {
    setPending(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Conta de ${label}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span
          aria-hidden="true"
          className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold"
        >
          {initial}
        </span>
        <span className="max-w-32 truncate">{label}</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-border bg-background p-1 shadow-md"
        >
          <Link
            href="/perfil"
            role="menuitem"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            Meu Perfil
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50"
            disabled={pending}
            onClick={onSignOut}
          >
            {pending ? "Saindo..." : "Sair"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
