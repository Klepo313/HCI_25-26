"use client";

import { useState } from "react";
import { z } from "zod";
import searchFormStyles from "../components/SearchForm.module.scss";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Page() {
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length) nextErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(nextErrors);
      setStatus("error");
      return;
    }

    // Mock success path
    setStatus("success");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--color-bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-fg)]">Create an account</h1>
          <p className="text-[var(--color-fg-muted)] mt-2">Register to book and manage your rentals.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--glass-bg)] p-6 shadow"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className={searchFormStyles.fieldLabel}>First name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="John"
                className={`h-11 rounded-md border px-3 text-sm ${searchFormStyles.fieldControl} ${errors.firstName ? "border-red-500" : ""}`}
                style={{
                  background: "var(--color-bg-elevated)",
                  color: form.firstName ? "var(--color-fg)" : "var(--color-fg-muted)",
                  borderColor: errors.firstName ? "#ef4444" : "var(--color-border)",
                }}
              />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className={searchFormStyles.fieldLabel}>Last name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Doe"
                className={`h-11 rounded-md border px-3 text-sm ${searchFormStyles.fieldControl} ${errors.lastName ? "border-red-500" : ""}`}
                style={{
                  background: "var(--color-bg-elevated)",
                  color: form.lastName ? "var(--color-fg)" : "var(--color-fg-muted)",
                  borderColor: errors.lastName ? "#ef4444" : "var(--color-border)",
                }}
              />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={searchFormStyles.fieldLabel}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={`h-11 rounded-md border px-3 text-sm ${searchFormStyles.fieldControl} ${errors.email ? "border-red-500" : ""}`}
              style={{
                background: "var(--color-bg-elevated)",
                color: form.email ? "var(--color-fg)" : "var(--color-fg-muted)",
                borderColor: errors.email ? "#ef4444" : "var(--color-border)",
              }}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className={searchFormStyles.fieldLabel}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className={`h-11 rounded-md border px-3 text-sm ${searchFormStyles.fieldControl} ${errors.password ? "border-red-500" : ""}`}
                style={{
                  background: "var(--color-bg-elevated)",
                  color: form.password ? "var(--color-fg)" : "var(--color-fg-muted)",
                  borderColor: errors.password ? "#ef4444" : "var(--color-border)",
                }}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className={searchFormStyles.fieldLabel}>Confirm password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className={`h-11 rounded-md border px-3 text-sm ${searchFormStyles.fieldControl} ${errors.confirmPassword ? "border-red-500" : ""}`}
                style={{
                  background: "var(--color-bg-elevated)",
                  color: form.confirmPassword ? "var(--color-fg)" : "var(--color-fg-muted)",
                  borderColor: errors.confirmPassword ? "#ef4444" : "var(--color-border)",
                }}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-70"
          >
            {status === "submitting" ? "Creating account..." : "Create account"}
          </button>

          {status === "success" && (
            <p className="text-sm text-green-600 text-center">Account created successfully (mock)</p>
          )}
          {status === "error" && Object.keys(errors).length === 0 && (
            <p className="text-sm text-red-500 text-center">Please check the fields above.</p>
          )}

          <p className="text-sm text-center text-[var(--color-fg-muted)]">
            Already have an account? <a href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Log in here</a>.
          </p>
        </form>
      </div>
    </main>
  );
}
