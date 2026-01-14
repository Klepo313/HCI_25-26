import Link from "next/link";
import VehicleCard, { Vehicle } from "./VehicleCard";

const demoVehicles: Vehicle[] = [
  { id: "1", name: "Toyota Corolla", image: "/demo/corolla.svg", pricePerDay: 35, seats: 5, transmission: "Automatic" },
  { id: "2", name: "VW Golf", image: "/demo/golf.svg", pricePerDay: 40, seats: 5, transmission: "Manual" },
  { id: "3", name: "Skoda Octavia", image: "/demo/octavia.svg", pricePerDay: 44, seats: 5, transmission: "Automatic" },
  { id: "4", name: "BMW 3 Series", image: "/demo/bmw3.svg", pricePerDay: 75, seats: 5, transmission: "Automatic" },
  { id: "5", name: "Audi A3", image: "/demo/a3.svg", pricePerDay: 68, seats: 5, transmission: "Automatic" },
  { id: "6", name: "Peugeot 208", image: "/demo/208.svg", pricePerDay: 33, seats: 5, transmission: "Manual" },
];

export default function VehiclesSection() {
  const vehicles = demoVehicles;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Check Our Vehicles
        </h2>
        <p className="text-muted text-center mt-2 max-w-2xl mx-auto">
          A curated selection to fit every journey — from city cars to comfort sedans.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <Link key={v.id} href={`/vehicle-list/${v.id}`}>
              <VehicleCard vehicle={v} />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/vehicle-list"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              borderColor: "var(--color-primary)",
              transition: "background 0.2s, opacity 0.2s"
            }}
          >
            View All Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
}
