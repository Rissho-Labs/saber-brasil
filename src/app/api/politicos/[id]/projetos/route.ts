import { NextResponse } from "next/server";
import { getProjectsByProfileId } from "@/lib/services/projects";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const projects = await getProjectsByProfileId(id);
    return NextResponse.json({ data: projects });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível carregar os projetos de lei deste perfil." },
      { status: 500 }
    );
  }
}
