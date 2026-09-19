export const PRIORITIES = {
  "1": { label: "Low", code: "P3", tone: "low" },
  "2": { label: "Medium", code: "P2", tone: "medium" },
  "3": { label: "High", code: "P1", tone: "high" },
  "4": { label: "Critical", code: "P0", tone: "critical" },
};

export const STATUSES = {
  open: { label: "Open", tone: "open" },
  investigating: { label: "Investigating", tone: "investigating" },
  fixed: { label: "Fixed", tone: "fixed" },
};

export const BUG_TYPES = [
  { value: "bug", label: "Bug" },
  { value: "regression", label: "Regression" },
  { value: "performance", label: "Performance" },
  { value: "accessibility", label: "Accessibility" },
];

export const DEFAULT_FILTERS = {
  query: "",
  status: "all",
  priority: "all",
};

export const DEFAULT_SORT = "impact";

const clean = (value) => String(value ?? "").trim();

export function createTicket(draft, { id, now }) {
  return {
    id,
    title: clean(draft.title),
    description: clean(draft.description),
    type: draft.type || "bug",
    priority: String(draft.priority || "2"),
    status: "open",
    owner: clean(draft.owner),
    createdAt: now,
    updatedAt: now,
  };
}

export function updateTicket(ticket, draft, now) {
  return {
    ...ticket,
    title: clean(draft.title),
    description: clean(draft.description),
    type: draft.type || ticket.type || "bug",
    priority: String(draft.priority || ticket.priority || "2"),
    owner: clean(draft.owner),
    updatedAt: now,
  };
}

export function normalizeStoredTicket(ticket, fallbackNow) {
  if (!ticket || !ticket.id || !ticket.title) {
    return null;
  }

  const legacyCreatedAt =
    typeof ticket.id === "string" && !Number.isNaN(Date.parse(ticket.id))
      ? ticket.id
      : fallbackNow;

  return {
    id: String(ticket.id),
    title: clean(ticket.title),
    description: clean(ticket.description),
    type: BUG_TYPES.some(({ value }) => value === ticket.type)
      ? ticket.type
      : "bug",
    priority: PRIORITIES[String(ticket.priority)]
      ? String(ticket.priority)
      : "2",
    status: STATUSES[ticket.status] ? ticket.status : "open",
    owner: clean(ticket.owner),
    createdAt: ticket.createdAt || legacyCreatedAt,
    updatedAt: ticket.updatedAt || ticket.createdAt || legacyCreatedAt,
  };
}

export function getPriorityMeta(priority) {
  return PRIORITIES[String(priority)] || PRIORITIES["2"];
}

export function getStatusMeta(status) {
  return STATUSES[status] || STATUSES.open;
}
