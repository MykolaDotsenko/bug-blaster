import { useEffect, useReducer } from "react";
import "./styles.css";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import StatsPanel from "./components/StatsPanel";
import TriageToolbar from "./components/TriageToolbar";
import {
  createTicket,
  updateTicket,
} from "./domain/ticketModel";
import ticketReducer, {
  createInitialState,
} from "./reducers/ticketReducer";
import {
  DEMO_TICKETS,
  loadWorkspace,
  saveWorkspace,
} from "./storage/ticketStorage";
import {
  getTicketStats,
  selectVisibleTickets,
} from "./utilities/sortingUtilities";

const createId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `ticket-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function App() {
  const [state, dispatch] = useReducer(
    ticketReducer,
    undefined,
    () => createInitialState(loadWorkspace()),
  );

  useEffect(() => {
    saveWorkspace(state.tickets);
  }, [state.tickets]);

  const visibleTickets = selectVisibleTickets(state);
  const stats = getTicketStats(state.tickets);
  const editingTicket =
    state.tickets.find((ticket) => ticket.id === state.editingTicketId) ||
    null;

  const handleSubmit = (draft) => {
    const now = new Date().toISOString();

    if (editingTicket) {
      dispatch({
        type: "UPDATE_TICKET",
        payload: updateTicket(editingTicket, draft, now),
      });
      return;
    }

    dispatch({
      type: "ADD_TICKET",
      payload: createTicket(draft, {
        id: createId(),
        now,
      }),
    });
  };

  const handleStatusChange = (id, status) => {
    dispatch({
      type: "SET_STATUS",
      payload: {
        id,
        status,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const resetDemo = () => {
    dispatch({
      type: "RESET_WORKSPACE",
      payload: DEMO_TICKETS.map((ticket) => ({ ...ticket })),
    });
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to workspace
      </a>

      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#main-content" aria-label="Bug Blaster home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span>
            <strong>Bug Blaster</strong>
            <small>Triage command center</small>
          </span>
        </a>

        <div className="topbar-actions">
          <span className="local-badge">
            <span aria-hidden="true" />
            Local workspace
          </span>
          <button type="button" className="text-button" onClick={resetDemo}>
            Reset demo
          </button>
        </div>
      </header>

      <main id="main-content" className="main-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Engineering operations · local-first</p>
            <h1>
              Turn bug reports into
              <span> operational signal.</span>
            </h1>
            <p className="hero-lead">
              Capture issues, rank impact, move investigations forward, and
              keep the queue readable when everything feels urgent.
            </p>
          </div>

          <div className="hero-orbit" aria-hidden="true">
            <div className="orbit-ring orbit-ring--outer" />
            <div className="orbit-ring orbit-ring--inner" />
            <div className="orbit-core">
              <span>{stats.active}</span>
              <small>active</small>
            </div>
          </div>
        </section>

        <StatsPanel stats={stats} />

        <section className="workspace">
          <aside className="composer-panel">
            <TicketForm
              editingTicket={editingTicket}
              onSubmit={handleSubmit}
              onCancel={() => dispatch({ type: "CLEAR_EDITING_TICKET" })}
            />

            <div className="privacy-note">
              <span className="privacy-note__icon" aria-hidden="true">
                ⌁
              </span>
              <div>
                <strong>Private by default</strong>
                <p>
                  Reports stay in this browser. No account, analytics, or
                  network request is required.
                </p>
              </div>
            </div>
          </aside>

          <section className="queue-panel" aria-label="Bug triage queue">
            <TriageToolbar
              filters={state.filters}
              sortPreference={state.sortPreference}
              visibleCount={visibleTickets.length}
              totalCount={state.tickets.length}
              onFilterChange={(name, value) =>
                dispatch({
                  type: "SET_FILTER",
                  payload: { name, value },
                })
              }
              onSortChange={(value) =>
                dispatch({ type: "SET_SORTING", payload: value })
              }
              onClearFilters={() => dispatch({ type: "CLEAR_FILTERS" })}
            />

            <TicketList
              tickets={visibleTickets}
              hasAnyTickets={state.tickets.length > 0}
              onEdit={(ticket) =>
                dispatch({ type: "SET_EDITING_TICKET", payload: ticket })
              }
              onDelete={(ticket) =>
                dispatch({
                  type: "DELETE_TICKET",
                  payload: { id: ticket.id },
                })
              }
              onStatusChange={handleStatusChange}
              onClearFilters={() => dispatch({ type: "CLEAR_FILTERS" })}
            />
          </section>
        </section>
      </main>

      {state.lastDeleted && (
        <div className="undo-toast" role="status">
          <span>
            <strong>Report removed.</strong> {state.lastDeleted.ticket.title}
          </span>
          <button
            type="button"
            className="toast-button"
            onClick={() => dispatch({ type: "UNDO_DELETE" })}
          >
            Undo
          </button>
        </div>
      )}

      <footer className="footer">
        <span>Bug Blaster · focused triage without backend overhead</span>
        <span>React · reducer architecture · versioned local storage</span>
      </footer>
    </div>
  );
}

export default App;
