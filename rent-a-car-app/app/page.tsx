import DealsHero from "./components/DealsHero";
import WhyChooseUs from "./components/WhyChooseUs";
import PricingSection from "./components/PricingSection";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <DealsHero />
      <WhyChooseUs />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 text-left">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="text-sm uppercase tracking-[0.2em] text-muted">About Us</p>
            <h2 className="text-3xl font-bold tracking-tight">Built for worry-free journeys</h2>
            <p className="text-base text-muted leading-relaxed">
              We started as weekend road-trippers who wanted rentals that felt effortless. Today, our crew
              keeps every vehicle maintained, sanitized, and ready with flexible pickup options so your trip
              starts smooth.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted">
              <span className="rounded-full border px-3 py-1">24/7 roadside help</span>
              <span className="rounded-full border px-3 py-1">Transparent pricing</span>
              <span className="rounded-full border px-3 py-1">Local support team</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-[var(--color-bg-elevated)] p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Need a hand?</p>
            <h3 className="mt-2 text-2xl font-semibold">Talk with our team</h3>
            <p className="mt-3 text-muted leading-relaxed">
              Share your route, dates, and any special requests—our specialists will match you with the right
              car and lock in a pickup plan that fits your schedule.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/contact"
                className="rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Contact Us
              </a>
              <a
                href="/about"
                className="rounded-lg border px-5 py-3 text-sm font-semibold text-[var(--color-fg)] transition hover:bg-[var(--color-bg-elevated)]"
              >
                Learn More
              </a>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-muted">
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">Response time</p>
                <p className="text-lg font-semibold text-[var(--color-fg)]">&lt; 15 minutes</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">Coverage</p>
                <p className="text-lg font-semibold text-[var(--color-fg)]">Croatia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <PricingSection /> */}
      <SiteFooter />
    </main>
  );
}
