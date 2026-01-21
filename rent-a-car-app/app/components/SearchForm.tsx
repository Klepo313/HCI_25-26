"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import styles from "./SearchForm.module.scss";
import { MapPin, Clock, Search, Calendar } from "lucide-react";

export type SearchFormData = {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
};

const searchFormSchema = z
  .object({
    pickupLocation: z.string().min(1, "Pick up location is required"),
    returnLocation: z.string().min(1, "Return location is required"),
    pickupDate: z.string().min(1, "Pick up date is required"),
    pickupTime: z.string().min(1, "Pick up time is required"),
    dropoffDate: z.string().min(1, "Drop off date is required"),
    dropoffTime: z.string().min(1, "Drop off time is required"),
  })
  .refine(
    (data) => {
      if (!data.dropoffDate || !data.dropoffTime) return true;
      const now = new Date();
      const dropoffDateTime = new Date(
        `${data.dropoffDate}T${data.dropoffTime}`,
      );
      return dropoffDateTime > now;
    },
    {
      message: "Drop off date and time cannot be in the past",
      path: ["dropoffTime"],
    },
  )
  .refine(
    (data) => {
      if (
        !data.pickupDate ||
        !data.pickupTime ||
        !data.dropoffDate ||
        !data.dropoffTime
      )
        return true;
      const pickup = new Date(`${data.pickupDate}T${data.pickupTime}`);
      const dropoff = new Date(`${data.dropoffDate}T${data.dropoffTime}`);
      return dropoff > pickup;
    },
    {
      message: "Drop off must be after pick up",
      path: ["dropoffDate"],
    },
  );

interface SearchFormProps {
  onSubmit?: (data: SearchFormData) => void;
  initialData?: Partial<SearchFormData>;
  showGlassEffect?: boolean;
}

