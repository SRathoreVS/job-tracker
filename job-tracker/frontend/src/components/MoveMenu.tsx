import { useEffect, useRef, useState } from "react";
import type { ApplicationStatus } from "../types";
import { STATUS_LABEL, STATUS_ORDER } from "../types";

interface Props {
  current: ApplicationStatus;
  onMove: (status: ApplicationStatus) => void;
}

/**
 * Small "Move to →" dropdown. This is what keyboard and screen-reader
 * users will use; DnD is the mouse/touch path. Same API, two entry points.
 */
export function MoveMenu({ current, onMove }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
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

  const options = STATUS_ORDER.filter((s) => s !== current);

  return (
    <div className="move-menu" ref={ref}>
      <button
        type="button"
        className="icon-button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Move to another column"
        title="Move to…"
      >
        <ArrowIcon />
      </button>

      {open && (
        <div className="move-popover" role="menu">
          <div className="move-title">Move to</div>
          {options.map((s) => (
            <button
              key={s}
              type="button"
              role="menuitem"
              className="move-option"
              onClick={() => {
                onMove(s);
                setOpen(false);
              }}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
