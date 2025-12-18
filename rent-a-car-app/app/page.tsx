import DealsHero from "./components/DealsHero";
import WhyChooseUs from "./components/WhyChooseUs";
import VehiclesSection from "./components/VehiclesSection";
import PricingSection from "./components/PricingSection";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <DealsHero />
      <WhyChooseUs />
      <VehiclesSection />
      <PricingSection />
      <SiteFooter />
    </main>
  );
}
