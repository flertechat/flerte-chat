import React, { createContext, useContext, useEffect, useState } from "react";

type ColorTheme = "light" | "dark";

interface ThemeContextType {
  colorTheme: ColorTheme;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ColorTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem("colorTheme");
    return (stored as ColorTheme) || defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("dark");

    // Add current theme class
    if (colorTheme === "dark") {
      root.classList.add("dark");
    }
    // Light theme is default (no class needed)

    // Save to localStorage
    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme]);

  const cycleTheme = () => {
    setColorTheme(prev => {
      if (prev === "light") return "dark";
      return "light";
    });
  };

  return (
    <ThemeContext.Provider value={{ colorTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
