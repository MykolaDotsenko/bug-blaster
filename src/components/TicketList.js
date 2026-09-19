import TicketItem from "./TicketItem";

export default function TicketList({
  tickets,
  hasAnyTickets,
  onEdit,
  onDelete,
  onStatusChange,
  onClearFilters,
}) {
  if (!hasAnyTickets) {
    return (
      <div className="empty-state">
        <span className="empty-state__mark" aria-hidden="true">
          ✓
        </span>
        <h3>Queue cleared</h3>
        <p>
          No bug reports yet. Capture the next issue before it becomes an
          incident.
        </p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__mark" aria-hidden="true">
          ∅
        </span>
        <h3>No matching signal</h3>
        <p>Nothing matches the current search and filters.</p>
        <button type="button" className="secondary-button" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-list" aria-live="polite">
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket.id}
          ticket={ticket}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
