import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CreateJobRequest } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateJobRequest) => Promise<void>;
}

export function AddApplicationModal({ open, onClose, onCreate }: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [appliedDate, setAppliedDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus the first field when the modal opens, and close on Escape.
  useEffect(() => {
    if (!open) return;
    firstInputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({
        company: company.trim(),
        role: role.trim(),
        appliedDate,
      });
      setCompany("");
      setRole("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="modal-title">Add application</h2>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="field">
            <label htmlFor="m-company">Company</label>
            <input
              id="m-company"
              ref={firstInputRef}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              maxLength={120}
              placeholder="Acme Corp"
            />
          </div>

          <div className="field">
            <label htmlFor="m-role">Role</label>
            <input
              id="m-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              maxLength={120}
              placeholder="Frontend Developer"
            />
          </div>

          <div className="field">
            <label htmlFor="m-date">Applied on</label>
            <input
              id="m-date"
              type="date"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              required
            />
          </div>

          <footer className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Adding…" : "Add application"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
