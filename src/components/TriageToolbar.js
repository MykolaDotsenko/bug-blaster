import { PRIORITIES, STATUSES } from "../domain/ticketModel";

export default function TriageToolbar({
  filters,
  sortPreference,
  visibleCount,
  totalCount,
  onFilterChange,
  onSortChange,
  onClearFilters,
}) {
  const filtersActive =
    filters.query || filters.status !== "all" || filters.priority !== "all";

  return (
    <div className="triage-toolbar">
      <div className="toolbar-heading">
        <div>
          <p className="eyebrow">Triage queue</p>
          <h2>Signal over noise</h2>
        </div>
        <span className="result-count">
          {visibleCount} / {totalCount}
        </span>
      </div>

      <div className="toolbar-grid">
        <label className="control control--search">
          <span>Search</span>
          <div className="search-shell">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={filters.query}
              onChange={(event) =>
                onFilterChange("query", event.target.value)
              }
              placeholder="Title, owner, type…"
            />
          </div>
        </label>

        <label className="control">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) =>
              onFilterChange("status", event.target.value)
            }
          >
            <option value="all">All statuses</option>
            {Object.entries(STATUSES).map(([value, meta]) => (
              <option value={value} key={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>

        <label className="control">
          <span>Priority</span>
          <select
            value={filters.priority}
            onChange={(event) =>
              onFilterChange("priority", event.target.value)
            }
          >
            <option value="all">All priorities</option>
            {Object.entries(PRIORITIES)
              .reverse()
              .map(([value, meta]) => (
                <option value={value} key={value}>
                  {meta.code} · {meta.label}
                </option>
              ))}
          </select>
        </label>

        <label className="control">
          <span>Sort</span>
          <select
            value={sortPreference}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="impact">Impact first</option>
            <option value="newest">Recently updated</option>
            <option value="oldest">Oldest first</option>
            <option value="priority-low">Low priority first</option>
          </select>
        </label>
      </div>

      {filtersActive && (
        <button
          type="button"
          className="text-button"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
