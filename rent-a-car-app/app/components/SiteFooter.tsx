"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SiteFooter() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="py-10 text-sm" style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-bg-subtle)", color: "var(--color-fg)" }}>
      <div className="container mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-lg font-semibold">RentACar</div>
          <p className="mt-2 text-muted">
            Reliable rentals for every journey.
          </p>
        </div>
        <div>
          <div className="font-semibold">Company</div>
          <ul className="mt-2 space-y-1">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/vehicle-list">Vehicles</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Support</div>
          <ul className="mt-2 space-y-1">
            <li>FAQ</li>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Get in touch</div>
          <p className="mt-2 text-muted">
            hello@rentacar.example
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 text-muted">
        © {year ?? ""} RentACar. All rights reserved.
      </div>
    </footer>
  );
}
