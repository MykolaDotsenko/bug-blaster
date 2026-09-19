const statusRank = {
  open: 0,
  investigating: 1,
  fixed: 2,
};

const searchableText = (ticket) =>
  [
    ticket.title,
    ticket.description,
    ticket.owner,
    ticket.type,
    ticket.status,
  ]
    .join(" ")
    .toLowerCase();

export const filterTickets = (tickets, filters) => {
  const query = filters.query.trim().toLowerCase();

  return tickets.filter((ticket) => {
    const matchesQuery =
      query.length === 0 || searchableText(ticket).includes(query);
    const matchesStatus =
      filters.status === "all" || ticket.status === filters.status;
    const matchesPriority =
      filters.priority === "all" || ticket.priority === filters.priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });
};

export const sortTickets = (tickets, preference) => {
  const sorted = [...tickets];

  switch (preference) {
    case "newest":
      return sorted.sort(
        (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
      );

    case "oldest":
      return sorted.sort(
        (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
      );

    case "priority-low":
      return sorted.sort(
        (a, b) =>
          Number(a.priority) - Number(b.priority) ||
          Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
      );

    case "impact":
    default:
      return sorted.sort(
        (a, b) =>
          statusRank[a.status] - statusRank[b.status] ||
          Number(b.priority) - Number(a.priority) ||
          Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
      );
  }
};

export const selectVisibleTickets = (state) =>
  sortTickets(
    filterTickets(state.tickets, state.filters),
    state.sortPreference,
  );

export const getTicketStats = (tickets) => {
  const total = tickets.length;
  const fixed = tickets.filter((ticket) => ticket.status === "fixed").length;
  const active = total - fixed;
  const critical = tickets.filter(
    (ticket) => ticket.priority === "4" && ticket.status !== "fixed",
  ).length;

  return {
    total,
    active,
    critical,
    fixed,
    completionRate: total === 0 ? 0 : Math.round((fixed / total) * 100),
  };
};

export const formatRelativeTime = (isoDate, now = Date.now()) => {
  const timestamp = Date.parse(isoDate);

  if (Number.isNaN(timestamp)) {
    return "recently";
  }

  const minutes = Math.max(0, Math.floor((now - timestamp) / 60000));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
};
