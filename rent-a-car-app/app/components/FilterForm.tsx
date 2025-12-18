"use client";

import Link from "next/link";
import styles from "./FilterForm.module.scss";

interface FilterFormProps {
  fuelOptions: string[];
  doorOptions: number[];
  makeOptions: string[];
  modelOptions: string[];
  colorOptions: string[];
  yearOptions: number[];
  params: {
    fuel?: string;
    doors?: string;
    make?: string;
    model?: string;
    color?: string;
    year?: string;
    availability?: string;
  };
}

export default function FilterForm({
  fuelOptions,
  doorOptions,
  makeOptions,
  modelOptions,
  colorOptions,
  yearOptions,
  params,
}: FilterFormProps) {
  return (
    <form
      className={`${styles.filterForm} grid gap-3 rounded-xl border border-[var(--color-border)] p-4 md:grid-cols-3 lg:grid-cols-4`}
      method="get"
      action="/vehicle-list"
    >
      <input type="hidden" name="page" value="1" />

      <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-fg)]">
        Fuel
        <select
          name="fuel"
          defaultValue={params.fuel ?? ""}
          className={styles.filterSelect}
        >
          <option value="">All</option>
          {fuelOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-fg)]">
        Doors
        <select
          name="doors"
          defaultValue={params.doors ?? ""}
          className={styles.filterSelect}
        >
          <option value="">All</option>
          {doorOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-fg)]">
        Make
        <select
          name="make"
          defaultValue={params.make ?? ""}
          className={styles.filterSelect}
        >
          <option value="">All</option>
          {makeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-fg)]">
        Model
        <select
          name="model"
          defaultValue={params.model ?? ""}
          className={styles.filterSelect}
        >
          <option value="">All</option>
          {modelOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-fg)]">
        Color
        <select
          name="color"
          defaultValue={params.color ?? ""}
          className={styles.filterSelect}
        >
          <option value="">All</option>
          {colorOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-fg)]">
        Year
        <select
          name="year"
          defaultValue={params.year ?? ""}
          className={styles.filterSelect}
        >
          <option value="">All</option>
          {yearOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-fg)]">
        Availability
        <select
          name="availability"
          defaultValue={params.availability ?? ""}
          className={styles.filterSelect}
        >
          <option value="">All</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </label>

      <div className="flex items-end gap-2 md:col-span-2 lg:col-span-1">
        <button
          type="submit"
          className={`${styles.applyButton} w-full rounded-md px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90`}
        >
          Apply Filters
        </button>
        <Link
          href="/vehicle-list"
          className={`${styles.resetButton} w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-fg)] transition hover:bg-[var(--color-bg-elevated)] text-center`}
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
