"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function firstName(label: string): string {
  const [name] = label.trim().split(/\s+/);
  return name || label;
}

export function NavbarSession({
  name,
  email,
  avatarUrl,
}: {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node) || !rootRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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
  const displayName = firstName(label);
  const initial = displayName.charAt(0).toUpperCase() || "?";
  const showImage = Boolean(avatarUrl) && !imageFailed;

  async function onSignOut() {
    setPending(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2.5 rounded-full border border-foreground/15 bg-muted/50 py-1 pl-3 pr-1 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Conta de ${label}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="max-w-28 truncate">{displayName}</span>
        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground/10 text-sm font-semibold ring-1 ring-foreground/10">
          {showImage ? (
            // OAuth avatar hosts are not a fixed image allow-list.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl ?? undefined}
              alt=""
              referrerPolicy="no-referrer"
              className="size-9 rounded-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span aria-hidden="true">{initial}</span>
          )}
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-2 w-44 rounded-lg border border-border bg-background p-1 shadow-md sm:left-auto sm:right-0"
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
