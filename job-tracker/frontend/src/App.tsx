import { useEffect, useState } from "react";

import { TopBar } from "./components/TopBar";
import { KpiRow } from "./components/KpiRow";
import { StatusDonut } from "./components/StatusDonut";
import { OngoingProjects } from "./components/OngoingProjects";
import { Board } from "./components/Board";
import { AddApplicationModal } from "./components/AddApplicationModal";
import { EditApplicationModal } from "./components/EditApplicationModal";
import { jobsApi } from "./api/jobs";
import type {
  ApplicationStatus,
  CreateJobRequest,
  JobApplication,
} from "./types";
import { ThemeProvider } from "./ThemeContext";
import "./styles.css";
import { Sidebar } from "./components/SideBar";

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

function Dashboard() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    jobsApi
      .list()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Client-side search. Server-side search lands when the dataset grows.
  const filteredJobs = search.trim()
    ? jobs.filter((j) => {
        const needle = search.toLowerCase();
        return (
          j.company.toLowerCase().includes(needle) ||
          j.role.toLowerCase().includes(needle)
        );
      })
    : jobs;

  async function handleCreate(data: CreateJobRequest) {
    try {
      const created = await jobsApi.create(data);
      setJobs((prev) => [created, ...prev]);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleUpdate(id: number, data: CreateJobRequest) {
    try {
      const updated = await jobsApi.update(id, data);
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
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

  async function handleMoveStatus(id: number, status: ApplicationStatus) {
    const previous = jobs;
    // Optimistic: move the card now, revert if the server disagrees.
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    try {
      const updated = await jobsApi.updateStatus(id, status);
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
    } catch (e) {
      setJobs(previous);
      setError((e as Error).message);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <TopBar
          onAdd={() => setAddOpen(true)}
          search={search}
          onSearch={setSearch}
        />

        {error && (
          <div role="alert" className="error">
            {error}
          </div>
        )}

        <div className="overview">
          <KpiRow jobs={filteredJobs} />
          <StatusDonut jobs={filteredJobs} />
        </div>

        <OngoingProjects jobs={filteredJobs} />

        {loading ? (
          <p className="loading">Loading…</p>
        ) : (
          <Board
            jobs={filteredJobs}
            onEdit={setEditing}
            onDelete={handleDelete}
            onMoveStatus={handleMoveStatus}
          />
        )}
      </main>

      <AddApplicationModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={handleCreate}
      />

      <EditApplicationModal
        job={editing}
        onClose={() => setEditing(null)}
        onSave={handleUpdate}
      />
    </div>
  );
}
