import { HeroSearch } from "@/components/home/hero-search";
import { KPIStats } from "@/components/home/kpi-stats";
import { FeaturedPoliticians } from "@/components/home/featured-politicians";
import { RecentVotings } from "@/components/home/recent-votings";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero & Busca Central */}
      <HeroSearch />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Indicadores do Governo */}
        <KPIStats />

        {/* Políticos em Destaque */}
        <FeaturedPoliticians />

        {/* Últimas Votações */}
        <RecentVotings />
      </div>
    </main>
  );
}