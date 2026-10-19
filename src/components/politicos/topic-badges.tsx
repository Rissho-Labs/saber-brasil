import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TOPICS = [
  {
    tag: "#Saúde",
    description: "Engajamento excepcional em saúde pública.",
    metal: "Diamante",
    className: "border-cyan-300/80 bg-cyan-50 text-cyan-950",
    gemClassName: "from-cyan-200 via-sky-100 to-cyan-400 text-cyan-900",
  },
  {
    tag: "#Educação",
    description: "Alta atuação em pautas educacionais.",
    metal: "Prata",
    className: "border-zinc-300 bg-zinc-50 text-zinc-800",
    gemClassName: "from-zinc-100 via-white to-zinc-300 text-zinc-700",
  },
  {
    tag: "#Segurança",
    description: "Forte participação em segurança.",
    metal: "Ouro",
    className: "border-amber-300 bg-amber-50 text-amber-950",
    gemClassName: "from-amber-200 via-yellow-100 to-amber-400 text-amber-900",
  },
  {
    tag: "#Economia",
    description: "Atuação regular em economia.",
    metal: "Bronze",
    className: "border-orange-800/30 bg-orange-50 text-orange-950",
    gemClassName: "from-orange-200 via-amber-100 to-orange-400 text-orange-950",
  },
] as const;

function TopicGem({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-gradient-to-br shadow-inner",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5">
        <path d="M12 2.5 19.5 9.2 12 21.5 4.5 9.2 12 2.5Z" fill="currentColor" />
        <path d="M12 2.5 8.2 9.2h7.6L12 2.5Z" fill="white" opacity="0.55" />
      </svg>
    </span>
  );
}

export function TopicBadges() {
  return (
    <section aria-labelledby="topic-badges-heading" className="space-y-4">
      <div className="space-y-1">
        <h2 id="topic-badges-heading" className="text-xl font-semibold tracking-tight">
          Gamified Badges / Top Topics (Ativo Legislativo)
        </h2>
        <p className="text-sm text-muted-foreground">
          Temas com maior presença ilustrativa neste perfil. Os metais seguem a mesma escala
          visual das gemas de relevância.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map((topic) => (
          <li key={topic.tag}>
            <Card className={cn("h-full border", topic.className)}>
              <CardContent className="flex h-full flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <TopicGem className={topic.gemClassName} />
                  <div>
                    <p className="text-sm font-semibold">{topic.tag}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">
                      {topic.metal}
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{topic.description}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
