# Bug Blaster — Triage Command Center

[![Quality](https://github.com/MykolaDotsenko/bug-blaster/actions/workflows/quality.yml/badge.svg)](https://github.com/MykolaDotsenko/bug-blaster/actions/workflows/quality.yml)

**A small React defect-triage workspace built around predictable reducer transitions, filtering and reversible deletion.**

Bug Blaster is a portfolio/learning-history project, not a collaborative replacement for Jira or Linear.

## What it does

- create/edit structured bug reports;
- P0–P3 priorities;
- bug / regression / performance / accessibility types;
- Open → Investigating → Fixed workflow;
- owner/team fields;
- search/filter/sort;
- operational counts;
- delete + Undo;
- versioned browser persistence.

The first visit loads fictional sample tickets.

## State model

```text
UI
 ↓
dispatch
 ├── reducer
 ├── selectors / ticket model
 └── storage adapter
```

Key rules:

- IDs/timestamps are created before dispatch so reducer transitions stay deterministic;
- filtering/sorting never mutate canonical tickets;
- only durable ticket data is persisted;
- older saved records are normalized on read;
- deletion can be undone without introducing a full history subsystem.

## Stack

- React 18
- JavaScript
- CSS
- Web Storage
- Jest / React Testing Library
- GitHub Actions

No runtime dependency beyond React.

## Accessibility

The interface uses semantic forms/fieldsets/selects, visible focus, descriptive action labels, responsive touch targets, reduced-motion and increased-contrast handling.

## Quality

```bash
npm ci
npm run check
```

Tests cover create/triage/delete/Undo, search, targeted transitions, impact sorting, non-mutating filters and operational statistics.

## Run locally

```bash
npm ci
npm start
```

Open `http://localhost:3000`.

## History

The original 2024 exercise already contained CRUD, priorities, a reducer and sorting. I kept that foundation and improved the data model, persistence, Undo, test coverage and accessible UI without changing the repo into a different class of product.

## Scope

Authentication, comments, attachments, remote synchronization and multi-user conflict resolution would require a server-side source of truth and are outside this project.
