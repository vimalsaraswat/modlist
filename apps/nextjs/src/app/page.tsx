import CallToAction from "./_components/home/call-to-action";
import CategoryShowcase from "./_components/home/category-showcase";
import CommunitySection from "./_components/home/community-section";
import FeaturedListings from "./_components/home/featured-listings";
import Hero from "./_components/home/hero";
import HowItWorks from "./_components/home/how-it-works";
import LocationFeed from "./_components/home/location-feed";

export default function CarPartsMarketplace() {
  return (
    <div className="min-h-screen">
      <Hero />
      <CategoryShowcase />
      <FeaturedListings />
      <HowItWorks />
      <CommunitySection />
      <LocationFeed />
      <CallToAction />
    </div>
  );
}
