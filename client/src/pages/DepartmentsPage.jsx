import PageHeader from '../components/PageHeader';

const departments = [
  {
    name: 'General Medicine',
    summary: 'Primary and preventive care for adults and families.',
    emergency: '24/7 on-call support',
    color: 'from-emerald-500/20 to-emerald-400/5 border-emerald-200/60 dark:border-emerald-700/30',
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/25 dark:text-emerald-400',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/70 dark:text-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700/30',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  },
  {
    name: 'Cardiology',
    summary: 'Cardiac risk assessment, hypertension, and heart monitoring.',
    emergency: 'Priority triage enabled',
    color: 'from-rose-500/20 to-rose-400/5 border-rose-200/60 dark:border-rose-700/30',
    iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-900/25 dark:text-rose-400',
    tagColor: 'text-rose-700 bg-rose-50 border-rose-200/70 dark:text-rose-300 dark:bg-rose-900/20 dark:border-rose-700/30',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  },
  {
    name: 'Dermatology',
    summary: 'Skin consultations with imaging support and follow-up plans.',
    emergency: 'Same-day slots available',
    color: 'from-amber-500/20 to-amber-400/5 border-amber-200/60 dark:border-amber-700/30',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/25 dark:text-amber-400',
    tagColor: 'text-amber-700 bg-amber-50 border-amber-200/70 dark:text-amber-300 dark:bg-amber-900/20 dark:border-amber-700/30',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    )
  },
  {
    name: 'Mental Health',
    summary: 'Confidential therapy, psychiatry, and medication management.',
    emergency: 'Crisis escalation path included',
    color: 'from-violet-500/20 to-violet-400/5 border-violet-200/60 dark:border-violet-700/30',
    iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-900/25 dark:text-violet-400',
    tagColor: 'text-violet-700 bg-violet-50 border-violet-200/70 dark:text-violet-300 dark:bg-violet-900/20 dark:border-violet-700/30',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5a2 2 0 0 1-2-2V9m6 5h10a2 2 0 0 0 2-2V9m0 0H3" />
      </svg>
    )
  },
  {
    name: 'Orthopedics',
    summary: 'Joint, spine, and musculoskeletal assessment and recovery.',
    emergency: 'Fast-track injury bookings',
    color: 'from-blue-500/20 to-blue-400/5 border-blue-200/60 dark:border-blue-700/30',
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/25 dark:text-blue-400',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200/70 dark:text-blue-300 dark:bg-blue-900/20 dark:border-blue-700/30',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    name: 'Pediatrics',
    summary: 'Child-focused care from newborn wellness to acute consults.',
    emergency: 'Night and weekend coverage',
    color: 'from-pink-500/20 to-pink-400/5 border-pink-200/60 dark:border-pink-700/30',
    iconBg: 'bg-pink-50 text-pink-600 dark:bg-pink-900/25 dark:text-pink-400',
    tagColor: 'text-pink-700 bg-pink-50 border-pink-200/70 dark:text-pink-300 dark:bg-pink-900/20 dark:border-pink-700/30',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
];

function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Departments"
        title="Specialized care teams"
        description="Explore departments, services, and emergency support options across the hospital network."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <article
            key={dept.name}
            className={`card group overflow-hidden border bg-gradient-to-br p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${dept.color}`}
          >
            <div className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${dept.iconBg}`}>
                  {dept.icon}
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${dept.tagColor}`}>
                  {dept.emergency}
                </span>
              </div>
              <p className="font-heading text-lg font-bold text-slate-900 dark:text-white">{dept.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{dept.summary}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default DepartmentsPage;
