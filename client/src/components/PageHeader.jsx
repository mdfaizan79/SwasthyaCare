function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl px-6 py-8 text-white md:px-9 md:py-10"
      style={{ background: 'linear-gradient(135deg, #0c2a36 0%, #0b3d55 40%, #12204a 75%, #1a1040 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/4 h-44 w-44 rounded-full bg-violet-500/15 blur-2xl" />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative">
        {eyebrow ? (
          <p className="mb-3 inline-flex items-center rounded-full border border-primary-400/30 bg-primary-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-200 backdrop-blur-sm">
            {eyebrow}
          </p>
        ) : null}

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
            {description ? (
              <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-base">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
