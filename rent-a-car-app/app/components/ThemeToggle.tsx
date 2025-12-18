"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    // Avoid hydration mismatch: render nothing until client-side mount
    return null;
  }
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150"
      style={{
        background: "var(--color-bg-elevated)",
        color: "var(--color-fg)",
        border: "1px solid var(--color-border)",
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
        cursor: "pointer",
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
