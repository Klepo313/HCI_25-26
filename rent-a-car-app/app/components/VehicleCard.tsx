import styles from "./VehicleCard.module.scss";

export type Vehicle = {
  id: string;
  name: string;
  image: string; // path under /public
  pricePerDay: number;
  seats: number;
  transmission: "Manual" | "Automatic";
};

type Props = {
  vehicle: Vehicle;
};

export default function VehicleCard({ vehicle }: Props) {
  return (
    <div
      className={`${styles.card} rounded-xl border shadow-sm overflow-hidden`}
      style={{
        background: "var(--color-bg-elevated)",
        borderColor: "var(--color-border)",
        color: "var(--color-fg)",
        transition: "background 0.2s, color 0.2s, border-color 0.2s"
      }}
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-40 w-full object-cover"
        />
        <span className={`${styles.badge} absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white`}>
          {vehicle.transmission}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg">{vehicle.name}</h3>
          <div className="text-right">
            <div style={{ color: "var(--color-primary)" }} className="font-bold">€{vehicle.pricePerDay}</div>
            <div className="text-xs text-muted">per day</div>
          </div>
        </div>
        <div className="mt-2 text-sm text-muted">
          {vehicle.seats} seats · {vehicle.transmission}
        </div>
      </div>
    </div>
  );
}
