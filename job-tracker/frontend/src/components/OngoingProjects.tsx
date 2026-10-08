import type { JobApplication } from "../types";

interface Props {
  jobs: JobApplication[];
}

/**
 * The apps you're actually still waiting on. We consider
 * anything not in OFFER or REJECTED to be "ongoing".
 */
export function OngoingProjects({ jobs }: Props) {
  const ongoing = jobs.filter(
    (j) => j.status === "APPLIED" || j.status === "INTERVIEW",
  );

  if (ongoing.length === 0) {
    return null;
  }

  return (
    <section className="ongoing" aria-label="Ongoing applications">
      <header className="ongoing-header">
        <h2>Ongoing</h2>
        <span className="ongoing-count">{ongoing.length}</span>
      </header>

      <ul className="ongoing-list">
        {ongoing.slice(0, 6).map((job) => (
          <li key={job.id} className="ongoing-item">
            <span className="ongoing-initial" aria-hidden="true">
              {initials(job.company)}
            </span>
            <div className="ongoing-meta">
              <div className="ongoing-role">{job.role}</div>
              <div className="ongoing-company">{job.company}</div>
            </div>
            <span className={`pill pill-${job.status.toLowerCase()}`}>
              {job.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
