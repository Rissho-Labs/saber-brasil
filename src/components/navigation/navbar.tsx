import Link from "next/link";
import { Scale } from "lucide-react";
import { NavLinks } from "@/components/navigation/nav-links";
import { NavbarSession } from "@/components/navbar-session";
import { sessionAvatarUrl, sessionName } from "@/lib/auth/session-avatar";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  let email: string | null = null;
  let name: string | null = null;
  let avatarUrl: string | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
    name = sessionName(data.user?.user_metadata);
    avatarUrl = sessionAvatarUrl(data.user?.user_metadata);
  } catch {
    email = null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Scale className="size-5" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-lg font-bold tracking-tight text-foreground">
              SABER <span className="text-primary">Brasil</span>
            </span>
            <span className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
              Transparência &amp; Cidadania
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <NavLinks />
          <NavbarSession name={name} email={email} avatarUrl={avatarUrl} />
        </div>
      </div>
    </header>
  );
}
