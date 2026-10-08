import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  loadTheme,
  saveTheme,
  type Theme,
  type ThemeMode,
} from "./theme";

interface ThemeContextValue {
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  setCustom: (
    patch: Partial<Pick<Theme, "customBg" | "customFg" | "customAccent">>,
  ) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => loadTheme());

  // Whenever the theme changes, save it and apply it to the DOM.
  useEffect(() => {
    saveTheme(theme);
    applyTheme(theme);
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    setMode: (mode) => setTheme((t) => ({ ...t, mode })),
    setCustom: (patch) => setTheme((t) => ({ ...t, ...patch })),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
