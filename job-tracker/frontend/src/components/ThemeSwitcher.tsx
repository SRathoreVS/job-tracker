import { useEffect, useRef, useState } from "react";
import { useTheme } from "../ThemeContext";
import type { ThemeMode } from "../theme";

const MODES: { id: ThemeMode; label: string; swatch: string }[] = [
  { id: "light", label: "Light", swatch: "#f8fafc" },
  { id: "dark", label: "Dark", swatch: "#0f172a" },
  { id: "grey", label: "Grey", swatch: "#e2e8f0" },
];

export function ThemeSwitcher() {
  const { theme, setMode, setCustom } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click and Escape — small niceties that make it feel native.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="theme-switcher" ref={wrapRef}>
      <button
        type="button"
        className="icon-button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Change theme"
        title="Change theme"
      >
        <PaletteIcon />
      </button>

      {open && (
        <div className="theme-popover" role="dialog" aria-label="Theme">
          <div className="theme-group">
            <div className="theme-group-title">Mode</div>
            <div className="theme-modes">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`theme-mode${theme.mode === m.id ? " active" : ""}`}
                  onClick={() => setMode(m.id)}
                  aria-pressed={theme.mode === m.id}
                >
                  <span
                    className="swatch"
                    style={{ background: m.swatch }}
                    aria-hidden="true"
                  />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="theme-group">
            <div className="theme-group-title">Custom</div>
            <label className="color-row">
              <span>Background</span>
              <input
                type="color"
                value={theme.customBg}
                onChange={(e) => {
                  setCustom({ customBg: e.target.value });
                  setMode("custom");
                }}
              />
            </label>
            <label className="color-row">
              <span>Text</span>
              <input
                type="color"
                value={theme.customFg}
                onChange={(e) => {
                  setCustom({ customFg: e.target.value });
                  setMode("custom");
                }}
              />
            </label>
            <label className="color-row">
              <span>Accent</span>
              <input
                type="color"
                value={theme.customAccent}
                onChange={(e) => {
                  setCustom({ customAccent: e.target.value });
                  setMode("custom");
                }}
              />
            </label>
          </div>

          <button
            type="button"
            className="btn-ghost theme-reset"
            onClick={() => setMode("light")}
          >
            Reset to light
          </button>
        </div>
      )}
    </div>
  );
}

function PaletteIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.6-.4-1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.7-10-8.7z" />
    </svg>
  );
}
