"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { AVATAR_CHANGE_EVENT } from "@/lib/auth/session-avatar";
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
  const [currentAvatar, setCurrentAvatar] = useState(avatarUrl);

  useEffect(() => {
    setCurrentAvatar(avatarUrl);
    setImageFailed(false);
  }, [avatarUrl]);

  useEffect(() => {
    function onAvatar(event: Event) {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const next = event.detail;
      if (typeof next === "string" || next === null) {
        setCurrentAvatar(next);
        setImageFailed(false);
      }
    }

    window.addEventListener(AVATAR_CHANGE_EVENT, onAvatar);
    return () => window.removeEventListener(AVATAR_CHANGE_EVENT, onAvatar);
  }, []);

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
  const showImage = Boolean(currentAvatar) && !imageFailed;

  async function onSignOut() {
    setPending(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-background py-1 pl-3 pr-1 text-sm font-medium text-foreground shadow-lg transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-slate-800 dark:hover:bg-slate-800"
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
              src={currentAvatar ?? undefined}
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
          className="absolute right-0 z-20 mt-2 w-48 space-y-1 rounded-xl border border-slate-200 bg-background p-1.5 shadow-lg dark:border-slate-800"
        >
          <Link
            href="/perfil"
            role="menuitem"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen(false)}
          >
            <User className="size-4 shrink-0" aria-hidden />
            Meu Perfil
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            disabled={pending}
            onClick={onSignOut}
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            {pending ? "Saindo..." : "Sair"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
