import { ThemeSwitcher } from "./ThemeSwitcher";

interface Props {
  onAdd: () => void;
}

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TopBar({ onAdd }: Props) {
  return (
    <header className="topbar">
      <div>
        <h1 className="page-title">Applications</h1>
        <p className="page-subtitle">Track every role you’ve applied to.</p>
      </div>

      <div className="topbar-actions">
        <div className="date-chip" aria-label={`Today is ${formatToday()}`}>
          <CalendarIcon />
          <span>{formatToday()}</span>
        </div>

        <input
          type="search"
          className="search"
          placeholder="Search company or role…"
          aria-label="Search applications"
          disabled
          title="Coming in week 2"
        />

        <ThemeSwitcher />

        <button type="button" className="btn-primary" onClick={onAdd}>
          + Add application
        </button>
      </div>
    </header>
  );
}

export function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
