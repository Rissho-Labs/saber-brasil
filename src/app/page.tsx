import { HeroSearch } from "@/components/home/hero-search";
import { SphereSelectionProvider } from "@/components/home/sphere-selection";
import { KPIStats } from "@/components/home/kpi-stats";
import { FeaturedPoliticians } from "@/components/home/featured-politicians";
import { EducationalTrails } from "@/components/home/educational-trails";
import { RecentVotings } from "@/components/home/recent-votings";
import { NewsFeed } from "@/components/home/news-feed";

export default function HomePage() {
  return (
    <SphereSelectionProvider>
      <main className="min-h-screen bg-muted/40">
        <HeroSearch />

        <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
          <FeaturedPoliticians />

          <EducationalTrails />

          <KPIStats />

          <RecentVotings />

          <NewsFeed />
        </div>
      </main>
    </SphereSelectionProvider>
  );
}
