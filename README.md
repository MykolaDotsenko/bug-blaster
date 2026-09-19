# Bug Blaster — Triage Command Center

[![Quality](https://github.com/MykolaDotsenko/bug-blaster/actions/workflows/quality.yml/badge.svg)](https://github.com/MykolaDotsenko/bug-blaster/actions/workflows/quality.yml)

**A local-first React bug triage workspace rebuilt from a small CRUD exercise into a focused product and architecture case study.**

Bug Blaster helps an engineering team capture defects, prioritize impact, move reports through investigation, search a noisy queue, and recover accidental deletion — without requiring an account or backend.

## Product capabilities

- create and edit structured bug reports
- P0–P3 priority model
- bug, regression, performance, and accessibility report types
- Open → Investigating → Fixed triage workflow
- owner/team assignment
- fast full-text-style client filtering across useful ticket fields
- status and priority filters
- impact, recent, oldest, and low-priority sorting
- live operational summary for active, critical, fixed, and resolution rate
- Undo after deletion
- versioned browser persistence
- safe normalization of legacy ticket records
- responsive desktop/mobile UI
- reduced-motion and high-contrast support

## Stack

- React 18
- JavaScript
- CSS
- Web Storage API
- Jest / React Testing Library
- GitHub Actions

The implementation intentionally adds **no product runtime dependency beyond React**.

## Architecture

```text
UI components
     |
     v
App / dispatch boundary
     |
     +----> pure reducer
     |
     +----> pure model + selectors
     |
     +----> local-storage adapter
```

Important engineering decisions:

1. the reducer is deterministic — ids and timestamps are created before dispatch;
2. canonical tickets are never mutated by filtering or sorting;
3. browser persistence is isolated from state transitions;
4. only durable product data is persisted;
5. legacy records are normalized on read;
6. deletion is reversible without introducing a full history subsystem;
7. native form/select controls carry most interaction and accessibility semantics.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the design rationale and trade-offs.

## Why this is not over-engineered

The original app was a small CRUD form. A backend, Redux, event bus, query layer, or design-system dependency would make the repository larger without solving the portfolio problem.

The rebuild adds boundaries only where they protect something concrete:

- reducer → predictable state transitions
- model helpers → normalized ticket data
- selectors → testable discovery/ordering behavior
- storage adapter → resilient persistence
- focused components → readable UI responsibilities

## Quality checks

Install dependencies:

```bash
npm ci
```

Run the complete local quality gate:

```bash
npm run check
```

This executes the test suite and a production build.

Tests cover:

- create / triage / delete / Undo user flow
- queue searching
- reducer deletion/restoration behavior
- targeted status transitions
- impact sorting
- non-mutating filters
- operational statistics

GitHub Actions runs tests and the production build on pushes and pull requests.

## Run locally

```bash
npm ci
npm start
```

Open `http://localhost:3000`.

The first visit loads a small fictional demo queue so the workflow is immediately visible. Changes remain in the current browser. **Reset demo** restores the sample workspace.

## Accessibility and UX

The interface includes:

- skip-to-content navigation
- semantic headings, labels, fieldsets, and native selects
- descriptive labels for icon actions
- strong visible focus treatment
- responsive touch targets
- `prefers-reduced-motion`
- `prefers-contrast: more`
- restrained motion with no permanent JavaScript animation loop

## Project structure

```text
src/
├── components/
│   ├── StatsPanel.js
│   ├── TicketForm.js
│   ├── TicketItem.js
│   ├── TicketList.js
│   └── TriageToolbar.js
├── domain/
│   └── ticketModel.js
├── reducers/
│   ├── ticketReducer.js
│   └── ticketReducer.test.js
├── storage/
│   └── ticketStorage.js
├── utilities/
│   ├── sortingUtilities.js
│   └── sortingUtilities.test.js
├── App.js
├── App.test.js
├── index.js
└── styles.css
```

## Evolution

The original 2024 implementation already had the useful seed of a product: ticket CRUD, priorities, a reducer, and sorting.

The rebuild keeps that core idea while replacing the tutorial surface with:

- a real triage information model;
- reliable local persistence;
- clearer state ownership;
- deterministic selectors;
- reversible destructive actions;
- meaningful automated tests;
- responsive accessible UI;
- recruiter-facing engineering documentation;
- CI.

The result stays small enough to understand in one sitting while demonstrating product judgment, state modeling, UX, testing, and maintainability.

## Scope

Bug Blaster is a portfolio application, not a collaborative production issue tracker. It intentionally does not implement authentication, remote synchronization, comments, attachments, or multi-user conflict resolution.

Those capabilities require a server-side source of truth and a substantially different product scope.
