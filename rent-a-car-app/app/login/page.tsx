"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { useToast } from "../components/ToastProvider";
import { z } from "zod";
import searchFormStyles from "../components/SearchForm.module.scss";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Page() {
  const [form, setForm] = useState<LoginForm>({ identifier: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length) nextErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(nextErrors);
      setStatus("error");
      return;
    }

    // Call real login via AuthProvider
    login(form.identifier, form.password)
      .then(() => {
        setStatus("success");
        // redirect to home
        router.push("/");
      })
      .catch((err: any) => {
        setStatus("error");
        const message = err?.message ?? "Login failed";
        setErrors({ _global: message });
        try {
          showToast(message, "error");
        } catch (e) {
          // if toast provider missing, ignore
        }
      });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--color-bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-fg)]">Welcome back</h1>
          <p className="text-[var(--color-fg-muted)] mt-2">Sign in to continue your booking.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--glass-bg)] p-6 shadow"
        >
          <div className="flex flex-col gap-2">
            <label className={searchFormStyles.fieldLabel}>Username or email</label>
            <input
              type="text"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              placeholder="username or you@example.com"
              className={`h-11 rounded-md border px-3 text-sm ${searchFormStyles.fieldControl} ${errors.identifier ? "border-red-500" : ""}`}
              style={{
                background: "var(--color-bg-elevated)",
                color: form.identifier ? "var(--color-fg)" : "var(--color-fg-muted)",
                borderColor: errors.identifier ? "#ef4444" : "var(--color-border)",
              }}
            />
            {errors.identifier && <p className="text-xs text-red-500">{errors.identifier}</p>}
          </div>

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

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-70"
          >
            {status === "submitting" ? "Signing in..." : "Sign in"}
          </button>

          {status === "success" && (
            <p className="text-sm text-green-600 text-center">Signed in successfully (mock)</p>
          )}
          {status === "error" && Object.keys(errors).length === 0 && (
            <p className="text-sm text-red-500 text-center">Please check the fields above.</p>
          )}

          <p className="text-sm text-center text-[var(--color-fg-muted)]">
            Don’t have an account? <a href="/register" className="text-[var(--color-primary)] font-semibold hover:underline">Create one here</a>.
          </p>
        </form>
      </div>
    </main>
  );
}
