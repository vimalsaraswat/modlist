import CallToAction from "~/components/home/call-to-action";
import CategoryShowcase from "~/components/home/category-showcase";
import Hero from "~/components/home/hero";
import HowItWorks from "~/components/home/how-it-works";

export default function CarPartsMarketplace() {
  return (
    <div className="min-h-screen overflow-auto">
      <Hero />
      <CategoryShowcase />
      <HowItWorks />
      <CallToAction />
    </div>
  );
}
