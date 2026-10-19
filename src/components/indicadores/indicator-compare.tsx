"use client";

import { useId, useState } from "react";
import type { IndicatorSource } from "@/lib/indicadores/catalog";

export function IndicatorCompare({
  official,
  audit,
}: {
  official: IndicatorSource;
  audit: IndicatorSource | null;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {open ? "Ocultar contraste" : "Comparar fontes"}
      </button>
      {open ? (
        <div id={panelId} className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold">Fonte Pública Oficial</p>
            <p className="mt-1 text-sm font-medium">{official.name}</p>
            <p className="text-sm">{official.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{official.note}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold">Auditoria / Terceiro Setor</p>
            {audit ? (
              <>
                <p className="mt-1 text-sm font-medium">{audit.name}</p>
                <p className="text-sm">{audit.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{audit.note}</p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Sem auditoria independente neste catálogo.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
