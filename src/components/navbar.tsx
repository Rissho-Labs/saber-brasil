import Link from "next/link";
import { Scale } from "lucide-react";
import { NavbarSession } from "@/components/navbar-session";
import { createClient } from "@/lib/supabase/server";

function readMetadataString(metadata: unknown, key: string): string | null {
  if (typeof metadata !== "object" || metadata === null || !(key in metadata)) {
    return null;
  }

  const value = Object.getOwnPropertyDescriptor(metadata, key)?.value;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function sessionName(metadata: unknown): string | null {
  return readMetadataString(metadata, "full_name");
}

function sessionAvatar(metadata: unknown): string | null {
  const avatar = readMetadataString(metadata, "avatar_url") ?? readMetadataString(metadata, "picture");
  if (!avatar || !avatar.startsWith("https://")) {
    return null;
  }

  return avatar;
}

export async function Navbar() {
  let email: string | null = null;
  let name: string | null = null;
  let avatarUrl: string | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
    name = sessionName(data.user?.user_metadata);
    avatarUrl = sessionAvatar(data.user?.user_metadata);
  } catch {
    email = null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Scale className="size-6 shrink-0 text-foreground" aria-hidden />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-lg font-semibold tracking-tight text-foreground">
              SABER Brasil
            </span>
            <span className="truncate text-sm text-muted-foreground">
              Transparência real para quem quer decidir.
            </span>
          </span>
        </Link>
        <NavbarSession name={name} email={email} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}