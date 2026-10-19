import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndicatorCompare } from "@/components/indicadores/indicator-compare";
import type { PublicIndicator } from "@/lib/indicadores/catalog";

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
}

export function IndicatorCard({ item }: { item: PublicIndicator }) {
  return (
    <Card>
      <CardHeader className="gap-2 p-4 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-snug">{item.title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Fonte Pública Oficial</Badge>
            {item.audit ? <Badge variant="outline">Auditoria / Terceiro Setor</Badge> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        <p className="text-2xl font-bold tracking-tight">{item.value}</p>
        <p className="text-sm text-muted-foreground">{item.trend}</p>
        <time dateTime={item.updatedAt} className="block text-xs text-muted-foreground">
          Atualizado em {formatDate(item.updatedAt)}
        </time>
        <IndicatorCompare official={item.official} audit={item.audit} />
      </CardContent>
    </Card>
  );
}
