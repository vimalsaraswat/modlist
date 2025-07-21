import CallToAction from "./_components/home/call-to-action";
import CategoryShowcase from "./_components/home/category-showcase";
import Hero from "./_components/home/hero";
import HowItWorks from "./_components/home/how-it-works";

export default function CarPartsMarketplace() {
  return (
    <div className="min-h-screen">
      <Hero />
      <CategoryShowcase />
      <HowItWorks />
      <CallToAction />
    </div>
  );
}
