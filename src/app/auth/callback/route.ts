import { NextResponse } from "next/server";
import { z } from "zod";
import { safeNextPath } from "@/lib/auth/safe-next-path";
import { createClient } from "@/lib/supabase/server";

const callbackQuerySchema = z.object({
  code: z.string().trim().min(1).optional(),
  next: z.string().optional(),
});

function loginRedirect(origin: string, nextPath: string) {
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("next", nextPath);
  loginUrl.searchParams.set("error", "google");
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = callbackQuerySchema.safeParse({
    code: url.searchParams.get("code") ?? undefined,
    next: url.searchParams.get("next") ?? undefined,
  });
  const nextPath = safeNextPath(parsed.success ? parsed.data.next : undefined);

  if (!parsed.success || !parsed.data.code) {
    return loginRedirect(url.origin, nextPath);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(parsed.data.code);

  if (error) {
    return loginRedirect(url.origin, nextPath);
  }

  return NextResponse.redirect(new URL(nextPath, url.origin));
}
