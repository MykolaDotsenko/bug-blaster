import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import {
  STORAGE_KEY,
  STORAGE_VERSION,
} from "./storage/ticketStorage";

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: STORAGE_VERSION, tickets: [] }),
  );
});

test("creates, triages, deletes, and restores a bug report", () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Checkout freezes on submit" },
  });
  fireEvent.change(screen.getByLabelText("Description"), {
    target: {
      value:
        "The final checkout action remains disabled after a network retry.",
    },
  });
  fireEvent.click(screen.getByRole("radio", { name: /Critical/ }));
  fireEvent.click(screen.getByRole("button", { name: /Launch report/i }));

  expect(
    screen.getByRole("heading", { name: "Checkout freezes on submit" }),
  ).toBeInTheDocument();

  fireEvent.change(
    screen.getByLabelText("Status for Checkout freezes on submit"),
    { target: { value: "fixed" } },
  );

  expect(screen.getByLabelText("Fixed: 1")).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete Checkout freezes on submit",
    }),
  );

  expect(
    screen.queryByRole("heading", { name: "Checkout freezes on submit" }),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Undo" }));

  expect(
    screen.getByRole("heading", { name: "Checkout freezes on submit" }),
  ).toBeInTheDocument();
});

test("filters the queue by search text", () => {
  window.localStorage.removeItem(STORAGE_KEY);
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText("Title, owner, type…"), {
    target: { value: "focus" },
  });

  expect(
    screen.getByRole("heading", {
      name: "Modal focus escapes behind the overlay",
    }),
  ).toBeInTheDocument();

  expect(
    screen.queryByRole("heading", {
      name: "Checkout freezes after payment retry",
    }),
  ).not.toBeInTheDocument();
});
