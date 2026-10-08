import { useEffect, useState } from 'react';
import { JobForm } from './components/JobForm';
import { JobList } from './components/JobList';
import { jobsApi } from './api/jobs';
import type { CreateJobRequest, JobApplication } from './types';
import './styles.css';

export default function App() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi
      .list()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(data: CreateJobRequest) {
    try {
      const created = await jobsApi.create(data);
      // Prepend so newest shows first, matching the backend's ordering.
      setJobs((prev) => [created, ...prev]);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: number) {
    // Optimistic update: remove from UI first, restore on failure.
    const previous = jobs;
    setJobs((prev) => prev.filter((j) => j.id !== id));
    try {
      await jobsApi.remove(id);
    } catch (e) {
      setJobs(previous);
      setError((e as Error).message);
    }
  }

  return (
    <main className="app">
      <h1>Job Application Tracker</h1>
      <p className="subtitle">Keep track of every role you've applied to.</p>

      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}

      <JobForm onCreate={handleCreate} />

      <section aria-label="Your applications">
        {loading ? <p>Loading…</p> : <JobList jobs={jobs} onDelete={handleDelete} />}
      </section>
    </main>
  );
}
