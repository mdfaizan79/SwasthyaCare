import PageHeader from '../components/PageHeader';

const cards = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/25 dark:text-primary-300',
    title: 'Our History',
    body: 'Founded to make high-quality care accessible beyond clinic walls, we serve patients across virtual and in-person channels.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/25 dark:text-emerald-300',
    title: 'Mission',
    body: 'Deliver safe, timely, and human-centered care through integrated digital workflows and evidence-based clinical processes.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/25 dark:text-violet-300',
    title: 'Vision',
    body: 'Build a proactive healthcare ecosystem where prevention, diagnosis, and treatment are seamless for patients and providers.'
  }
];

const stats = [
  { value: '50K+', label: 'Consultations completed' },
  { value: '300+', label: 'Verified specialists' },
  { value: '24/7', label: 'Round-the-clock access' },
  { value: '4.9★', label: 'Average patient rating' }
];

function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="About Us"
        title="Compassionate care with digital precision"
        description="Swasthya Care combines clinical excellence, secure technology, and round-the-clock accessibility for modern healthcare delivery."
      />

      {/* Stats strip */}
      <section className="card p-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-bold tracking-tight text-primary-700 dark:text-primary-300">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
          >
            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
              {card.icon}
            </div>
            <p className="font-heading text-lg font-bold text-slate-900 dark:text-white">{card.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{card.body}</p>
          </div>
        ))}
      </section>

      {/* Values banner */}
      <section
        className="relative overflow-hidden rounded-2xl px-6 py-10 text-white md:px-10"
        style={{ background: 'linear-gradient(135deg, #0c2a36 0%, #0b3d55 45%, #1a1040 100%)' }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 h-40 w-40 rounded-full bg-violet-500/15 blur-2xl" />
        <div className="relative max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-300">Our Promise</p>
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Built on trust, compliance, and clinical integrity.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Every consultation, prescription, and health record on Swasthya Care is secured with 256-bit encryption,
            HIPAA-ready infrastructure, and SOC 2-aligned audit controls — so patients and providers can focus on care,
            not compliance.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['HIPAA Compliant', 'GDPR Ready', '256-bit Encryption', 'SOC 2 Aligned'].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
