"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type ToastType = "info" | "success" | "error";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const next: ToastItem = { id, message, type };
    setToasts((s) => [next, ...s]);
    // Auto remove after 4s
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999 }} aria-live="polite">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {toasts.map((t) => (
            <div
              key={t.id}
              role="status"
              style={{
                minWidth: 240,
                maxWidth: 360,
                padding: "10px 14px",
                borderRadius: 8,
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                background: t.type === "error" ? "#fee2e2" : t.type === "success" ? "#ecfdf5" : "#eef2ff",
                color: t.type === "error" ? "#991b1b" : t.type === "success" ? "#065f46" : "#312e81",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 14 }}>{t.message}</div>
                <button
                  onClick={() => remove(t.id)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "inherit" }}
                  aria-label="Dismiss toast"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
