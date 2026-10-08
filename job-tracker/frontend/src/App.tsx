import { useEffect, useState } from 'react';

import { TopBar } from "./components/TopBar";
import { KpiRow } from "./components/KpiRow";
import { Board } from "./components/Board";
import { AddApplicationModal } from "./components/AddApplicationModal";
import { jobsApi } from './api/jobs';
import type { CreateJobRequest, JobApplication } from './types';
import './styles.css';
import { Sidebar } from "./components/SideBar";

export default function App() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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
      setJobs((prev) => [created, ...prev]);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: number) {
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
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <TopBar onAdd={() => setModalOpen(true)} />

        {error && (
          <div role="alert" className="error">
            {error}
          </div>
        )}

        <KpiRow jobs={jobs} />

        {loading ? (
          <p className="loading">Loading…</p>
        ) : (
          <Board jobs={jobs} onDelete={handleDelete} />
        )}
      </main>

      <AddApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}