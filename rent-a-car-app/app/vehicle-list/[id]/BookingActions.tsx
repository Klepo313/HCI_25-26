"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

type Props = {
  bookingHref: string;
  currentHref: string;
  backLink: string;
  available: boolean;
};

export default function BookingActions({
  bookingHref,
  currentHref,
  backLink,
  available,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [showNotice, setShowNotice] = useState(false);

  const handleBookClick = () => {
    if (!available) return;
    if (!user) {
      setShowNotice(true);
      return;
    }
    router.push(bookingHref);
  };

  const handleLoginRedirect = () => {
    const redirect = `/login?redirect=${encodeURIComponent(currentHref)}`;
    router.push(redirect);
  };

  return (
    <>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleBookClick}
          className={`flex-1 rounded-lg px-6 py-3 text-center text-base font-semibold transition ${
            available
              ? "bg-[var(--color-primary)] text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!available}
        >
          {available ? "Book Now" : "Unavailable"}
        </button>
        <Link
          href={backLink}
          className="flex-1 rounded-lg border border-[var(--color-border)] px-6 py-3 text-center text-base font-semibold text-[var(--color-fg)] transition hover:bg-[var(--color-bg-elevated)]"
        >
          View More Vehicles
        </Link>
      </div>

      {showNotice && !user && (
        <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow">
          <p className="text-sm text-[var(--color-fg)] font-semibold">
            Please sign in to finish your reservation.
          </p>
          <p className="text-xs text-[var(--color-fg-muted)] mt-1">
            We will bring you back to this car after login.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="flex-1 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Go to login
            </button>
            <button
              type="button"
              onClick={() => setShowNotice(false)}
              className="flex-1 rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] hover:bg-[var(--color-bg)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
