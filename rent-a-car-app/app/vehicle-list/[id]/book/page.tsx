import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookingForm from "@/app/components/BookingForm";

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

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    pickupDate?: string;
    pickupTime?: string;
    dropoffDate?: string;
    dropoffTime?: string;
  }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const car = await fetchCarById(resolvedParams.id);

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
          href="/vehicle-list"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Back to Vehicle List
        </Link>
      </main>
    );
  }

  if (!car.availability) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Vehicle Unavailable
        </h1>
        <p className="text-muted">This vehicle is currently not available for booking.</p>
        <Link
          href={`/vehicle-list/${car.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Back to Vehicle Details
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-8 px-4 py-10 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href={`/vehicle-list/${car.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Vehicle Details
        </Link>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-fg)]">
            Book Your Vehicle
          </h1>
          <p className="mt-2 text-lg text-[var(--color-fg-muted)]">
            Complete the booking process for {car.make} {car.name}
          </p>
        </header>

        <BookingForm
          car={car}
          initialDates={{
            pickupDate: resolvedSearchParams.pickupDate || "",
            pickupTime: resolvedSearchParams.pickupTime || "",
            dropoffDate: resolvedSearchParams.dropoffDate || "",
            dropoffTime: resolvedSearchParams.dropoffTime || "",
          }}
        />
      </div>
    </main>
  );
}
