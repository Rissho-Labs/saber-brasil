import { NextResponse } from "next/server";
import { getPublicProfiles } from "@/lib/services/profiles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;

  try {
    const profiles = await getPublicProfiles(q);
    return NextResponse.json({ data: profiles });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar perfis públicos" },
      { status: 500 }
    );
  }
}