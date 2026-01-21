"use client";

import { useState } from "react";
import { z } from "zod";
import { Check, CreditCard, Calendar, User, ChevronRight } from "lucide-react";
import styles from "./BookingForm.module.scss";
import searchFormStyles from "./SearchForm.module.scss";
import { formatPrice } from "@/app/utils/formatPrice";

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your address"),
  city: z.string().min(2, "Please enter your city"),
  zipCode: z.string().min(4, "Please enter a valid zip code"),
});

const bookingDatesSchema = z
  .object({
    pickupDate: z.string().min(1, "Pickup date is required"),
    pickupTime: z.string().min(1, "Pickup time is required"),
    dropoffDate: z.string().min(1, "Return date is required"),
    dropoffTime: z.string().min(1, "Return time is required"),
  })
  .refine(
    (data) => {
      const pickup = new Date(`${data.pickupDate}T${data.pickupTime}`);
      const dropoff = new Date(`${data.dropoffDate}T${data.dropoffTime}`);
      return dropoff > pickup;
    },
    { message: "Return date must be after pickup date", path: ["dropoffDate"] },
  );

const paymentSchema = z
  .object({
    paymentMethod: z.enum(["credit_card", "debit_card", "paypal"]),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.paymentMethod === "credit_card" ||
        data.paymentMethod === "debit_card"
      ) {
        return (
          data.cardNumber &&
          data.cardName &&
          data.expiryDate &&
          data.cvv &&
          data.cardNumber.length >= 16
        );
      }
      return true;
    },
    {
      message: "Please fill in all card details",
      path: ["cardNumber"],
    },
  );

type Car = {
  id: number;
  name: string;
  make: string;
  price: number;
  year: number;
  color: string;
};

type PersonalInfo = z.infer<typeof personalInfoSchema>;
type BookingDates = z.infer<typeof bookingDatesSchema>;
type Payment = z.infer<typeof paymentSchema>;

interface BookingFormProps {
  car: Car;
  initialDates: {
    pickupDate: string;
    pickupTime: string;
    dropoffDate: string;
    dropoffTime: string;
  };
}

