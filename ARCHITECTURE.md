# Architecture

Bug Blaster is intentionally a small local-first application. The architecture protects the behavior that matters without introducing backend, global state, or framework layers the product does not need.

## Dependency direction

```text
React UI
  |
  +--> application reducer
  |      |
  |      +--> ticket state transitions
  |
  +--> pure ticket model
  +--> pure selectors
  |
  +--> local-storage adapter
```

The important rule is that filtering, sorting, statistics, normalization, and reducer transitions are deterministic. Browser persistence sits at the edge.

## State model

The application state contains:

- the canonical list of tickets;
- the currently edited ticket id;
- ephemeral filters;
- the current sort preference;
- the most recently deleted ticket for Undo.

Only the ticket list is persisted. Search text, sort controls, edit state, and Undo state are intentionally session-only UI concerns.

## Ticket model

A ticket contains:

```text
id
title
description
type
priority
status
owner
createdAt
updatedAt
```

Priorities map to incident-style P0–P3 semantics:

- P0 Critical
- P1 High
- P2 Medium
- P3 Low

Statuses are deliberately small:

```text
Open -> Investigating -> Fixed
```

The UI does not prevent moving backward because real triage work often reopens an issue after verification fails.

## Persistence

The storage adapter writes a versioned envelope:

```json
{
  "version": 2,
  "tickets": []
}
```

Stored records are normalized on read. Legacy records from the original application only had id, title, description, and priority; missing type/status/owner/timestamps receive safe defaults.

Invalid JSON or an unavailable browser-storage entry does not stop the application from booting. Bug Blaster falls back to its demo workspace.

## Reducer design

The reducer is pure. Time and ids are created before dispatching actions so replaying the same action against the same state produces the same result.

Deletion keeps one reversible snapshot:

```text
DELETE_TICKET -> remove + remember { ticket, index }
UNDO_DELETE   -> restore at the original position
```

A full history stack would add complexity with limited value for this product.

## Selectors

Filtering and sorting never mutate canonical ticket state.

The default **Impact first** ordering prioritizes:

1. unresolved work before fixed work;
2. higher priority before lower priority;
3. more recently updated work when impact is equal.

Search intentionally covers title, description, owner, type, and status so one input handles the common discovery path.

## Accessibility

The product uses native controls wherever possible:

- semantic form labels and fieldsets;
- native selects for status/filter controls;
- descriptive icon-button labels;
- visible keyboard focus;
- skip navigation;
- live queue updates;
- reduced-motion handling;
- high-contrast overrides.

Native controls reduce custom interaction code and preserve expected keyboard and assistive-technology behavior.

## Visual architecture

The interface is dependency-free CSS. The visual system uses custom properties, responsive grids, native gradients, and bounded CSS motion.

There is no animation library or component framework because neither improves the core triage workflow at this scale.

## Trade-offs

Bug Blaster is not pretending to be Jira.

A production multi-user issue tracker would require a server-side source of truth, authentication, authorization, audit history, comments, attachments, concurrent edits, observability, database migrations, and organization-level workflows.

The portfolio scope instead demonstrates a clean local product with explicit state boundaries and realistic triage interaction.
