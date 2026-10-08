import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CreateJobRequest, JobApplication } from "../types";

interface Props {
  job: JobApplication | null; // null = closed
  onClose: () => void;
  onSave: (id: number, data: CreateJobRequest) => Promise<void>;
}

export function EditApplicationModal({ job, onClose, onSave }: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Whenever a different job is opened, seed the fields from it.
  useEffect(() => {
    if (!job) return;
    setCompany(job.company);
    setRole(job.role);
    setAppliedDate(job.appliedDate);
    setNotes(job.notes ?? "");
    setUrl(job.url ?? "");
    firstInputRef.current?.focus();
  }, [job]);

  useEffect(() => {
    if (!job) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [job, onClose]);

  if (!job) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !appliedDate) return;
    setSubmitting(true);
    try {
      await onSave(job!.id, {
        company: company.trim(),
        role: role.trim(),
        appliedDate,
        notes: notes.trim() || undefined,
        url: url.trim() || undefined,
      });
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
        aria-labelledby="edit-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="edit-modal-title">Edit application</h2>
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
            <label htmlFor="e-company">Company</label>
            <input
              id="e-company"
              ref={firstInputRef}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div className="field">
            <label htmlFor="e-role">Role</label>
            <input
              id="e-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div className="field">
            <label htmlFor="e-date">Applied on</label>
            <input
              id="e-date"
              type="date"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="e-url">Job URL (optional)</label>
            <input
              id="e-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              maxLength={500}
              placeholder="https://…"
            />
          </div>

          <div className="field">
            <label htmlFor="e-notes">Notes (optional)</label>
            <textarea
              id="e-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="Recruiter name, next steps, anything useful…"
            />
          </div>

          <footer className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