export default function BookingForm({ car, initialDates }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [bookingDates, setBookingDates] = useState<BookingDates>({
    pickupDate: initialDates.pickupDate || "",
    pickupTime: initialDates.pickupTime || "",
    dropoffDate: initialDates.dropoffDate || "",
    dropoffTime: initialDates.dropoffTime || "",
  });
  const [payment, setPayment] = useState<Partial<Payment>>({
    paymentMethod: "credit_card",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const calculateDays = () => {
    if (!bookingDates.pickupDate || !bookingDates.dropoffDate) return 0;
    const pickup = new Date(bookingDates.pickupDate);
    const dropoff = new Date(bookingDates.dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const totalDays = calculateDays();
  const totalCost = totalDays * car.price;

  const validateStep = (step: number): boolean => {
    setErrors({});
    try {
      if (step === 1) {
        personalInfoSchema.parse(personalInfo);
      } else if (step === 2) {
        bookingDatesSchema.parse(bookingDates);
      } else if (step === 3) {
        // Review step, no validation needed
        return true;
      } else if (step === 4) {
        paymentSchema.parse(payment);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError && Array.isArray(error.issues)) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error("Validation error:", error);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = () => {
    if (validateStep(4)) {
      setBookingConfirmed(true);
      setCurrentStep(5);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Booking Dates", icon: Calendar },
    { number: 3, title: "Review", icon: Check },
    { number: 4, title: "Payment", icon: CreditCard },
  ];

  if (bookingConfirmed && currentStep === 5) {
    return (
      <div className={styles.confirmationCard}>
        <div className={styles.successIcon}>
          <Check size={64} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-[var(--color-fg)] text-center">
          Booking Confirmed!
        </h2>
        <p className="text-center text-[var(--color-fg-muted)] mt-2">
          Your booking has been successfully confirmed. We've sent a
          confirmation email to <strong>{personalInfo.email}</strong>
        </p>

        <div className={styles.bookingSummary}>
          <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-fg-muted)]">Vehicle:</span>
              <span className="font-semibold">
                {car.make} {car.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-fg-muted)]">Pickup:</span>
              <span className="font-semibold">
                {new Date(bookingDates.pickupDate).toLocaleDateString()} at{" "}
                {bookingDates.pickupTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-fg-muted)]">Return:</span>
              <span className="font-semibold">
                {new Date(bookingDates.dropoffDate).toLocaleDateString()} at{" "}
                {bookingDates.dropoffTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-fg-muted)]">Duration:</span>
              <span className="font-semibold">
                {totalDays} day{totalDays > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[var(--color-border)] mt-2">
              <span className="text-[var(--color-fg-muted)]">Total Cost:</span>
              <span className="font-bold text-lg text-[var(--color-primary)]">
                ${formatPrice(totalCost)}
              </span>
            </div>
          </div>
        </div>

        <a
          href="/vehicle-list"
          className="mt-6 w-full rounded-lg bg-[var(--color-primary)] px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
        >
          Browse More Vehicles
        </a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Progress Steps */}
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div key={step.number} className={styles.stepWrapper}>
            <div
              className={`${styles.step} ${
                currentStep === step.number
                  ? styles.stepActive
                  : currentStep > step.number
                    ? styles.stepCompleted
                    : ""
              }`}
            >
              <step.icon size={20} />
            </div>
            <span className={styles.stepLabel}>{step.title}</span>
            {index < steps.length - 1 && (
              <div
                className={`${styles.stepConnector} ${
                  currentStep > step.number ? styles.stepConnectorActive : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className={styles.formCard}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className={styles.stepContent}>
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className={styles.formGrid}>
              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.firstName || ""}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="John"
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: personalInfo.firstName
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.firstName
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.lastName || ""}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      lastName: e.target.value,
                    })
                  }
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: personalInfo.lastName
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.lastName
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p
                    className={`${searchFormStyles.fieldError} mt-1 text-xs text-red-500`}
                  >
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={personalInfo.email || ""}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, email: e.target.value })
                  }
                  placeholder="john.doe@example.com"
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: personalInfo.email
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.email
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone || ""}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, phone: e.target.value })
                  }
                  placeholder="+1 234 567 8900"
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: personalInfo.phone
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.phone
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.address || ""}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      address: e.target.value,
                    })
                  }
                  placeholder="123 Main Street"
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.address ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: personalInfo.address
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.address
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.city || ""}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, city: e.target.value })
                  }
                  placeholder="New York"
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.city ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: personalInfo.city
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.city
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.zipCode || ""}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      zipCode: e.target.value,
                    })
                  }
                  placeholder="10001"
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.zipCode ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: personalInfo.zipCode
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.zipCode
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Booking Dates */}
        {currentStep === 2 && (
          <div className={styles.stepContent}>
            <h2 className="text-2xl font-bold mb-6">Booking Dates</h2>
            <div className={styles.formGrid}>
              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  Pickup Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={bookingDates.pickupDate}
                  onChange={(e) =>
                    setBookingDates({
                      ...bookingDates,
                      pickupDate: e.target.value,
                    })
                  }
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.pickupDate ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: bookingDates.pickupDate
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.pickupDate
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.pickupDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pickupDate}
                  </p>
                )}
              </div>

              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  Pickup Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={bookingDates.pickupTime}
                  onChange={(e) =>
                    setBookingDates({
                      ...bookingDates,
                      pickupTime: e.target.value,
                    })
                  }
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.pickupTime ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: bookingDates.pickupTime
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.pickupTime
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                />
                {errors.pickupTime && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pickupTime}
                  </p>
                )}
              </div>

              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  Return Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={bookingDates.dropoffDate}
                  onChange={(e) =>
                    setBookingDates({
                      ...bookingDates,
                      dropoffDate: e.target.value,
                    })
                  }
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.dropoffDate ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: bookingDates.dropoffDate
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.dropoffDate
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                  min={
                    bookingDates.pickupDate ||
                    new Date().toISOString().split("T")[0]
                  }
                />
                {errors.dropoffDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dropoffDate}
                  </p>
                )}
              </div>

              <div>
                <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                  Return Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={bookingDates.dropoffTime}
                  onChange={(e) =>
                    setBookingDates({
                      ...bookingDates,
                      dropoffTime: e.target.value,
                    })
                  }
                  className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                    errors.dropoffTime ? "border-red-500" : ""
                  }`}
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: bookingDates.dropoffTime
                      ? "var(--color-fg)"
                      : "var(--color-fg-muted)",
                    borderColor: errors.dropoffTime
                      ? "#ef4444"
                      : "var(--color-border)",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                />
                {errors.dropoffTime && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dropoffTime}
                  </p>
                )}
              </div>
            </div>

            {bookingDates.pickupDate && bookingDates.dropoffDate && (
              <div className={styles.costSummary}>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-fg-muted)]">
                    Duration: {totalDays} day{totalDays > 1 ? "s" : ""}
                  </span>
                  <span className="text-[var(--color-fg-muted)]">
                    ${formatPrice(car.price)} × {totalDays}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)] mt-2">
                  <span className="font-semibold">Estimated Total:</span>
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    ${formatPrice(totalCost)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className={styles.stepContent}>
            <h2 className="text-2xl font-bold mb-6">Review Booking</h2>

            <div className={styles.reviewSection}>
              <h3 className="font-semibold text-lg mb-3">Vehicle Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">Vehicle:</span>
                  <span className="font-semibold">
                    {car.make} {car.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">Year:</span>
                  <span className="font-semibold">{car.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">Color:</span>
                  <span className="font-semibold">{car.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">
                    Daily Rate:
                  </span>
                  <span className="font-semibold">
                    ${formatPrice(car.price)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3 className="font-semibold text-lg mb-3">
                Personal Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">Name:</span>
                  <span className="font-semibold">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">Email:</span>
                  <span className="font-semibold">{personalInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">Phone:</span>
                  <span className="font-semibold">{personalInfo.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">Address:</span>
                  <span className="font-semibold text-right">
                    {personalInfo.address}, {personalInfo.city}{" "}
                    {personalInfo.zipCode}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3 className="font-semibold text-lg mb-3">Booking Period</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">Pickup:</span>
                  <span className="font-semibold">
                    {new Date(bookingDates.pickupDate).toLocaleDateString()} at{" "}
                    {bookingDates.pickupTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">Return:</span>
                  <span className="font-semibold">
                    {new Date(bookingDates.dropoffDate).toLocaleDateString()} at{" "}
                    {bookingDates.dropoffTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-fg-muted)]">
                    Duration:
                  </span>
                  <span className="font-semibold">
                    {totalDays} day{totalDays > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.costSummary}>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total Cost:</span>
                <span className="text-3xl font-bold text-[var(--color-primary)]">
                  ${formatPrice(totalCost)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <div className={styles.stepContent}>
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

            <div className="mb-6">
              <label className={styles.label}>
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid gap-3 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() =>
                    setPayment({ ...payment, paymentMethod: "credit_card" })
                  }
                  className={`${styles.paymentMethod} ${
                    payment.paymentMethod === "credit_card"
                      ? styles.paymentMethodActive
                      : ""
                  }`}
                >
                  <CreditCard size={24} />
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPayment({ ...payment, paymentMethod: "debit_card" })
                  }
                  className={`${styles.paymentMethod} ${
                    payment.paymentMethod === "debit_card"
                      ? styles.paymentMethodActive
                      : ""
                  }`}
                >
                  <CreditCard size={24} />
                  <span>Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPayment({ ...payment, paymentMethod: "paypal" })
                  }
                  className={`${styles.paymentMethod} ${
                    payment.paymentMethod === "paypal"
                      ? styles.paymentMethodActive
                      : ""
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.76-4.852a.932.932 0 0 1 .922-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.66-4.46z" />
                  </svg>
                  <span>PayPal</span>
                </button>
              </div>
            </div>

            {(payment.paymentMethod === "credit_card" ||
              payment.paymentMethod === "debit_card") && (
              <div className={`${styles.cardInfo}`}>
                <div className={`${styles.cardInfoCard}`}>
                  <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={payment.cardNumber || ""}
                    onChange={(e) =>
                      setPayment({ ...payment, cardNumber: e.target.value })
                    }
                    className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl} ${
                      errors.cardNumber ? "border-red-500" : ""
                    }`}
                    style={{
                      background: "var(--color-bg-elevated)",
                      color: payment.cardNumber
                        ? "var(--color-fg)"
                        : "var(--color-fg-muted)",
                      borderColor: errors.cardNumber
                        ? "#ef4444"
                        : "var(--color-border)",
                      transition:
                        "background 0.2s, color 0.2s, border-color 0.2s",
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className={`${styles.cardInfoCard}`}>
                  <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                    Cardholder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={payment.cardName || ""}
                    onChange={(e) =>
                      setPayment({ ...payment, cardName: e.target.value })
                    }
                    className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl}`}
                    style={{
                      background: "var(--color-bg-elevated)",
                      color: payment.cardName
                        ? "var(--color-fg)"
                        : "var(--color-fg-muted)",
                      borderColor: "var(--color-border)",
                      transition:
                        "background 0.2s, color 0.2s, border-color 0.2s",
                    }}
                    placeholder="John Doe"
                  />
                </div>

                <div className={`${styles.cardInfoExpiryCvv}`}>
                  <div>
                    <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={payment.expiryDate || ""}
                      onChange={(e) =>
                        setPayment({ ...payment, expiryDate: e.target.value })
                      }
                      className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl}`}
                      style={{
                        background: "var(--color-bg-elevated)",
                        color: payment.expiryDate
                          ? "var(--color-fg)"
                          : "var(--color-fg-muted)",
                        borderColor: "var(--color-border)",
                        transition:
                          "background 0.2s, color 0.2s, border-color 0.2s",
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <label className={`${searchFormStyles.fieldLabel} mb-2`}>
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={payment.cvv || ""}
                      onChange={(e) =>
                        setPayment({ ...payment, cvv: e.target.value })
                      }
                      className={`h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${searchFormStyles.fieldControl}`}
                      style={{
                        background: "var(--color-bg-elevated)",
                        color: payment.cvv
                          ? "var(--color-fg)"
                          : "var(--color-fg-muted)",
                        borderColor: "var(--color-border)",
                        transition:
                          "background 0.2s, color 0.2s, border-color 0.2s",
                      }}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {payment.paymentMethod === "paypal" && (
              <div className={styles.paypalInfo}>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  You will be redirected to PayPal to complete your payment
                  securely.
                </p>
              </div>
            )}

            <div className={styles.costSummary}>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Amount to Pay:</span>
                <span className="text-2xl font-bold text-[var(--color-primary)]">
                  ${formatPrice(totalCost)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={styles.navigation}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className={styles.buttonSecondary}
            >
              Back
            </button>
          )}
          {currentStep < 4 && (
            <button
              type="button"
              onClick={handleNext}
              className={styles.buttonPrimary}
            >
              Continue
              <ChevronRight size={20} />
            </button>
          )}
          {currentStep === 4 && (
            <button
              type="button"
              onClick={handleConfirmBooking}
              className={styles.buttonPrimary}
            >
              Confirm & Pay
              <Check size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
