import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
} from "../domain/ticketModel";

export function createInitialState(tickets = []) {
  return {
    tickets,
    editingTicketId: null,
    filters: { ...DEFAULT_FILTERS },
    sortPreference: DEFAULT_SORT,
    lastDeleted: null,
  };
}

export default function ticketReducer(state, action) {
  switch (action.type) {
    case "ADD_TICKET":
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
        lastDeleted: null,
      };

    case "UPDATE_TICKET":
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.payload.id ? action.payload : ticket,
        ),
        editingTicketId: null,
      };

    case "DELETE_TICKET": {
      const index = state.tickets.findIndex(
        (ticket) => ticket.id === action.payload.id,
      );

      if (index < 0) {
        return state;
      }

      return {
        ...state,
        tickets: state.tickets.filter(
          (ticket) => ticket.id !== action.payload.id,
        ),
        editingTicketId:
          state.editingTicketId === action.payload.id
            ? null
            : state.editingTicketId,
        lastDeleted: {
          ticket: state.tickets[index],
          index,
        },
      };
    }

    case "UNDO_DELETE": {
      if (!state.lastDeleted) {
        return state;
      }

      const nextTickets = [...state.tickets];
      nextTickets.splice(
        Math.min(state.lastDeleted.index, nextTickets.length),
        0,
        state.lastDeleted.ticket,
      );

      return {
        ...state,
        tickets: nextTickets,
        lastDeleted: null,
      };
    }

    case "SET_STATUS":
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.payload.id
            ? {
                ...ticket,
                status: action.payload.status,
                updatedAt: action.payload.updatedAt,
              }
            : ticket,
        ),
      };

    case "SET_EDITING_TICKET":
      return {
        ...state,
        editingTicketId: action.payload.id,
      };

    case "CLEAR_EDITING_TICKET":
      return {
        ...state,
        editingTicketId: null,
      };

    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.name]: action.payload.value,
        },
      };

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: { ...DEFAULT_FILTERS },
      };

    case "SET_SORTING":
      return {
        ...state,
        sortPreference: action.payload,
      };

    case "RESET_WORKSPACE":
      return createInitialState(action.payload);

    default:
      return state;
  }
}
