"use client";

import styles from "./DealsHero.module.scss";
import SearchForm from "./SearchForm";

export default function DealsHero() {
  return (
    <section className={`${styles.hero} w-full`}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Explore Our Top Deals
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted">
            Find the best cars at the best prices. Flexible pickup and drop-off
            to match your itinerary.
          </p>
        </div>

        <div className={`${styles.glass} mt-8`}>
          <SearchForm showGlassEffect={false} />
        </div>
      </div>
    </section>
  );
}
