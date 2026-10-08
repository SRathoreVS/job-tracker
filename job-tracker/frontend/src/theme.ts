export type ThemeMode = "light" | "dark" | "grey" | "custom";

export interface Theme {
  mode: ThemeMode;
  /** Only used when mode === 'custom' */
  customBg: string;
  customFg: string;
  customAccent: string;
}

export const DEFAULT_THEME: Theme = {
  mode: "light",
  customBg: "#f8fafc",
  customFg: "#0f172a",
  customAccent: "#0f766e",
};

const STORAGE_KEY = "jobtracker.theme";

export function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME;
    return { ...DEFAULT_THEME, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
}

/**
 * Applies the theme by setting CSS variables on <html>.
 * Everything in styles.css reads from these variables,
 * so changing them here instantly re-themes the whole app.
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.dataset.theme = theme.mode;

  if (theme.mode === "custom") {
    root.style.setProperty("--bg", theme.customBg);
    root.style.setProperty("--text", theme.customFg);
    root.style.setProperty("--accent", theme.customAccent);
    // Derive a slightly darker hover from the accent using color-mix
    root.style.setProperty(
      "--accent-hover",
      `color-mix(in srgb, ${theme.customAccent} 82%, black)`,
    );
    root.style.setProperty(
      "--accent-soft",
      `color-mix(in srgb, ${theme.customAccent} 15%, transparent)`,
    );
  } else {
    // Clear any inline overrides from a previous custom theme
    root.style.removeProperty("--bg");
    root.style.removeProperty("--text");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--accent-hover");
    root.style.removeProperty("--accent-soft");
  }
}
