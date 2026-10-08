import type { CreateJobRequest, JobApplication } from '../types';

// Vite injects VITE_* env vars at build time. We'll set VITE_API_URL
// on Vercel. Locally it falls back to the Spring dev server.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // Read the body once — some errors return JSON, some plain text.
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || `Request failed with ${res.status}`);
  }
  // 204 No Content has no body.
  return res.status === 204 ? (undefined as T) : res.json();
}

export const jobsApi = {
  list: (): Promise<JobApplication[]> =>
    fetch(`${API_URL}/api/jobs`).then(handle),

  create: (body: CreateJobRequest): Promise<JobApplication> =>
    fetch(`${API_URL}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handle),

  remove: (id: number): Promise<void> =>
    fetch(`${API_URL}/api/jobs/${id}`, { method: 'DELETE' }).then(handle),
};
