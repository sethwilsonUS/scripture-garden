"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <Sun aria-hidden="true" className="theme-toggle__icon light-icon" />
      <Moon aria-hidden="true" className="theme-toggle__icon dark-icon" />
      <span className="sr-only">Toggle color theme</span>
    </button>
  );
}
