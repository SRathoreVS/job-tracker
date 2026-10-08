import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ApplicationStatus, JobApplication } from "../types";
import { STATUS_LABEL, STATUS_ORDER } from "../types";
import { StatusPill } from "./StatusPill";
import { MoveMenu } from "./MoveMenu";

interface Props {
  jobs: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (id: number) => void;
  onMoveStatus: (id: number, status: ApplicationStatus) => void;
}

export function Board({ jobs, onEdit, onDelete, onMoveStatus }: Props) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    // Mouse/touch: 6px of movement before a drag starts, so a click
    // on the card isn't accidentally interpreted as a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // Keyboard: Space to pick up, arrows to move, Space to drop, Esc to cancel.
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Group jobs into columns so we can render each column independently.
  const columns = useMemo(() => {
    const map = new Map<ApplicationStatus, JobApplication[]>();
    for (const s of STATUS_ORDER) map.set(s, []);
    for (const j of jobs) map.get(j.status)?.push(j);
    return map;
  }, [jobs]);

  const activeJob =
    activeId != null ? (jobs.find((j) => j.id === activeId) ?? null) : null;

  function handleDragStart(e: DragStartEvent) {
    setActiveId(Number(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const jobId = Number(active.id);
    const overId = String(over.id);

    const dragged = jobs.find((j) => j.id === jobId);
    if (!dragged) return;

    // The `over` element can be either a column (id = status name)
    // or another card (id = job id). Handle both.
    const targetStatus: ApplicationStatus | null = STATUS_ORDER.includes(
      overId as ApplicationStatus,
    )
      ? (overId as ApplicationStatus)
      : (jobs.find((j) => String(j.id) === overId)?.status ?? null);

    if (!targetStatus || targetStatus === dragged.status) return;

    onMoveStatus(jobId, targetStatus);
  }

  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <h2>No applications yet</h2>
        <p>Click “Add application” to log your first one.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="board" role="list">
        {STATUS_ORDER.map((status) => {
          const items = columns.get(status) ?? [];
          return (
            <Column
              key={status}
              status={status}
              items={items}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveStatus={onMoveStatus}
            />
          );
        })}
      </div>

      {/* What follows the cursor while dragging. */}
      <DragOverlay>
        {activeJob ? (
          <div className="card card-dragging">
            <div className="card-title">{activeJob.role}</div>
            <div className="card-company">{activeJob.company}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

interface ColumnProps {
  status: ApplicationStatus;
  items: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (id: number) => void;
  onMoveStatus: (id: number, status: ApplicationStatus) => void;
}

function Column({
  status,
  items,
  onEdit,
  onDelete,
  onMoveStatus,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppableColumn(status);

  return (
    <section
      ref={setNodeRef}
      className={`board-column column-${status.toLowerCase()}${isOver ? " is-over" : ""}`}
      aria-label={`${STATUS_LABEL[status]} column, ${items.length} items`}
    >
      <header className="column-header">
        <span className="column-dot" aria-hidden="true" />
        <h3>{STATUS_LABEL[status]}</h3>
        <span className="column-count">{items.length}</span>
      </header>

      <SortableContext
        id={status}
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="column-list" data-column-id={status}>
          {items.map((job) => (
            <SortableCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveStatus={onMoveStatus}
            />
          ))}
          {items.length === 0 && (
            <li className="card-empty" role="listitem">
              Drop here or click “Add application”
            </li>
          )}
        </ul>
      </SortableContext>
    </section>
  );
}

function useDroppableColumn(status: ApplicationStatus) {
  // We only need the ref + isOver flag. Using `useSortable` with
  // `disabled: true` gives us a stable id equal to the status name,
  // which is what `handleDragEnd` looks for.
  const { setNodeRef, isOver } = useSortable({
    id: status,
    disabled: true,
  });
  return { setNodeRef, isOver };
}

interface CardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: number) => void;
  onMoveStatus: (id: number, status: ApplicationStatus) => void;
}

function SortableCard({ job, onEdit, onDelete, onMoveStatus }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="card"
      role="listitem"
      {...attributes}
      {...listeners}
    >
      <div className="card-title">{job.role}</div>
      <div className="card-company">{job.company}</div>
      <div className="card-footer">
        <time dateTime={job.appliedDate}>{job.appliedDate}</time>
        <div className="card-actions">
          <StatusPill status={job.status} />
          <button
            type="button"
            className="icon-button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(job);
            }}
            aria-label={`Edit ${job.role} at ${job.company}`}
            title="Edit"
          >
            <EditIcon />
          </button>
          <MoveMenu
            current={job.status}
            onMove={(s) => onMoveStatus(job.id, s)}
          />
          <button
            type="button"
            className="icon-button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job.id);
            }}
            aria-label={`Delete ${job.role} at ${job.company}`}
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </li>
  );
}

function EditIcon() {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z" />
    </svg>
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
