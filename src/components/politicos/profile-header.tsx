import { Badge } from "@/components/ui/badge";
import { MandateBadge } from "@/components/ui/mandate-badge";
import { cn } from "@/lib/utils";
import { AlertBadge, ProfileStatus, SphereType } from "@/types";

interface ProfileHeaderProps {
  name: string;
  role: string | null;
  sphere: SphereType;
  status: ProfileStatus;
  badge: AlertBadge;
}

const SPHERE_BORDER: Record<SphereType, string> = {
  [SphereType.POLITICA]: "border-green-600",
  [SphereType.JUDICIARIO]: "border-blue-600",
  [SphereType.ACADEMIA]: "border-zinc-300",
  [SphereType.SEGURANCA]: "border-zinc-700",
};

export function ProfileHeader({
  name,
  role,
  sphere,
  status,
  badge,
}: ProfileHeaderProps) {
  const getBadgeVariant = (b: AlertBadge) => {
    switch (b) {
      case AlertBadge.CONDENADO:
      case AlertBadge.CASSADO:
        return "destructive" as const;
      case AlertBadge.INVESTIGADO:
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-card border-2 border-border rounded-xl shadow-xs", SPHERE_BORDER[sphere])}>
      <div className="size-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-foreground shrink-0" aria-hidden="true">
        {name.charAt(0)}
      </div>

      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
            {name}
          </h1>
          {badge !== AlertBadge.NENHUM && (
            <Badge variant={getBadgeVariant(badge)} className="uppercase text-[10px]">
              {badge}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {role ?? "Cargo não informado"}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="outline" className="text-xs">
            Esfera: {sphere}
          </Badge>
          <MandateBadge status={status} />
        </div>
      </div>
    </div>
  );
}