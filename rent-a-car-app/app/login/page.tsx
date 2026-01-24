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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length)
          nextErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(nextErrors);
      setStatus("error");
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const params = new URLSearchParams({
        email: form.identifier,
        password: form.password,
      });

      console.log("Logging in with:", form.identifier, form.password);

      const response = await fetch(`${baseUrl}/users?${params.toString()}`);

      if (!response.ok) {
        throw new Error("User not found. Invalid email or password.");
      }

      const contentType = response.headers.get("content-type") || "";
      let payload: unknown;
      if (contentType.includes("application/json")) {
        payload = await response.json();
      } else {
        const text = (await response.text()).trim();
        // Mock API sometimes returns plain string "Not found"
        if (text.toLowerCase() === "not found") {
          setErrors({ form: "Invalid email or password" });
          showToast("Invalid email or password", "error");
          setStatus("error");
          return;
        }
        throw new Error("Unexpected response format");
      }

      // If API returns a JSON string "Not found"
      if (
        typeof payload === "string" &&
        payload.toLowerCase() === "not found"
      ) {
        setErrors({ form: "Invalid email or password" });
        showToast("Invalid email or password", "error");
        setStatus("error");
        return;
      }

      const users = payload as unknown;

      // Check if user exists with matching credentials
      if (Array.isArray(users) && users.length > 0) {
        const user = users[0];
        localStorage.setItem("app-user", JSON.stringify(user));
        setStatus("success");
        showToast("Signed in successfully! Redirecting...", "success");
        setTimeout(() => {
          router.push("/user");
        }, 1500);
      } else {
        setErrors({ form: "Invalid email or password" });
        showToast("Invalid email or password", "error");
        setStatus("error");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred during login";
      setErrors({ form: message });
      showToast(message, "error");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--color-bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-fg)]">
            Welcome back
          </h1>
          <p className="text-[var(--color-fg-muted)] mt-2">
            Sign in to continue your booking.
          </p>
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
            {errors.identifier && (
              <p className="text-xs text-red-500">{errors.identifier}</p>
            )}
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
                color: form.password
                  ? "var(--color-fg)"
                  : "var(--color-fg-muted)",
                borderColor: errors.password
                  ? "#ef4444"
                  : "var(--color-border)",
              }}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-70"
          >
            {status === "submitting" ? "Signing in..." : "Sign in"}
          </button>

          {status === "success" && (
            <p className="text-sm text-green-600 text-center">
              Signed in successfully! Redirecting...
            </p>
          )}
          {errors.form && (
            <p className="text-sm text-red-500 text-center">{errors.form}</p>
          )}
          {status === "error" &&
            !errors.form &&
            Object.keys(errors).length === 0 && (
              <p className="text-sm text-red-500 text-center">
                Please check the fields above.
              </p>
            )}

          <p className="text-sm text-center text-[var(--color-fg-muted)]">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[var(--color-primary)] font-semibold hover:underline"
            >
              Create one here
            </a>
            .
          </p>
        </form>
      </div>
    </main>
  );
}
