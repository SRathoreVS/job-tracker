import type { JobApplication } from '../types';

interface Props {
  jobs: JobApplication[];
  onDelete: (id: number) => void;
}

export function JobList({ jobs, onDelete }: Props) {
  if (jobs.length === 0) {
    return <p className="empty">No applications yet. Add your first one above.</p>;
  }

  return (
    <ul className="job-list">
      {jobs.map((job) => (
        <li key={job.id} className="job-item">
          <div>
            <strong>{job.role}</strong> at {job.company}
            <span className={`status status-${job.status.toLowerCase()}`}>
              {job.status}
            </span>
            <time dateTime={job.appliedDate}> · applied {job.appliedDate}</time>
          </div>
          <button
            onClick={() => onDelete(job.id)}
            aria-label={`Delete ${job.role} at ${job.company}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
