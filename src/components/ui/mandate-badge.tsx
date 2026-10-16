import { cn } from "@/lib/utils";
import { MandateStatus, mandateStatusFromProfile, ProfileStatus } from "@/types";

const MANDATE_BADGE: Record<MandateStatus, { label: string; className: string }> = {
  [MandateStatus.EM_MANDATO]: {
    label: "Em Exercício",
    className: "border-green-600/30 bg-green-50 text-green-800",
  },
  [MandateStatus.EX_MANDATO]: {
    label: "Ex-mandatário",
    className: "border-slate-300 bg-slate-100 text-slate-700",
  },
  [MandateStatus.CANDIDATO]: {
    label: "Candidato",
    className: "border-amber-300 bg-amber-50 text-amber-900",
  },
};

export function MandateBadge({
  status,
}: {
  status: ProfileStatus | MandateStatus | null | undefined;
}) {
  const mandate =
    status === MandateStatus.EM_MANDATO ||
    status === MandateStatus.EX_MANDATO ||
    status === MandateStatus.CANDIDATO
      ? status
      : mandateStatusFromProfile(status);
  const meta = MANDATE_BADGE[mandate];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}
