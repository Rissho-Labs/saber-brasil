import { Badge } from "@/components/ui/badge";
import type { CastVote } from "@/lib/search/catalog";

const VOTE_CLASS: Record<CastVote, string> = {
  "A favor": "border-transparent bg-emerald-600 text-white",
  Contra: "border-transparent bg-red-600 text-white",
  "Abstenção": "",
};

export function VoteBadge({ vote }: { vote: CastVote }) {
  return (
    <Badge variant={vote === "Abstenção" ? "outline" : "default"} className={VOTE_CLASS[vote]}>
      {vote}
    </Badge>
  );
}
