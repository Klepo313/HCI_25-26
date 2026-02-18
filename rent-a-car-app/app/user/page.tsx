"use client";

import { useAuth } from "../components/AuthProvider";
import { useToast } from "../components/ToastProvider";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Reservation = {
  id: string | number;
  userId: string | number;
  vehicle?: string;
  year?: number;
  color?: string;
  dailyRate?: number;
  pickup?: string;
  return?: string;
  cardNumber?: string | number;
  createdAt?: string;
  carId?: string | number;
  pickupDate?: string;
  dropoffDate?: string;
  status?: string;
  totalPrice?: number;
  [key: string]: any;
};

function calculateTotalCost(
  dailyRate: number | undefined,
  pickup: string | undefined,
  returnDate: string | undefined,
): number {
  if (!dailyRate || !pickup || !returnDate) return 0;
  const pickupDate = new Date(pickup);
  const returnDateObj = new Date(returnDate);
  const diffTime = Math.abs(returnDateObj.getTime() - pickupDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays) * dailyRate;
}

export default function Page() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingReservationId, setDeletingReservationId] = useState<
    string | number | null
  >(null);
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);

  const handleDeleteReservation = async (reservationId: string | number) => {
    setDeletingReservationId(reservationId);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/reservations/${reservationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete reservation");
      }

      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== reservationId),
      );
      showToast("Reservation deleted successfully.", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete reservation",
        "error",
      );
    } finally {
      setDeletingReservationId(null);
    }
  };

  const openDeleteConfirmation = (reservation: Reservation) => {
    setReservationToDelete(reservation);
  };

  const confirmDeleteReservation = async () => {
    if (!reservationToDelete) return;
    await handleDeleteReservation(reservationToDelete.id);
    setReservationToDelete(null);
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(
          `${baseUrl}/reservations?userId=${user.id}`,
        );
        if (response.status === 204 || response.status === 404) {
          setReservations([]);
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch reservations");
        const data = await response.json();

        // Filter to exact userId match only (API bug: returns partial matches)
        const filtered = Array.isArray(data)
          ? data.filter(
              (r: Reservation) => String(r.userId) === String(user.id),
            )
          : [];

        console.log("Fetched reservations:", filtered);

        setReservations(filtered);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error loading reservations",
        );
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user?.id]);

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* Header section with user info */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="px-6 md:px-10 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-fg)]">
            My Profile
          </h1>
        </div>
      </div>

      <div className="px-6 md:px-10 py-10 max-w-6xl mx-auto">
        {!user ? (
          <div className="rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center">
            <p className="text-lg text-[var(--color-fg-muted)] mb-4">
              You are not signed in.
            </p>
            <a
              href="/login"
              className="inline-block mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              Sign In
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* User Info Card */}
            <div className="rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg)] shadow-lg p-8">
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-[var(--color-border)]">
                <h2 className="text-2xl font-bold text-[var(--color-fg)]">
                  Account Information
                </h2>
                {/* <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-2xl font-bold">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </div> */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[var(--color-fg-muted)] uppercase tracking-wide">
                    Full Name
                  </p>
                  <p className="text-lg font-medium text-[var(--color-fg)]">
                    {user.name || "—"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[var(--color-fg-muted)] uppercase tracking-wide">
                    Username
                  </p>
                  <p className="text-lg font-medium text-[var(--color-fg)]">
                    @{user.username || "—"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[var(--color-fg-muted)] uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-lg font-medium text-[var(--color-fg)]">
                    {user.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[var(--color-fg-muted)] uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-lg font-medium text-[var(--color-fg)]">
                    {user.phone || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Reservations Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-fg)] mb-2">
                  My Reservations
                </h2>
                <p className="text-[var(--color-fg-muted)]">
                  {reservations.length} total reservation
                  {reservations.length !== 1 ? "s" : ""}
                </p>
              </div>

              {loading ? (
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center">
                  <p className="text-[var(--color-fg-muted)] flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
                    Loading reservations...
                  </p>
                </div>
              ) : error ? (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
                  <p className="text-red-400 font-medium">
                    Error loading reservations
                  </p>
                  <p className="text-sm text-red-300/80 mt-1">{error}</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-12 text-center">
                  <div className="text-5xl mb-4">📅</div>
                  <p className="text-lg text-[var(--color-fg-muted)] mb-4">
                    No reservations yet
                  </p>
                  <p className="text-sm text-[var(--color-fg-muted)] mb-6">
                    Start booking your next adventure!
                  </p>
                  <a
                    href="/vehicle-list"
                    className="inline-block px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Browse Vehicles
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="relative rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 hover:border-[var(--color-primary)] transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => openDeleteConfirmation(res)}
                        disabled={deletingReservationId === res.id}
                        className="absolute top-3 right-3 p-2 rounded-md border border-red-500/40 text-red-500 hover:bg-red-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        aria-label="Delete reservation"
                        title="Delete reservation"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left side: Vehicle info */}
                        <div className="space-y-3">
                          {res.vehicle ? (
                            <>
                              <p className="text-lg font-bold text-[var(--color-fg)]">
                                {res.vehicle}
                              </p>
                              <div className="space-y-2">
                                {res.year && (
                                  <p className="text-sm">
                                    <span className="text-[var(--color-fg-muted)]">
                                      Year:
                                    </span>{" "}
                                    <span className="font-medium text-[var(--color-fg)]">
                                      {res.year}
                                    </span>
                                  </p>
                                )}
                                {res.color && (
                                  <p className="text-sm">
                                    <span className="text-[var(--color-fg-muted)]">
                                      Color:
                                    </span>{" "}
                                    <span className="font-medium text-[var(--color-fg)] inline-block ml-2">
                                      <span
                                        className="inline-block w-4 h-4 rounded-full border border-[var(--color-border)] mr-2"
                                        style={{
                                          backgroundColor: res.color
                                            .toLowerCase()
                                            .replace(/\s+/g, ""),
                                        }}
                                      />
                                      {res.color}
                                    </span>
                                  </p>
                                )}
                                {res.dailyRate && (
                                  <p className="text-sm">
                                    <span className="text-[var(--color-fg-muted)]">
                                      Daily Rate:
                                    </span>{" "}
                                    <span className="font-semibold text-[var(--color-primary)]">
                                      ${res.dailyRate}/day
                                    </span>
                                  </p>
                                )}
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-[var(--color-fg-muted)]">
                              Vehicle info not available
                            </p>
                          )}
                        </div>

                        {/* Right side: Dates and details */}
                        <div className="space-y-3">
                          {(res.pickup || res.pickupDate) && (
                            <p className="text-sm">
                              <span className="text-[var(--color-fg-muted)]">
                                Pickup:
                              </span>
                              <br />
                              <span className="font-medium text-[var(--color-fg)]">
                                {new Date(
                                  (res.pickup || res.pickupDate) as string,
                                ).toLocaleString()}
                              </span>
                            </p>
                          )}
                          {(res.return || res.dropoffDate) && (
                            <p className="text-sm">
                              <span className="text-[var(--color-fg-muted)]">
                                Return:
                              </span>
                              <br />
                              <span className="font-medium text-[var(--color-fg)]">
                                {new Date(
                                  (res.return || res.dropoffDate) as string,
                                ).toLocaleString()}
                              </span>
                            </p>
                          )}
                          {res.cardNumber && (
                            <p className="text-sm">
                              <span className="text-[var(--color-fg-muted)]">
                                Payment Card:
                              </span>{" "}
                              <span className="font-medium text-[var(--color-fg)]">
                                ****{String(res.cardNumber).slice(-4)}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer: ID and timestamp */}
                      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                        <div className="flex items-center gap-6 text-xs text-[var(--color-fg-muted)]">
                          <span>Reservation ID: {res.id}</span>
                          {res.createdAt && (
                            <span>
                              Created:{" "}
                              {new Date(res.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 pr-12">
                          {res.dailyRate &&
                            (res.pickup || res.pickupDate) &&
                            (res.return || res.dropoffDate) && (
                              <div className="text-right">
                                <p className="text-xs text-[var(--color-fg-muted)] mb-1">
                                  Total Cost
                                </p>
                                <p className="text-lg font-bold text-[var(--color-primary)]">
                                  ${calculateTotalCost(
                                    res.dailyRate,
                                    res.pickup || res.pickupDate,
                                    res.return || res.dropoffDate,
                                  ).toFixed(2)}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {reservationToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-xl">
              <h3 className="text-xl font-bold text-[var(--color-fg)]">
                Delete reservation?
              </h3>
              <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                This action cannot be undone. Do you want to permanently remove
                this reservation?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReservationToDelete(null)}
                  disabled={deletingReservationId !== null}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-fg)] font-medium hover:bg-[var(--color-bg)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteReservation}
                  disabled={deletingReservationId !== null}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deletingReservationId !== null ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
