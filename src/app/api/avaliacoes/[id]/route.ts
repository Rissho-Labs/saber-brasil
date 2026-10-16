import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const idSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const parsedId = idSchema.safeParse(params.id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "Identificador inválido." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return NextResponse.json({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  const { data: deleted, error: deleteError } = await supabase
    .from("user_evaluations")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", data.user.id)
    .select("id");

  if (deleteError) {
    return NextResponse.json({ error: "Não foi possível excluir a avaliação." }, { status: 500 });
  }

  if (!deleted || deleted.length === 0) {
    return NextResponse.json({ error: "Avaliação não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ message: "Avaliação excluída." });
}
