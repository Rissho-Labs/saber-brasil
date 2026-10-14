import { NextResponse } from "next/server";
import { runSystemAudit } from "@/lib/services/health";

export async function GET() {
  const executedAt = new Date().toISOString();

  try {
    const report = await runSystemAudit();
    return NextResponse.json({ ...report, executedAt });
  } catch {
    return NextResponse.json(
      {
        error: "System health check failed.",
        executedAt,
      },
      { status: 500 }
    );
  }
}
