interface Props {
  onAdd: () => void;
}

export function TopBar({ onAdd }: Props) {
  return (
    <header className="topbar">
      <div>
        <h1 className="page-title">Applications</h1>
        <p className="page-subtitle">Track every role you’ve applied to.</p>
      </div>

      <div className="topbar-actions">
        <input
          type="search"
          className="search"
          placeholder="Search company or role…"
          aria-label="Search applications"
          disabled
          title="Coming in week 2"
        />
        <button type="button" className="btn-primary" onClick={onAdd}>
          + Add application
        </button>
      </div>
    </header>
  );
}
