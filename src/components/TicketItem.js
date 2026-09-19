import {
  BUG_TYPES,
  STATUSES,
  getPriorityMeta,
  getStatusMeta,
} from "../domain/ticketModel";
import { formatRelativeTime } from "../utilities/sortingUtilities";

const typeLabel = (value) =>
  BUG_TYPES.find((type) => type.value === value)?.label || "Bug";

const displayId = (id) =>
  id.startsWith("BB-") ? id : `BB-${id.slice(0, 6).toUpperCase()}`;

export default function TicketItem({
  ticket,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const priority = getPriorityMeta(ticket.priority);
  const status = getStatusMeta(ticket.status);

  return (
    <article
      className={`ticket-card ticket-card--${priority.tone}`}
      aria-labelledby={`ticket-${ticket.id}`}
    >
      <div className="ticket-card__rail" aria-hidden="true" />

      <div className="ticket-card__content">
        <div className="ticket-card__topline">
          <div className="ticket-meta">
            <span className={`priority-badge priority-badge--${priority.tone}`}>
              {priority.code}
            </span>
            <span>{typeLabel(ticket.type)}</span>
            <span className="ticket-id">{displayId(ticket.id)}</span>
          </div>

          <span className={`status-badge status-badge--${status.tone}`}>
            <span className="status-badge__dot" aria-hidden="true" />
            {status.label}
          </span>
        </div>

        <div className="ticket-copy">
          <h3 id={`ticket-${ticket.id}`}>{ticket.title}</h3>
          <p>{ticket.description}</p>
        </div>

        <div className="ticket-card__footer">
          <div className="ticket-details">
            <span>
              <span aria-hidden="true">◉</span>{" "}
              {ticket.owner || "Unassigned"}
            </span>
            <span>
              Updated {formatRelativeTime(ticket.updatedAt)}
            </span>
          </div>

          <div className="ticket-actions">
            <label className="status-control">
              <span className="sr-only">Status for {ticket.title}</span>
              <select
                aria-label={`Status for ${ticket.title}`}
                value={ticket.status}
                onChange={(event) =>
                  onStatusChange(ticket.id, event.target.value)
                }
              >
                {Object.entries(STATUSES).map(([value, meta]) => (
                  <option value={value} key={value}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="icon-button"
              onClick={() => onEdit(ticket)}
              aria-label={`Edit ${ticket.title}`}
              title="Edit report"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="m4 20 4.2-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Zm9.8-12.6 3 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="icon-button icon-button--danger"
              onClick={() => onDelete(ticket)}
              aria-label={`Delete ${ticket.title}`}
              title="Delete report"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 7h14M9 7V5h6v2m-8 0 1 13h8l1-13M10 10v6m4-6v6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
