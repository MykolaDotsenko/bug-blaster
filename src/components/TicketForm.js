import { useEffect, useRef, useState } from "react";
import { BUG_TYPES, PRIORITIES } from "../domain/ticketModel";

const EMPTY_DRAFT = {
  title: "",
  description: "",
  type: "bug",
  priority: "2",
  owner: "",
};

export default function TicketForm({ editingTicket, onSubmit, onCancel }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const titleRef = useRef(null);

  useEffect(() => {
    if (editingTicket) {
      setDraft({
        title: editingTicket.title,
        description: editingTicket.description,
        type: editingTicket.type,
        priority: editingTicket.priority,
        owner: editingTicket.owner,
      });
      titleRef.current?.focus();
      return;
    }

    setDraft(EMPTY_DRAFT);
  }, [editingTicket]);

  const updateField = (name, value) => {
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(draft);

    if (!editingTicket) {
      setDraft(EMPTY_DRAFT);
      titleRef.current?.focus();
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">
            {editingTicket ? "Editing report" : "Capture signal"}
          </p>
          <h2>{editingTicket ? "Refine the bug" : "Log a new bug"}</h2>
        </div>
        <span className="form-heading__shortcut" aria-hidden="true">
          BB
        </span>
      </div>

      <div className="field">
        <label htmlFor="ticket-title">Title</label>
        <input
          id="ticket-title"
          ref={titleRef}
          type="text"
          value={draft.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="What broke?"
          required
          minLength="3"
          maxLength="80"
          aria-describedby="ticket-title-hint"
        />
        <small id="ticket-title-hint">
          Specific enough to scan in a busy incident queue.
        </small>
      </div>

      <div className="field">
        <label htmlFor="ticket-description">Description</label>
        <textarea
          id="ticket-description"
          value={draft.description}
          onChange={(event) =>
            updateField("description", event.target.value)
          }
          placeholder="Expected behavior, actual behavior, and useful context…"
          required
          minLength="12"
          maxLength="600"
          rows="6"
          aria-describedby="ticket-description-hint"
        />
        <small id="ticket-description-hint">
          {draft.description.length}/600 characters
        </small>
      </div>

      <div className="form-split">
        <div className="field">
          <label htmlFor="ticket-type">Type</label>
          <select
            id="ticket-type"
            value={draft.type}
            onChange={(event) => updateField("type", event.target.value)}
          >
            {BUG_TYPES.map((type) => (
              <option value={type.value} key={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="ticket-owner">Owner</label>
          <input
            id="ticket-owner"
            type="text"
            value={draft.owner}
            onChange={(event) => updateField("owner", event.target.value)}
            placeholder="Team or person"
            maxLength="40"
          />
        </div>
      </div>

      <fieldset className="priority-fieldset">
        <legend>Priority</legend>
        <div className="priority-options">
          {Object.entries(PRIORITIES)
            .reverse()
            .map(([value, meta]) => (
              <label
                className={`priority-option priority-option--${meta.tone}`}
                key={value}
              >
                <input
                  type="radio"
                  name="priority"
                  value={value}
                  checked={draft.priority === value}
                  onChange={(event) =>
                    updateField("priority", event.target.value)
                  }
                />
                <span className="priority-option__code">{meta.code}</span>
                <span>{meta.label}</span>
              </label>
            ))}
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          <span aria-hidden="true">{editingTicket ? "↗" : "+"}</span>
          {editingTicket ? "Save changes" : "Launch report"}
        </button>

        {editingTicket && (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
}
