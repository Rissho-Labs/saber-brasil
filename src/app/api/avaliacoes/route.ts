import { NextResponse } from "next/server";
import { saveUserEvaluation } from "@/lib/services/evaluations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profileId, scores } = body;

    if (!profileId || !scores) {
      return NextResponse.json(
        { error: "Parâmetros 'profileId' e 'scores' são obrigatórios." },
        { status: 400 }
      );
    }

    const result = await saveUserEvaluation(profileId, scores);
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar avaliação" },
      { status: 500 }
    );
  }
}