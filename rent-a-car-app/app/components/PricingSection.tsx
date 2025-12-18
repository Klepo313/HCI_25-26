const tiers = [
  {
    name: "Basic",
    price: 25,
    features: ["Compact cars", "Limited mileage", "Essential insurance"],
    cta: "Choose Basic",
  },
  {
    name: "Standard",
    price: 45,
    features: [
      "Sedans & crossovers",
      "Flexible mileage",
      "Full insurance",
    ],
    cta: "Choose Standard",
    highlight: true,
  },
  {
    name: "Premium",
    price: 75,
    features: ["Premium fleet", "Unlimited mileage", "Priority support"],
    cta: "Choose Premium",
  },
];

export default function PricingSection() {
  return (
    <section className="py-16" style={{ background: "var(--color-bg-subtle)" }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Affordable Pricing Options
        </h2>
        <p className="text-muted text-center mt-2 max-w-2xl mx-auto">
          Pick a plan that fits your trip. Transparent rates with no hidden fees.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl border p-6 shadow-sm`}
              style={{
                background: "var(--color-bg-elevated)",
                borderColor: t.highlight ? "var(--color-primary)" : "var(--color-border)",
                color: "var(--color-fg)",
                boxShadow: t.highlight ? "0 0 0 2px var(--color-primary-accent)" : undefined,
                transition: "background 0.2s, color 0.2s, border-color 0.2s"
              }}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold">{t.name}</h3>
                {t.highlight && (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: "var(--color-primary-accent)",
                      color: "#fff"
                    }}
                  >
                    Popular
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold" style={{ color: "var(--color-primary)" }}>€{t.price}</span>
                <span className="text-sm text-muted">/day</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-primary)" }}></span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="mt-6 w-full rounded-md px-4 py-2 text-sm font-semibold"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                  border: "none",
                  transition: "background 0.2s"
                }}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
