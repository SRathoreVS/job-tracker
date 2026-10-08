import type {
  ApplicationStatus,
  CreateJobRequest,
  JobApplication,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || `Request failed with ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

interface ListFilters {
  status?: ApplicationStatus;
  q?: string;
}

export const jobsApi = {
  list: (filters: ListFilters = {}): Promise<JobApplication[]> => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.q) params.set("q", filters.q);
    const qs = params.toString();
    return fetch(`${API_URL}/api/jobs${qs ? `?${qs}` : ""}`).then(handle);
  },

  get: (id: number): Promise<JobApplication> =>
    fetch(`${API_URL}/api/jobs/${id}`).then(handle),

  create: (body: CreateJobRequest): Promise<JobApplication> =>
    fetch(`${API_URL}/api/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handle),

  update: (id: number, body: CreateJobRequest): Promise<JobApplication> =>
    fetch(`${API_URL}/api/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handle),

  updateStatus: (
    id: number,
    status: ApplicationStatus,
  ): Promise<JobApplication> =>
    fetch(`${API_URL}/api/jobs/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then(handle),

  remove: (id: number): Promise<void> =>
    fetch(`${API_URL}/api/jobs/${id}`, { method: "DELETE" }).then(handle),
};