export default function SearchForm({
  onSubmit,
  initialData,
  showGlassEffect = true,
}: SearchFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<SearchFormData>({
    pickupLocation: initialData?.pickupLocation || "Split, Croatia",
    returnLocation: initialData?.returnLocation || "Split, Croatia",
    pickupDate: initialData?.pickupDate || "",
    pickupTime: initialData?.pickupTime || "",
    dropoffDate: initialData?.dropoffDate || "",
    dropoffTime: initialData?.dropoffTime || "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SearchFormData, string>>
  >({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    if (name === "pickupLocation") {
      setForm((f) => ({ ...f, pickupLocation: value, returnLocation: value }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    // Clear error for this field when user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate form with Zod
    const result = searchFormSchema.safeParse(form);

    if (!result.success) {
      // Extract errors from Zod validation
      const fieldErrors: Partial<Record<keyof SearchFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SearchFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Clear errors
    setErrors({});

    // Call custom onSubmit if provided, otherwise navigate to vehicle list
    if (onSubmit) {
      onSubmit(form);
    } else {
      const params = new URLSearchParams({
        pickupLocation: form.pickupLocation,
        returnLocation: form.returnLocation,
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        dropoffDate: form.dropoffDate,
        dropoffTime: form.dropoffTime,
      });
      router.push(`/vehicle-list?${params.toString()}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${showGlassEffect ? styles.glass : ""} mt-8 p-5 sm:p-6 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3`}
    >
      <div className="flex flex-col justify-between">
        <label className={`${styles.fieldLabel} mb-2 flex items-center gap-2`}>
          <MapPin size={18} /> Pick Up Location
        </label>
        <input
          type="text"
          name="pickupLocation"
          value={form.pickupLocation}
          onChange={handleChange}
          placeholder="City, Airport, Station..."
          className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${styles.fieldControl} ${
            errors.pickupLocation ? "border-red-500" : ""
          }`}
          style={{
            background: "var(--color-bg-elevated)",
            color: form.pickupLocation ? "var(--color-fg)" : "var(--color-fg-muted)",
            borderColor: errors.pickupLocation
              ? "#ef4444"
              : "var(--color-border)",
            transition: "background 0.2s, color 0.2s, border-color 0.2s",
          }}
          aria-label="Pick up location"
        />
        {errors.pickupLocation && (
          <span className="text-red-500 text-xs mt-1">
            {errors.pickupLocation}
          </span>
        )}
        <label
          className={`${styles.fieldLabel} mt-3 mb-2 flex items-center gap-2`}
        >
          <MapPin size={18} /> Return Location
        </label>
        <input
          type="text"
          name="returnLocation"
          value={form.returnLocation}
          onChange={handleChange}
          placeholder="City, Airport, Station..."
          className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${styles.fieldControl} ${
            errors.returnLocation ? "border-red-500" : ""
          }`}
          style={{
            background: "var(--color-bg-elevated)",
            color: form.returnLocation ? "var(--color-fg)" : "var(--color-fg-muted)",
            borderColor: errors.returnLocation
              ? "#ef4444"
              : "var(--color-border)",
            transition: "background 0.2s, color 0.2s, border-color 0.2s",
          }}
          aria-label="Return location"
        />
        {errors.returnLocation && (
          <span className="text-red-500 text-xs mt-1">
            {errors.returnLocation}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-between">
        <label className={`${styles.fieldLabel} mb-2 flex items-center gap-2`}>
          <Calendar size={18} /> Pick Up Date
        </label>
        <input
          type="date"
          name="pickupDate"
          value={form.pickupDate}
          onChange={handleChange}
          className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${styles.fieldControl} ${
            errors.pickupDate ? "border-red-500" : ""
          }`}
          style={{
            background: "var(--color-bg-elevated)",
            color: form.pickupDate ? "var(--color-fg)" : "var(--color-fg-muted)",
            borderColor: errors.pickupDate ? "#ef4444" : "var(--color-border)",
            transition: "background 0.2s, color 0.2s, border-color 0.2s",
          }}
          aria-label="Pick up date"
        />
        {errors.pickupDate && (
          <span className="text-red-500 text-xs mt-1">{errors.pickupDate}</span>
        )}
        <label
          className={`${styles.fieldLabel} mt-2 mb-2 flex items-center gap-2`}
        >
          <Clock size={18} /> Pick Up Time
        </label>
        <select
          name="pickupTime"
          value={form.pickupTime}
          onChange={handleChange}
          className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${styles.fieldControl} ${
            errors.pickupTime ? "border-red-500" : ""
          }`}
          style={{
            background: "var(--color-bg-elevated)",
            color: form.pickupTime
              ? "var(--color-fg)"
              : "var(--color-fg-muted)",
            borderColor: errors.pickupTime ? "#ef4444" : "var(--color-border)",
            transition: "background 0.2s, color 0.2s, border-color 0.2s",
          }}
          aria-label="Pick up time"
        >
          <option value="" className="opacity-25">
            Select time
          </option>
          {Array.from({ length: 24 * 2 }, (_, i) => {
            const hour = Math.floor(i / 2)
              .toString()
              .padStart(2, "0");
            const min = i % 2 === 0 ? "00" : "30";
            const val = `${hour}:${min}`;
            return (
              <option key={val} value={val}>
                {val}
              </option>
            );
          })}
        </select>
        {errors.pickupTime && (
          <span className="text-red-500 text-xs mt-1">{errors.pickupTime}</span>
        )}
      </div>

      <div className="flex flex-col justify-between">
        <label className={`${styles.fieldLabel} mb-2 flex items-center gap-2`}>
          <Calendar size={18} /> Drop Off Date
        </label>
        <input
          type="date"
          name="dropoffDate"
          value={form.dropoffDate}
          onChange={handleChange}
          className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${styles.fieldControl} ${
            errors.dropoffDate ? "border-red-500" : ""
          }`}
          style={{
            background: "var(--color-bg-elevated)",
            color: form.dropoffDate ? "var(--color-fg)" : "var(--color-fg-muted)",
            borderColor: errors.dropoffDate ? "#ef4444" : "var(--color-border)",
            transition: "background 0.2s, color 0.2s, border-color 0.2s",
          }}
          aria-label="Drop off date"
        />
        {errors.dropoffDate && (
          <span className="text-red-500 text-xs mt-1">
            {errors.dropoffDate}
          </span>
        )}
        <label
          className={`${styles.fieldLabel} mt-2 mb-2 flex items-center gap-2`}
        >
          <Clock size={18} /> Drop Off Time
        </label>
        <select
          name="dropoffTime"
          value={form.dropoffTime}
          onChange={handleChange}
          className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${styles.fieldControl} ${
            errors.dropoffTime ? "border-red-500" : ""
          }`}
          style={{
            background: "var(--color-bg-elevated)",
            color: form.dropoffTime
              ? "var(--color-fg)"
              : "var(--color-fg-muted)",
            borderColor: errors.dropoffTime ? "#ef4444" : "var(--color-border)",
            transition: "background 0.2s, color 0.2s, border-color 0.2s",
          }}
          aria-label="Drop off time"
        >
          <option value="" className="opacity-25">
            Select time
          </option>
          {Array.from({ length: 24 * 2 }, (_, i) => {
            const hour = Math.floor(i / 2)
              .toString()
              .padStart(2, "0");
            const min = i % 2 === 0 ? "00" : "30";
            const val = `${hour}:${min}`;
            return (
              <option key={val} value={val}>
                {val}
              </option>
            );
          })}
        </select>
        {errors.dropoffTime && (
          <span className="text-red-500 text-xs mt-1">
            {errors.dropoffTime}
          </span>
        )}
      </div>

      <div className="md:col-span-3 flex justify-center mt-4">
        <button
          type="submit"
          className={`${styles.searchButton} h-12 min-w-[280px] inline-flex items-center justify-center rounded-md px-8 text-base font-semibold`}
          style={{
            background: "var(--color-primary)",
            color: "#fff",
            border: "none",
            transition: "background 0.2s, transform 0.2s",
            cursor: "pointer",
          }}
        >
          <Search className="mr-2" size={20} /> Search Deals
        </button>
      </div>
    </form>
  );
}
