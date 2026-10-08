import { useState, type FormEvent } from 'react';
import type { CreateJobRequest } from '../types';

interface Props {
  onCreate: (data: CreateJobRequest) => Promise<void>;
}

export function JobForm({ onCreate }: Props) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [appliedDate, setAppliedDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    setSubmitting(true);
    try {
      await onCreate({ company: company.trim(), role: role.trim(), appliedDate });
      setCompany('');
      setRole('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="job-form" onSubmit={handleSubmit} aria-label="Add a job application">
      <div className="field">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          maxLength={120}
          placeholder="Acme Corp"
        />
      </div>

      <div className="field">
        <label htmlFor="role">Role</label>
        <input
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          maxLength={120}
          placeholder="Frontend Developer"
        />
      </div>

      <div className="field">
        <label htmlFor="appliedDate">Applied on</label>
        <input
          id="appliedDate"
          type="date"
          value={appliedDate}
          onChange={(e) => setAppliedDate(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add application'}
      </button>
    </form>
  );
}
