import type { JobApplication, ApplicationStatus } from "../types";
import { STATUS_LABEL, STATUS_ORDER } from "../types";

interface Props {
  jobs: JobApplication[];
  onDelete: (id: number) => void;
}

export function Board({ jobs, onDelete }: Props) {
  const byStatus = (status: ApplicationStatus) =>
    jobs.filter((j) => j.status === status);

  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <h2>No applications yet</h2>
        <p>Click “Add application” to log your first one.</p>
      </div>
    );
  }

  return (
    <div className="board" role="list">
      {STATUS_ORDER.map((status) => {
        const column = byStatus(status);
        return (
          <section
            key={status}
            className={`board-column column-${status.toLowerCase()}`}
            aria-label={`${STATUS_LABEL[status]} column, ${column.length} items`}
          >
            <header className="column-header">
              <span className="column-dot" aria-hidden="true" />
              <h3>{STATUS_LABEL[status]}</h3>
              <span className="column-count">{column.length}</span>
            </header>

            <ul className="column-list">
              {column.map((job) => (
                <li key={job.id} className="card" role="listitem">
                  <div className="card-title">{job.role}</div>
                  <div className="card-company">{job.company}</div>
                  <div className="card-footer">
                    <time dateTime={job.appliedDate}>{job.appliedDate}</time>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => onDelete(job.id)}
                      aria-label={`Delete ${job.role} at ${job.company}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))}
              {column.length === 0 && (
                <li className="card-empty" role="listitem">
                  Nothing here yet
                </li>
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
