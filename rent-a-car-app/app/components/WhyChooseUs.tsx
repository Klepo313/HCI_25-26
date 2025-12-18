import { ShieldCheck, Car, Clock, ThumbsUp } from "lucide-react";

const features = [
  {
    title: "Trusted Fleet",
    desc: "Well-maintained vehicles with regular safety checks.",
    Icon: Car,
  },
  {
    title: "24/7 Support",
    desc: "We’re here whenever your journey needs us.",
    Icon: Clock,
  },
  {
    title: "Insurance Included",
    desc: "Drive with confidence — coverage on every rental.",
    Icon: ShieldCheck,
  },
  {
    title: "Top Rated",
    desc: "Thousands of satisfied drivers recommend us.",
    Icon: ThumbsUp,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Why Choose Us
        </h2>
        <p className="text-muted text-center mt-2 max-w-2xl mx-auto">
          We combine quality vehicles, transparent pricing, and dependable support
          so you can enjoy the road ahead.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, desc, Icon }) => (
            <div
              key={title}
              className="rounded-xl border p-6 shadow-sm"
              style={{
                background: "var(--color-bg-elevated)",
                borderColor: "var(--color-border)",
                color: "var(--color-fg)",
                transition: "background 0.2s, color 0.2s, border-color 0.2s"
              }}
            >
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  background: "var(--color-primary-accent)",
                  color: "#fff"
                }}
              >
                <Icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
