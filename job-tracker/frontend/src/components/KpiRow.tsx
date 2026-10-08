import type { JobApplication } from "../types";

interface Props {
  jobs: JobApplication[];
}

export function KpiRow({ jobs }: Props) {
  const total = jobs.length;
  const count = (status: string) =>
    jobs.filter((j) => j.status === status).length;

  const cards = [
    { label: "Total", value: total, tone: "neutral" as const },
    { label: "Applied", value: count("APPLIED"), tone: "applied" as const },
    {
      label: "Interview",
      value: count("INTERVIEW"),
      tone: "interview" as const,
    },
    { label: "Offer", value: count("OFFER"), tone: "offer" as const },
  ];

  return (
    <section className="kpi-row" aria-label="Summary">
      {cards.map((card) => (
        <div key={card.label} className={`kpi-card tone-${card.tone}`}>
          <div className="kpi-label">{card.label}</div>
          <div className="kpi-value">{card.value}</div>
        </div>
      ))}
    </section>
  );
}
