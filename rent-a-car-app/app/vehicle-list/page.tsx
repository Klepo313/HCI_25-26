import Link from "next/link";
import FilterForm from "@/app/components/FilterForm";

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
  searchParams?: Promise<{ page?: string; fuel?: string; doors?: string; make?: string; model?: string; color?: string; year?: string; availability?: string }>;
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
  const doorOptions = Array.from(new Set(cars.map((c) => c.doors))).sort((a, b) => a - b);
  const makeOptions = Array.from(new Set(cars.map((c) => c.make))).sort();
  const modelOptions = Array.from(new Set(cars.map((c) => c.name))).sort();
  const colorOptions = Array.from(new Set(cars.map((c) => c.color))).sort();
  const yearOptions = Array.from(new Set(cars.map((c) => c.year))).sort((a, b) => a - b);

  // Apply filters
  const filtered = cars.filter((c) => {
    if (resolvedParams.fuel && c.fuel !== resolvedParams.fuel) return false;
    if (resolvedParams.doors && Number(resolvedParams.doors) !== c.doors) return false;
    if (resolvedParams.make && c.make !== resolvedParams.make) return false;
    if (resolvedParams.model && c.name !== resolvedParams.model) return false;
    if (resolvedParams.color && c.color !== resolvedParams.color) return false;
    if (resolvedParams.year && Number(resolvedParams.year) !== c.year) return false;
    if (resolvedParams.availability) {
      const wantAvailable = resolvedParams.availability === "true";
      if (c.availability !== wantAvailable) return false;
    }
    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedCars = filtered.slice(start, start + PAGE_SIZE);

  return (
    <main className="flex min-h-screen flex-col gap-8 px-4 py-10 md:px-10">
      <header className="flex flex-col gap-3 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Explore</p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Vehicle List
        </h1>
        <p className="text-base text-muted md:text-lg">
          Fake cars powered by myfakeapi.com. Filter and explore our full vehicle inventory.
        </p>
      </header>

      <FilterForm
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
          {pagedCars.map((car) => (
            <article
              key={car.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[var(--color-fg)]">
                  {car.name}
                </h2>
                <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                  ${car.price}/day
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                {car.description}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-[var(--color-fg-muted)]">
                <div className="rounded-lg border border-[var(--color-border)] px-3 py-2">
                  <dt className="font-semibold text-[var(--color-fg)]">Fuel</dt>
                  <dd>{car.fuel}</dd>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] px-3 py-2">
                  <dt className="font-semibold text-[var(--color-fg)]">
                    Doors
                  </dt>
                  <dd>{car.doors}</dd>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] px-3 py-2">
                  <dt className="font-semibold text-[var(--color-fg)]">
                    Seats
                  </dt>
                  <dd>{car.seats}</dd>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] px-3 py-2">
                  <dt className="font-semibold text-[var(--color-fg)]">
                    Color
                  </dt>
                  <dd>{car.color}</dd>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] px-3 py-2">
                  <dt className="font-semibold text-[var(--color-fg)]">Year</dt>
                  <dd>{car.year}</dd>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] px-3 py-2">
                  <dt className="font-semibold text-[var(--color-fg)]">VIN</dt>
                  <dd className="truncate" title={car.vin}>
                    {car.vin}
                  </dd>
                </div>
              </dl>
              <div className="mt-3 text-xs font-semibold uppercase tracking-wide">
                <span
                  className={`rounded-full px-2 py-1 ${
                    car.availability
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {car.availability ? "Available" : "Unavailable"}
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      <nav className="mt-6 flex items-center justify-center gap-3">
        <Link
          aria-disabled={currentPage <= 1}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition hover:bg-[var(--color-bg-elevated)] ${
            currentPage <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
          href={`/vehicle-list?page=${Math.max(1, currentPage - 1)}`}
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
          href={`/vehicle-list?page=${Math.min(totalPages, currentPage + 1)}`}
        >
          Next
        </Link>
      </nav>
    </main>
  );
}
