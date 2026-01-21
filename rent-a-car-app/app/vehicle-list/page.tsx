import Link from "next/link";
import SearchAndFilterForm from "@/app/components/SearchAndFilterForm";

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

const PAGE_SIZE = 9;

async function fetchCars(): Promise<CarApi[]> {
  const res = await fetch("https://myfakeapi.com/api/cars", {
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) throw new Error("Failed to load cars");
  const data = (await res.json()) as { cars?: CarApi[] };
  if (!data.cars) throw new Error("Cars payload missing");
  return data.cars;
}

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

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    pickupLocation?: string;
    returnLocation?: string;
    pickupDate?: string;
    pickupTime?: string;
    dropoffDate?: string;
    dropoffTime?: string;
    page?: string;
    fuel?: string;
    doors?: string;
    make?: string;
    model?: string;
    color?: string;
    year?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const resolvedParams = (await searchParams) ?? {};
  const page = Math.max(1, Number(resolvedParams.page ?? "1") || 1);

  let cars: Array<ReturnType<typeof mapCar>> = [];
  let error: string | null = null;

  try {
    const apiCars = await fetchCars();
    cars = apiCars.map(mapCar);
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  // Build filter options from full dataset
  const fuelOptions = Array.from(new Set(cars.map((c) => c.fuel)));
  const doorOptions = Array.from(new Set(cars.map((c) => c.doors))).sort(
    (a, b) => a - b,
  );
  const makeOptions = Array.from(new Set(cars.map((c) => c.make))).sort();
  const modelOptions = Array.from(new Set(cars.map((c) => c.name))).sort();
  const colorOptions = Array.from(new Set(cars.map((c) => c.color))).sort();
  const yearOptions = Array.from(new Set(cars.map((c) => c.year))).sort(
    (a, b) => a - b,
  );

  // Apply filters
  const filtered = cars.filter((c) => {
    if (resolvedParams.fuel && c.fuel !== resolvedParams.fuel) return false;
    if (resolvedParams.doors && Number(resolvedParams.doors) !== c.doors)
      return false;
    if (resolvedParams.make && c.make !== resolvedParams.make) return false;
    if (resolvedParams.model && c.name !== resolvedParams.model) return false;
    if (resolvedParams.color && c.color !== resolvedParams.color) return false;
    if (resolvedParams.year && Number(resolvedParams.year) !== c.year)
      return false;
    if (resolvedParams.availability) {
      const wantAvailable = resolvedParams.availability === "true";
      if (c.availability !== wantAvailable) return false;
    }
    if (resolvedParams.minPrice && c.price < Number(resolvedParams.minPrice))
      return false;
    if (resolvedParams.maxPrice && c.price > Number(resolvedParams.maxPrice))
      return false;
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedCars = filtered.slice(start, start + PAGE_SIZE);

  // Build query string preserving all params
  const buildQueryString = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (resolvedParams.pickupLocation)
      params.set("pickupLocation", resolvedParams.pickupLocation);
    if (resolvedParams.returnLocation)
      params.set("returnLocation", resolvedParams.returnLocation);
    if (resolvedParams.pickupDate)
      params.set("pickupDate", resolvedParams.pickupDate);
    if (resolvedParams.pickupTime)
      params.set("pickupTime", resolvedParams.pickupTime);
    if (resolvedParams.dropoffDate)
      params.set("dropoffDate", resolvedParams.dropoffDate);
    if (resolvedParams.dropoffTime)
      params.set("dropoffTime", resolvedParams.dropoffTime);
    if (resolvedParams.fuel) params.set("fuel", resolvedParams.fuel);
    if (resolvedParams.doors) params.set("doors", resolvedParams.doors);
    if (resolvedParams.make) params.set("make", resolvedParams.make);
    if (resolvedParams.model) params.set("model", resolvedParams.model);
    if (resolvedParams.color) params.set("color", resolvedParams.color);
    if (resolvedParams.year) params.set("year", resolvedParams.year);
    if (resolvedParams.availability)
      params.set("availability", resolvedParams.availability);
    if (resolvedParams.minPrice)
      params.set("minPrice", resolvedParams.minPrice);
    if (resolvedParams.maxPrice)
      params.set("maxPrice", resolvedParams.maxPrice);
    return params.toString();
  };

  return (
    <main className="flex min-h-screen flex-col gap-8 px-4 py-10 md:px-10">
      <header className="flex flex-col gap-3 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Explore</p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Vehicle List
        </h1>
        <p className="text-base text-muted md:text-lg">
          Fake cars powered by myfakeapi.com. Filter and explore our full
          vehicle inventory.
        </p>
      </header>

      <SearchAndFilterForm
        fuelOptions={fuelOptions}
        doorOptions={doorOptions}
        makeOptions={makeOptions}
        modelOptions={modelOptions}
        colorOptions={colorOptions}
        yearOptions={yearOptions}
        params={resolvedParams}
      />

      {error ? (
        <div className="mx-auto w-full max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          Failed to load vehicles: {error}
        </div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pagedCars.map((car) => {
            // Generate a consistent image based on car ID
            const imageUrl = `https://loremflickr.com/400/300/car,${car.name.toLowerCase()}/all?lock=${car.id}`;

            return (
              <article
                key={car.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-sm transition hover:shadow-lg"
              >
                {/* Car Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={imageUrl}
                    alt={`${car.make} ${car.name}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold shadow-md ${
                        car.availability
                          ? "bg-green-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {car.availability ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Header */}
                  <div className="mb-3">
                    <h2 className="text-xl font-bold text-[var(--color-fg)]">
                      {car.make} {car.name}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                      {car.year} • {car.color}
                    </p>
                  </div>

                  {/* Specifications */}
                  <div className="mb-4 flex flex-wrap gap-3 text-sm text-[var(--color-fg-muted)]">
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      <span>{car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>{car.doors} Doors</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>{car.seats} Seats</span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="mt-auto flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--color-fg-muted)]">
                        From
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[var(--color-primary)]">
                          ${car.price}
                        </span>
                        <span className="text-sm text-[var(--color-fg-muted)]">
                          /day
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/vehicle-list/${car.id}`}
                      className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                    >
                      Select Vehicle
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <nav className="mt-6 flex items-center justify-center gap-3">
        <Link
          aria-disabled={currentPage <= 1}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition hover:bg-[var(--color-bg-elevated)] ${
            currentPage <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
          href={`/vehicle-list?${buildQueryString(Math.max(1, currentPage - 1))}`}
        >
          Previous
        </Link>
        <span className="text-sm text-[var(--color-fg-muted)]">
          Page {currentPage} of {totalPages}
        </span>
        <Link
          aria-disabled={currentPage >= totalPages}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition hover:bg-[var(--color-bg-elevated)] ${
            currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
          }`}
          href={`/vehicle-list?${buildQueryString(Math.min(totalPages, currentPage + 1))}`}
        >
          Next
        </Link>
      </nav>
    </main>
  );
}
