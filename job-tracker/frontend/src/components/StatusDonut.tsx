import type { JobApplication, ApplicationStatus } from "../types";
import { STATUS_LABEL, STATUS_ORDER } from "../types";

interface Props {
  jobs: JobApplication[];
}

const COLORS: Record<ApplicationStatus, string> = {
  APPLIED: "#3b82f6",
  INTERVIEW: "#f59e0b",
  OFFER: "#10b981",
  REJECTED: "#ef4444",
};

// Radius and stroke are arbitrary but tuned so the ring looks right at 140px.
const SIZE = 140;
const STROKE = 16;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export function StatusDonut({ jobs }: Props) {
  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: jobs.filter((j) => j.status === status).length,
  }));
  const total = counts.reduce((sum, c) => sum + c.count, 0);

  if (total === 0) {
    return (
      <div className="donut-wrap">
        <div className="donut-empty">No data yet</div>
      </div>
    );
  }

  let offset = 0;

  return (
    <div className="donut-wrap">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Applications by status: ${counts
          .map((c) => `${STATUS_LABEL[c.status]} ${c.count}`)
          .join(", ")}`}
      >
        {/* Rotate so slices start at 12 o'clock */}
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          {/* Background ring so the donut is visible when only one slice exists */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="var(--border)"
            strokeWidth={STROKE}
          />
          {counts.map((c) => {
            if (c.count === 0) return null;
            const fraction = c.count / total;
            const dash = fraction * C;
            const gap = C - dash;
            // Negative offset moves each slice start forward along the circle
            const circle = (
              <circle
                key={c.status}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={COLORS[c.status]}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return circle;
          })}
        </g>
        <text x="50%" y="47%" textAnchor="middle" className="donut-total">
          {total}
        </text>
        <text x="50%" y="62%" textAnchor="middle" className="donut-caption">
          total
        </text>
      </svg>

      <ul className="donut-legend">
        {counts.map((c) => (
          <li key={c.status}>
            <span
              className="legend-dot"
              style={{ background: COLORS[c.status] }}
              aria-hidden="true"
            />
            <span className="legend-label">{STATUS_LABEL[c.status]}</span>
            <span className="legend-value">{c.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
