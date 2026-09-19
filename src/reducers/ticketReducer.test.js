import ticketReducer, { createInitialState } from "./ticketReducer";

const ticket = {
  id: "1",
  title: "Broken checkout",
  description: "Checkout fails after retry.",
  type: "regression",
  priority: "4",
  status: "open",
  owner: "Payments",
  createdAt: "2026-09-19T08:00:00.000Z",
  updatedAt: "2026-09-19T08:00:00.000Z",
};

test("deletes and restores a ticket at the original position", () => {
  const initial = createInitialState([
    ticket,
    { ...ticket, id: "2", title: "Second" },
  ]);

  const deleted = ticketReducer(initial, {
    type: "DELETE_TICKET",
    payload: { id: "1" },
  });

  expect(deleted.tickets.map(({ id }) => id)).toEqual(["2"]);
  expect(deleted.lastDeleted.ticket.id).toBe("1");

  const restored = ticketReducer(deleted, { type: "UNDO_DELETE" });

  expect(restored.tickets.map(({ id }) => id)).toEqual(["1", "2"]);
  expect(restored.lastDeleted).toBeNull();
});

test("status transitions update only the targeted ticket", () => {
  const initial = createInitialState([
    ticket,
    { ...ticket, id: "2", title: "Second" },
  ]);

  const next = ticketReducer(initial, {
    type: "SET_STATUS",
    payload: {
      id: "2",
      status: "fixed",
      updatedAt: "2026-09-19T09:00:00.000Z",
    },
  });

  expect(next.tickets[0].status).toBe("open");
  expect(next.tickets[1].status).toBe("fixed");
  expect(next.tickets[1].updatedAt).toBe("2026-09-19T09:00:00.000Z");
});
