import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchCategory } from "@/components/busca/search-category-tabs";
import { MandateStatus, SphereType } from "@/types";

const SPHERE_OPTIONS: { value: SphereType; label: string }[] = [
  { value: SphereType.POLITICA, label: "Política" },
  { value: SphereType.JUDICIARIO, label: "Judiciário" },
  { value: SphereType.ACADEMIA, label: "Academia" },
  { value: SphereType.SEGURANCA, label: "Segurança" },
];

const STATUS_OPTIONS: { value: MandateStatus; label: string }[] = [
  { value: MandateStatus.EM_MANDATO, label: "Em Exercício" },
  { value: MandateStatus.EX_MANDATO, label: "Ex-mandatários" },
  { value: MandateStatus.CANDIDATO, label: "Candidatos" },
];

export function SearchFilters({
  query,
  sphere,
  status,
  category,
}: {
  query: string;
  sphere?: SphereType;
  status?: MandateStatus;
  category: SearchCategory;
}) {
  return (
    <form
      action="/busca"
      method="GET"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_12rem_auto] lg:items-end"
    >
      <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
        <label htmlFor="search-q" className="text-sm font-medium">
          Nome
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="search-q"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Busque por nome..."
            className="h-11 bg-background pl-9"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="search-sphere" className="text-sm font-medium">
          Esfera
        </label>
        <select
          id="search-sphere"
          name="sphere"
          defaultValue={sphere ?? ""}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todas as esferas</option>
          {SPHERE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="search-status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="search-status"
          name="status"
          defaultValue={status ?? ""}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todos</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <input type="hidden" name="categoria" value={category} />
      <Button type="submit" className="h-11">
        Buscar
      </Button>
    </form>
  );
}
