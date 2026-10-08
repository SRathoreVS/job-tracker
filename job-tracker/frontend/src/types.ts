export type ApplicationStatus = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export interface JobApplication {
  id: number;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string; // ISO date, e.g. "2026-05-12"
  notes?: string;
  url?: string;
}

export interface CreateJobRequest {
  company: string;
  role: string;
  appliedDate: string;
  notes?: string;
  url?: string;
}
