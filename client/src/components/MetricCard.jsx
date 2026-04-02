function MetricCard({ label, value, meta }) {
  return (
    <div className="card group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      {meta ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{meta}</p>
      ) : null}
    </div>
  );
}

export default MetricCard;
