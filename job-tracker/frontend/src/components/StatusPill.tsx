import type { ApplicationStatus } from "../types";
import { STATUS_LABEL } from "../types";

export function StatusPill({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`pill pill-${status.toLowerCase()}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
