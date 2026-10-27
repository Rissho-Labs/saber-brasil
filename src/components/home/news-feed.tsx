import Link from "next/link";
import { ArrowRight, Clock3, Landmark, LineChart, Newspaper, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  publishedLabel: string;
  source: string;
  imageAlt: string;
  Icon: LucideIcon;
  accentClass: string;
}

const NEWS_ITEMS: readonly NewsItem[] = [
  {
    id: "reforma-cesta-basica",
    title:
      "Reforma Tributária e a Cesta Básica: O que muda no preço dos alimentos para a sua família?",
    summary:
      "Entenda a lista oficial de itens com isenção total de impostos e o funcionamento prático da devolução de tributos (cashback) para os lares cadastrados.",
    category: "Resumo Didático",
    readTime: "5 min de leitura",
    publishedLabel: "24 de Outubro",
    source: "Agência Senado",
    imageAlt: "Congresso Nacional em Brasília",
    Icon: Landmark,
    accentClass: "from-emerald-900 to-slate-950",
  },
  {
    id: "teto-emendas",
    title:
      "Comissão de Finanças debate teto das emendas: Entenda a disputa entre Executivo e Legislativo",
    summary:
      "Principais regras definidas pelo STF para garantir rastreabilidade, publicidade e plano de trabalho nas transferências especiais de deputados e senadores.",
    category: "Resumo Didático",
    readTime: "4 min de leitura",
    publishedLabel: "25 de Outubro",
    source: "Consultoria",
    imageAlt: "Comissão e reuniões de debate parlamentar",
    Icon: Users,
    accentClass: "from-amber-900 to-slate-950",
  },
  {
    id: "painel-orcamento",
    title:
      "Onde o Brasil investe: Painel interativo analisa a execução do orçamento federal em 2024",
    summary:
      "Análise gráfica simples demonstrando a divisão real da arrecadação federal entre saúde pública, previdência social, educação básica e amortização da dívida.",
    category: "Resumo Didático",
    readTime: "6 min de leitura",
    publishedLabel: "Hoje às 09:15",
    source: "Dados Abertos",
    imageAlt: "Painel de dados econômicos e gráficos de orçamento",
    Icon: LineChart,
    accentClass: "from-blue-950 to-slate-950",
  },
];

function NewsCover({
  alt,
  Icon,
  accentClass,
}: {
  alt: string;
  Icon: LucideIcon;
  accentClass: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br transition-transform duration-300 group-hover:scale-105",
        accentClass,
      )}
    >
      <Icon className="size-14 text-white/35" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
    </div>
  );
}

export function NewsFeed() {
  return (
    <section aria-labelledby="noticias-heading" id="noticias" className="scroll-mt-24 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
            Jornalismo Explicativo Imparcial
          </p>
          <h2
            id="noticias-heading"
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground"
          >
            <Newspaper className="size-5 text-emerald-700" aria-hidden="true" />
            3. Feed de Notícias Descomplicadas
          </h2>
          <p className="text-sm text-muted-foreground">
            Acontecimentos políticos e econômicos explicados em linguagem simples, precisa e
            direta.
          </p>
        </div>
        <Link
          href="/busca"
          className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 sm:mt-0"
        >
          Ver arquivo completo
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {NEWS_ITEMS.map((item) => (
          <li key={item.id}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
              <div className="relative overflow-hidden">
                <NewsCover alt={item.imageAlt} Icon={item.Icon} accentClass={item.accentClass} />
                <span className="absolute top-3 left-3 rounded border border-white/20 bg-foreground/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-background uppercase backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              <Card className="flex flex-1 flex-col border-0 shadow-none">
                <CardContent className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-base leading-snug font-bold text-foreground transition-colors group-hover:text-emerald-700">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-3.5 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
                      {item.readTime}
                    </span>
                    <span className="text-right">
                      {item.publishedLabel} • {item.source}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
