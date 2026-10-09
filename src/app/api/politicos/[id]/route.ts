import { NextResponse } from "next/server";
import { getPublicProfileById } from "@/lib/services/profiles";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const profile = await getPublicProfileById(id);

    if (!profile) {
      return NextResponse.json(
        { error: "Representante não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: profile });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}