"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./SearchAndFilterForm.module.scss";
import { ChevronDown } from "lucide-react";
import SearchForm, { SearchFormData } from "./SearchForm";

interface SearchAndFilterFormProps {
  fuelOptions: string[];
  doorOptions: number[];
  makeOptions: string[];
  modelOptions: string[];
  colorOptions: string[];
  yearOptions: number[];
  params: {
    pickupLocation?: string;
    returnLocation?: string;
    pickupDate?: string;
    pickupTime?: string;
    dropoffDate?: string;
    dropoffTime?: string;
    fuel?: string;
    doors?: string;
    make?: string;
    model?: string;
    color?: string;
    year?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function SearchAndFilterForm({
  fuelOptions,
  doorOptions,
  makeOptions,
  modelOptions,
  colorOptions,
  yearOptions,
  params,
}: SearchAndFilterFormProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchSubmit = (data: SearchFormData) => {
    const searchParams = new URLSearchParams({
      pickupLocation: data.pickupLocation,
      returnLocation: data.returnLocation,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      dropoffDate: data.dropoffDate,
      dropoffTime: data.dropoffTime,
      // Preserve existing filter params
      ...(params.fuel && { fuel: params.fuel }),
      ...(params.doors && { doors: params.doors }),
      ...(params.make && { make: params.make }),
      ...(params.model && { model: params.model }),
      ...(params.color && { color: params.color }),
      ...(params.year && { year: params.year }),
      ...(params.availability && { availability: params.availability }),
      ...(params.minPrice && { minPrice: params.minPrice }),
      ...(params.maxPrice && { maxPrice: params.maxPrice }),
    });
    window.location.href = `/vehicle-list?${searchParams.toString()}`;
  };

  return (
    <div className={styles.container}>
      {/* Search Form */}
      <div className={styles.searchWrapper}>
        <SearchForm
          onSubmit={handleSearchSubmit}
          initialData={{
            pickupLocation: params.pickupLocation || "Split, Croatia",
            returnLocation: params.returnLocation || "Split, Croatia",
            pickupDate: params.pickupDate || "",
            pickupTime: params.pickupTime || "",
            dropoffDate: params.dropoffDate || "",
            dropoffTime: params.dropoffTime || "",
          }}
          showGlassEffect={true}
        />
      </div>

      {/* Advanced Filters Accordion */}
      <div className={styles.accordionContainer}>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={styles.accordionHeader}
        >
          <span>Advanced Filters</span>
          <ChevronDown
            size={20}
            className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isFilterOpen && (
          <div className={styles.accordionContent}>
            <form
              className={styles.filterForm}
              method="get"
              action="/vehicle-list"
            >
              {/* Search params as hidden inputs */}
              {params.pickupLocation && (
                <input
                  type="hidden"
                  name="pickupLocation"
                  value={params.pickupLocation}
                />
              )}
              {params.returnLocation && (
                <input
                  type="hidden"
                  name="returnLocation"
                  value={params.returnLocation}
                />
              )}
              {params.pickupDate && (
                <input
                  type="hidden"
                  name="pickupDate"
                  value={params.pickupDate}
                />
              )}
              {params.pickupTime && (
                <input
                  type="hidden"
                  name="pickupTime"
                  value={params.pickupTime}
                />
              )}
              {params.dropoffDate && (
                <input
                  type="hidden"
                  name="dropoffDate"
                  value={params.dropoffDate}
                />
              )}
              {params.dropoffTime && (
                <input
                  type="hidden"
                  name="dropoffTime"
                  value={params.dropoffTime}
                />
              )}

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

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-fg)]">
                Min Price ($/day)
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={params.minPrice ?? ""}
                  placeholder="0"
                  min="0"
                  className={styles.filterSelect}
                  style={{ padding: "0.5rem" }}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-fg)]">
                Max Price ($/day)
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={params.maxPrice ?? ""}
                  placeholder="1000"
                  min="0"
                  className={styles.filterSelect}
                  style={{ padding: "0.5rem" }}
                />
              </label>

              <div className="flex items-end gap-2 md:col-span-2">
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
          </div>
        )}
      </div>
    </div>
  );
}
