import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicationSearchItem, VotingSearchItem } from "@/lib/search/catalog";

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
}

const VOTING_BADGE: Record<VotingSearchItem["status"], "default" | "secondary" | "outline"> = {
  Aprovado: "default",
  "Em pauta": "secondary",
  "Em tramitação": "outline",
};

export function VotingResultCard({ item }: { item: VotingSearchItem }) {
  return (
    <Card>
      <CardHeader className="gap-2 p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm font-semibold leading-snug">{item.code}</CardTitle>
          <Badge variant={VOTING_BADGE[item.status]}>{item.status}</Badge>
        </div>
        <p className="text-sm font-medium text-foreground">{item.title}</p>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <time dateTime={item.date} className="block text-xs text-muted-foreground">
          {formatDate(item.date)}
        </time>
      </CardContent>
    </Card>
  );
}

export function PublicationResultCard({ item }: { item: PublicationSearchItem }) {
  return (
    <Card>
      <CardHeader className="gap-2 p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm font-semibold leading-snug">{item.title}</CardTitle>
          <Badge variant="outline">{item.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <p className="text-sm text-muted-foreground">{item.summary}</p>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {item.sourceLabel}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
