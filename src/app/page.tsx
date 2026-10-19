import { HeroSearch } from "@/components/home/hero-search";
import { SphereModals } from "@/components/home/sphere-modals";
import { SphereSelectionProvider } from "@/components/home/sphere-selection";
import { KPIStats } from "@/components/home/kpi-stats";
import { FeaturedPoliticians } from "@/components/home/featured-politicians";
import { RecentVotings } from "@/components/home/recent-votings";

export default function HomePage() {
  return (
    <SphereSelectionProvider>
      <main className="min-h-screen bg-background">
        <HeroSearch />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          <SphereModals />

          <KPIStats />

          <FeaturedPoliticians />

          <RecentVotings />
        </div>
      </main>
    </SphereSelectionProvider>
  );
}