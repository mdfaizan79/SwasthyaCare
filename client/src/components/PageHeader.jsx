function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 rounded-2xl border border-white/70 bg-gradient-to-r from-primary-900 via-primary-700 to-accent-700 px-6 py-7 text-white shadow-soft md:px-8">
      {eyebrow ? <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary-100">{eyebrow}</p> : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-heading text-2xl font-semibold md:text-3xl">{title}</h1>
          {description ? <p className="mt-2 text-sm text-primary-50 md:text-base">{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  );
}

export default PageHeader;
