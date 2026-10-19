import { HeroSearch } from "@/components/home/hero-search";
import { SphereSelectionProvider } from "@/components/home/sphere-selection";
import { KPIStats } from "@/components/home/kpi-stats";
import { FeaturedPoliticians } from "@/components/home/featured-politicians";
import { RecentVotings } from "@/components/home/recent-votings";

export default function HomePage() {
  return (
    <SphereSelectionProvider>
      <main className="min-h-screen bg-background">
        <HeroSearch />

        <div className="mx-auto max-w-6xl space-y-12 px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <KPIStats />

          <FeaturedPoliticians />

          <RecentVotings />
        </div>
      </main>
    </SphereSelectionProvider>
  );
}