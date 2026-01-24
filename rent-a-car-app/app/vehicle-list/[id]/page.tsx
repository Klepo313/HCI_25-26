import Link from "next/link";
import {
  ArrowLeft,
  Fuel,
  DoorClosed,
  Users,
  Calendar,
  Palette,
} from "lucide-react";
import CarImage from "@/app/components/CarImage";
import { formatPrice } from "@/app/utils/formatPrice";
import BookingActions from "./BookingActions";

type CarApi = {
  id: number;
  car: string;
  car_make: string;
  car_model: string;
  car_color: string;
  car_model_year: number;
  car_vin: string;
  price: string;
  availability: boolean;
};

function mapCar(car: CarApi) {
  const priceNumber = Number(car.price.replace(/[^0-9.]/g, "")) || 45;
  const seats = 4 + (car.id % 2);
  const doors = 3 + (car.id % 2);
  const fuel = car.id % 2 === 0 ? "Petrol" : "Diesel";

  return {
    id: car.id,
    name: car.car_model,
    make: car.car_make,
    description: car.car,
    color: car.car_color,
    year: car.car_model_year,
    vin: car.car_vin,
    availability: car.availability,
    price: priceNumber,
    seats,
    doors,
    fuel,
  };
}

async function fetchCarById(id: string) {
  const res = await fetch("https://myfakeapi.com/api/cars", {
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) throw new Error("Failed to load cars");
  const data = (await res.json()) as { cars?: CarApi[] };
  if (!data.cars) throw new Error("Cars payload missing");

  const car = data.cars.find((c) => c.id === Number(id));
  if (!car) return null;

  return mapCar(car);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const car = await fetchCarById(resolvedParams.id);

  // Build back link with preserved query params
  const backParams = new URLSearchParams(resolvedSearchParams);
  const backLink = `/vehicle-list${backParams.toString() ? `?${backParams.toString()}` : ""}`;
  const queryString = backParams.toString();
  const bookingHref = `/vehicle-list/${resolvedParams.id}/book${queryString ? `?${queryString}` : ""}`;
  const currentHref = `/vehicle-list/${resolvedParams.id}${queryString ? `?${queryString}` : ""}`;

  if (!car) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Vehicle Not Found
        </h1>
        <p className="text-muted">
          The vehicle you're looking for doesn't exist.
        </p>
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Back to Vehicle List
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-8 px-4 py-10 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Vehicle List
        </Link>
      </div>

      <section className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden shadow-lg">
          {/* Car Image */}
          <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <CarImage
              imageUrl={`https://loremflickr.com/800/400/car,${car.name.toLowerCase()}/all?lock=${car.id}`}
              carMake={car.make}
              carName={car.name}
            />
          </div>

          <div className="px-8 pb-8 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-fg)]">
                  {car.name}
                </h1>
                <p className="mt-2 text-lg text-[var(--color-fg-muted)]">
                  {car.make} • {car.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-[var(--color-primary)]">
                  ${formatPrice(car.price)}
                </div>
                <div className="text-sm text-[var(--color-fg-muted)]">
                  per day
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  car.availability
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {car.availability ? "Available" : "Unavailable"}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <Fuel className="text-[var(--color-primary)]" size={24} />
                </div>
                <div>
                  <div className="text-sm text-[var(--color-fg-muted)]">
                    Fuel Type
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-fg)]">
                    {car.fuel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <DoorClosed
                    className="text-[var(--color-primary)]"
                    size={24}
                  />
                </div>
                <div>
                  <div className="text-sm text-[var(--color-fg-muted)]">
                    Doors
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-fg)]">
                    {car.doors}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <Users className="text-[var(--color-primary)]" size={24} />
                </div>
                <div>
                  <div className="text-sm text-[var(--color-fg-muted)]">
                    Seats
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-fg)]">
                    {car.seats}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <Palette className="text-[var(--color-primary)]" size={24} />
                </div>
                <div>
                  <div className="text-sm text-[var(--color-fg-muted)]">
                    Color
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-fg)]">
                    {car.color}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <Calendar className="text-[var(--color-primary)]" size={24} />
                </div>
                <div>
                  <div className="text-sm text-[var(--color-fg-muted)]">
                    Year
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-fg)]">
                    {car.year}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <span className="text-xl font-bold text-[var(--color-primary)]">
                    VIN
                  </span>
                </div>
                <div>
                  <div className="text-sm text-[var(--color-fg-muted)]">
                    VIN Number
                  </div>
                  <div className="text-sm font-mono font-semibold text-[var(--color-fg)]">
                    {car.vin}
                  </div>
                </div>
              </div>
            </div>

            <BookingActions
              bookingHref={bookingHref}
              currentHref={currentHref}
              backLink={backLink}
              available={car.availability}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
