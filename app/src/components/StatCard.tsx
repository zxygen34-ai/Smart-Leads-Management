type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  caption?: string;
};

export function StatCard({ label, value, delta, caption }: StatCardProps) {
  return (
    <div className="panel animate-rise px-6 py-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <span className="font-display text-2xl font-semibold text-ink">{value}</span>
        {delta ? (
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            {delta}
          </span>
        ) : null}
      </div>
      {caption ? <p className="mt-2 text-sm text-muted">{caption}</p> : null}
    </div>
  );
}
