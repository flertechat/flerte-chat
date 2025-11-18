import React, { createContext, useContext, useEffect, useState } from "react";

type ColorTheme = "coral" | "purple" | "teal" | "dark";

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
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem("colorTheme");
    // Always default to dark theme
    return (stored as ColorTheme) || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("theme-coral", "theme-purple", "theme-teal", "dark");

    // Add current theme class
    if (colorTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.add(`theme-${colorTheme}`);
    }

    // Save to localStorage
    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme]);

  const cycleTheme = () => {
    setColorTheme(prev => {
      if (prev === "coral") return "purple";
      if (prev === "purple") return "teal";
      if (prev === "teal") return "dark";
      return "coral";
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
