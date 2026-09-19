import { normalizeStoredTicket } from "../domain/ticketModel";

export const STORAGE_KEY = "bug-blaster:workspace";
export const STORAGE_VERSION = 2;

export const DEMO_TICKETS = [
  {
    id: "BB-DEMO-1",
    title: "Checkout freezes after payment retry",
    description:
      "The confirmation screen stays in a loading state when a declined card is retried with a valid payment method.",
    type: "regression",
    priority: "4",
    status: "investigating",
    owner: "Payments",
    createdAt: "2026-09-18T07:15:00.000Z",
    updatedAt: "2026-09-19T05:40:00.000Z",
  },
  {
    id: "BB-DEMO-2",
    title: "Search results jump during image loading",
    description:
      "Result cards shift vertically on slower connections because thumbnail dimensions are not reserved before images arrive.",
    type: "performance",
    priority: "3",
    status: "open",
    owner: "Web",
    createdAt: "2026-09-17T12:10:00.000Z",
    updatedAt: "2026-09-17T12:10:00.000Z",
  },
  {
    id: "BB-DEMO-3",
    title: "Modal focus escapes behind the overlay",
    description:
      "Keyboard focus can move to page controls behind the confirmation dialog, making the destructive action difficult to navigate.",
    type: "accessibility",
    priority: "3",
    status: "fixed",
    owner: "Design systems",
    createdAt: "2026-09-15T10:30:00.000Z",
    updatedAt: "2026-09-18T08:45:00.000Z",
  },
  {
    id: "BB-DEMO-4",
    title: "Avatar fallback flashes before cached image",
    description:
      "A brief fallback state is visible during navigation even when the profile image is already cached by the browser.",
    type: "bug",
    priority: "1",
    status: "open",
    owner: "Profile",
    createdAt: "2026-09-18T14:20:00.000Z",
    updatedAt: "2026-09-18T14:20:00.000Z",
  },
];

const cloneDemoTickets = () => DEMO_TICKETS.map((ticket) => ({ ...ticket }));

export function loadWorkspace(storage = window.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);

    if (!raw) {
      return cloneDemoTickets();
    }

    const parsed = JSON.parse(raw);
    const tickets = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.tickets)
        ? parsed.tickets
        : null;

    if (!tickets) {
      return cloneDemoTickets();
    }

    const now = new Date().toISOString();

    return tickets
      .map((ticket) => normalizeStoredTicket(ticket, now))
      .filter(Boolean);
  } catch {
    return cloneDemoTickets();
  }
}

export function saveWorkspace(tickets, storage = window.localStorage) {
  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        tickets,
      }),
    );
    return true;
  } catch {
    return false;
  }
}
