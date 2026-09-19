export default function StatsPanel({ stats }) {
  const cards = [
    {
      label: "Active",
      value: stats.active,
      detail: `${stats.total} total`,
      tone: "active",
    },
    {
      label: "Critical",
      value: stats.critical,
      detail: "needs attention",
      tone: "critical",
    },
    {
      label: "Fixed",
      value: stats.fixed,
      detail: "closed loop",
      tone: "fixed",
    },
    {
      label: "Resolution",
      value: `${stats.completionRate}%`,
      detail: "of all reports",
      tone: "rate",
    },
  ];

  return (
    <section className="stats-grid" aria-label="Bug triage summary">
      {cards.map((card) => (
        <article
          className={`stat-card stat-card--${card.tone}`}
          key={card.label}
          aria-label={`${card.label}: ${card.value}`}
        >
          <span className="stat-card__label">{card.label}</span>
          <strong className="stat-card__value">{card.value}</strong>
          <span className="stat-card__detail">{card.detail}</span>
        </article>
      ))}
    </section>
  );
}
