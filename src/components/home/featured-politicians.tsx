import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const featuredMock = [
  {
    id: "politico-1",
    name: "Mariana Silva",
    role: "Deputada Federal",
    partyUF: "PL / SP",
    carismaRating: 4.8,
    gestaoScore: 92,
  },
  {
    id: "politico-2",
    name: "Carlos Eduardo",
    role: "Senador",
    partyUF: "PT / RJ",
    carismaRating: 4.5,
    gestaoScore: 88,
  },
  {
    id: "politico-3",
    name: "Ana Beatriz",
    role: "Deputada Federal",
    partyUF: "NOVO / MG",
    carismaRating: 4.7,
    gestaoScore: 95,
  },
];

export function FeaturedPoliticians() {
  return (
    <section aria-labelledby="featured-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="featured-heading" className="text-xl font-bold tracking-tight">
            Representantes em Destaque
          </h2>
          <p className="text-sm text-muted-foreground">
            Exemplo de perfis monitorados (dados ilustrativos)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredMock.map((politician) => (
          <Link key={politician.id} href={`/politicos/${politician.id}`} className="block group">
            <Card className="h-full transition-colors group-hover:border-foreground/30">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold" aria-hidden="true">
                  {politician.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold truncate group-hover:underline">
                    {politician.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {politician.role} • {politician.partyUF}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-xs pt-2">
                <div className="flex items-center gap-1 text-amber-500 font-medium" aria-label={`Avaliação do público: ${politician.carismaRating} de 5 estrelas`}>
                  <Star className="size-4 fill-amber-500" aria-hidden="true" />
                  <span>{politician.carismaRating.toFixed(1)}</span>
                </div>
                <Badge variant="outline">Gestão: {politician.gestaoScore}/100</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}