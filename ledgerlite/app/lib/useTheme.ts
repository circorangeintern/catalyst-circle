"use client";

import { useEffect, useState } from "react";

export type ThemeType = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeType>("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("ledgerlite-theme") as ThemeType) || "light";
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (targetTheme: ThemeType) => {
    const root = window.document.documentElement;
    const isDark =
      targetTheme === "dark" ||
      (targetTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("ledgerlite-theme", newTheme);
    applyTheme(newTheme);
  };

  return { theme, setTheme };
}
