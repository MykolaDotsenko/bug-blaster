import {
  filterTickets,
  getTicketStats,
  sortTickets,
} from "./sortingUtilities";

const tickets = [
  {
    id: "low",
    title: "Avatar flash",
    description: "Small visual issue",
    owner: "Profile",
    type: "bug",
    priority: "1",
    status: "open",
    createdAt: "2026-09-18T08:00:00.000Z",
    updatedAt: "2026-09-18T08:00:00.000Z",
  },
  {
    id: "critical",
    title: "Payment retry freeze",
    description: "Checkout blocks after a retry",
    owner: "Payments",
    type: "regression",
    priority: "4",
    status: "investigating",
    createdAt: "2026-09-19T08:00:00.000Z",
    updatedAt: "2026-09-19T09:00:00.000Z",
  },
  {
    id: "fixed",
    title: "Focus trap",
    description: "Keyboard focus escapes the dialog",
    owner: "Design systems",
    type: "accessibility",
    priority: "4",
    status: "fixed",
    createdAt: "2026-09-17T08:00:00.000Z",
    updatedAt: "2026-09-19T10:00:00.000Z",
  },
];

test("impact sorting keeps unresolved critical work ahead of fixed work", () => {
  expect(sortTickets(tickets, "impact").map(({ id }) => id)).toEqual([
    "critical",
    "low",
    "fixed",
  ]);
});

test("search matches descriptive fields without mutating the source list", () => {
  const original = [...tickets];
  const result = filterTickets(tickets, {
    query: "payments",
    status: "all",
    priority: "all",
  });

  expect(result.map(({ id }) => id)).toEqual(["critical"]);
  expect(tickets).toEqual(original);
});

test("stats separate active critical work from fixed reports", () => {
  expect(getTicketStats(tickets)).toEqual({
    total: 3,
    active: 2,
    critical: 1,
    fixed: 1,
    completionRate: 33,
  });
});
