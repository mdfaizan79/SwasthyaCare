function MetricCard({ label, value, meta }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-heading text-2xl text-primary-900">{value}</p>
      {meta ? <p className="mt-1 text-sm text-slate-500">{meta}</p> : null}
    </div>
  );
}

export default MetricCard;
