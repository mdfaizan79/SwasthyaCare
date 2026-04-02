import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const faqData = {
  Patient: [
    {
      q: 'How quickly can I see a doctor?',
      a: 'Most specialties have same-day slots, and live availability is updated in real time.'
    },
    {
      q: 'Can I refill prescriptions from my phone?',
      a: 'Yes. Use the Pharmacy page to request one-tap refills and enable reminders.'
    }
  ],
  Doctor: [
    {
      q: 'How are clinical notes generated?',
      a: 'Live AI transcription drafts notes during consults. You review and sign before finalization.'
    },
    {
      q: 'Which EHR systems are supported?',
      a: 'Epic, Cerner, Meditech, and Athenahealth are available in the integration wizard.'
    }
  ],
  Admin: [
    {
      q: 'Where do I access audit logs?',
      a: 'Audit trails are available from the Compliance module in the Admin Dashboard.'
    },
    {
      q: 'How do I broadcast a platform announcement?',
      a: 'Use the Admin announcements tool to target all patients or all providers.'
    }
  ]
};

const tutorials = [
  { title: 'Getting started as a patient', duration: '4:18', icon: '▶' },
  { title: 'Running your first tele-consult', duration: '5:06', icon: '▶' },
  { title: 'Admin reporting walkthrough', duration: '6:42', icon: '▶' }
];

function HelpPage() {
  const [role, setRole] = useState('Patient');
  const [query, setQuery] = useState('');
  const [featureRequest, setFeatureRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filteredFaq = useMemo(
    () =>
      faqData[role].filter((item) => {
        const text = `${item.q} ${item.a}`.toLowerCase();
        return text.includes(query.toLowerCase());
      }),
    [role, query]
  );

  const submitFeatureRequest = (e) => {
    e.preventDefault();
    if (!featureRequest.trim()) return;
    setSubmitted(true);
    setFeatureRequest('');
    setTimeout(() => setSubmitted(false), 2200);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Help Center"
        title="Support that actually helps"
        description="Role-based FAQ, guided tutorials, live chat escalation, and feature-request intake."
      />

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* FAQ */}
        <div className="card p-5">
          {/* Role tabs */}
          <div className="flex flex-wrap gap-2">
            {['Patient', 'Doctor', 'Admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  role === r
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-soft'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQ…"
              className="input pl-10"
            />
          </div>

          {/* FAQ items */}
          <div className="mt-4 space-y-2.5">
            {filteredFaq.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-700 dark:from-slate-800/60 dark:to-slate-800/30"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
            {filteredFaq.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No FAQ entries match your search.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Video tutorials */}
          <div className="card p-5">
            <p className="section-title">Video Tutorials</p>
            <ul className="mt-4 space-y-2.5">
              {tutorials.map((t) => (
                <li key={t.title}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 transition hover:border-primary-200 hover:bg-primary-50/40 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-primary-700/50 dark:hover:bg-primary-900/15"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-600 to-primary-500 text-xs font-bold text-white shadow-soft">
                      {t.icon}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{t.title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{t.duration}</p>
                    </div>
                    <svg className="shrink-0 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Live support */}
          <div className="card p-5">
            <p className="section-title">Live Support</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Instant support with human escalation available 24/7 for clinical and billing queries.
            </p>
            <button type="button" className="btn-primary mt-4 w-full">
              Start Live Chat
            </button>
          </div>

          {/* Feature request */}
          <form onSubmit={submitFeatureRequest} className="card p-5">
            <p className="section-title">Feature Request</p>
            <textarea
              value={featureRequest}
              onChange={(e) => setFeatureRequest(e.target.value)}
              className="input mt-3 min-h-[88px] resize-none"
              placeholder="Tell us what would make Swasthya Care better for you…"
            />
            <button type="submit" className="btn-primary mt-3">
              Submit Request
            </button>
            {submitted ? (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400">
                Thanks — your feature request was submitted.
              </div>
            ) : null}
          </form>

          {/* Escalation */}
          <div className="card overflow-hidden border-amber-200/80 bg-gradient-to-br from-amber-50 to-amber-50/30 p-5 dark:border-amber-700/40 dark:from-amber-900/15 dark:to-transparent">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600 dark:text-amber-400">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" /><line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" /><line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-heading text-base font-bold text-amber-900 dark:text-amber-200">Escalation Path</p>
            </div>
            <p className="text-sm leading-relaxed text-amber-800/80 dark:text-amber-300/80">
              For medical emergencies call <strong>911</strong> immediately. For urgent billing or clinical concerns,
              escalate via hotline: <strong>+1 (800) 555-1234</strong>.
            </p>
            <Link
              to="/status"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-900 underline underline-offset-2 dark:text-amber-300"
            >
              System Status Page
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HelpPage;
