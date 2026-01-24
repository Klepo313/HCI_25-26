"use client";

import { useAuth } from "../components/AuthProvider";

export default function Page() {
  const { user } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-start p-10 gap-6">
      <div>
        <h1 className="text-3xl font-bold">User Profile</h1>
        {!user ? (
          <p className="text-sm text-[var(--color-fg-muted)]">
            You are not signed in.
          </p>
        ) : (
          <div className="mt-4">
            <p className="font-semibold">
              Name: <span className="font-normal">{user.name ?? "/"}</span>
            </p>
            <p className="font-semibold">
              Username:{" "}
              <span className="font-normal">{user.username ?? "/"}</span>
            </p>
            <p className="font-semibold">
              Email: <span className="font-normal">{user.email}</span>
            </p>
          </div>
        )}
      </div>

      <section className="w-full max-w-2xl rounded-md border p-4">
        <h2 className="text-xl font-semibold">My reservations</h2>
        <p className="text-sm text-[var(--color-fg-muted)] mt-2">
          This section will show your reservations once the API is implemented.
        </p>
      </section>
    </main>
  );
}
