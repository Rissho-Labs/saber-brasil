import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { getFeaturedProfilesBySphere } from "@/lib/services/profiles";

export async function FeaturedPoliticians() {
  const profilesBySphere = await getFeaturedProfilesBySphere();
  return <FeaturedCarousel profilesBySphere={profilesBySphere} />;
}
