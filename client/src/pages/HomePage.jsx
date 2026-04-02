import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';

const featureContent = {
  patients: {
    title: 'Care that fits real life',
    points: [
      'Video visits, async messages, and in-person bookings in one timeline.',
      'Prescription refills, lab insights, and wearable integrations without phone calls.',
      'AI symptom triage with direct routing to urgent care when risk is high.'
    ]
  },
  doctors: {
    title: 'Workflows designed for clinical focus',
    points: [
      'EHR-linked consultations with chart context loaded before call start.',
      'AI-assisted transcription and note drafting to reduce administrative burden.',
      'Safety checks for drug interactions and structured follow-up reminders.'
    ]
  },
  clinics: {
    title: 'Operations clarity for administrators',
    points: [
      'Revenue, claims, staff schedules, and no-show analytics in one console.',
      'Audit logs and role-based controls to stay compliance-ready every day.',
      'Broadcast announcements and policy updates to all users instantly.'
    ]
  }
};

const testimonials = [
  {
    quote: 'At 1:47 AM my son had a severe rash. We saw a pediatrician in 9 minutes and had medication by sunrise.',
    author: 'Priya M.',
    role: 'Parent',
    initials: 'PM'
  },
  {
    quote: 'Clinical notes are drafted before I even close the call. I spend more time with patients and less with tabs.',
    author: 'Dr. Omar Rahman',
    role: 'Internal Medicine',
    initials: 'OR'
  },
  {
    quote: 'Our no-show rate dropped 31% in one quarter after enabling reminders and faster re-booking.',
    author: 'Nina George',
    role: 'Clinic Operations Lead',
    initials: 'NG'
  }
];

const stats = [
  { value: '4.9★', label: 'Patient Rating' },
  { value: '< 7 min', label: 'Avg. Wait Time' },
  { value: '50K+', label: 'Consultations' },
  { value: 'HIPAA', label: 'Compliant' }
];

function HomePage() {
  const [activeTab, setActiveTab] = useState('patients');
  const [currentQuote, setCurrentQuote] = useState(0);
  const [onlineDoctors, setOnlineDoctors] = useState(184);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((v) => (v + 1) % testimonials.length);
    }, 5000);

    const counterTimer = setInterval(() => {
      setOnlineDoctors((v) => {
        const next = v + Math.floor(Math.random() * 5 - 2);
        return Math.max(120, Math.min(260, next));
      });
    }, 3500);

    return () => {
      clearInterval(quoteTimer);
      clearInterval(counterTimer);
    };
  }, []);

  const currentFeatures = useMemo(() => featureContent[activeTab], [activeTab]);

  return (
    <div className="space-y-6 pb-4">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-3xl px-6 py-14 text-white md:px-12 md:py-20"
        style={{ background: 'linear-gradient(135deg, #0c2a36 0%, #0b3d55 35%, #12204a 70%, #1a1040 100%)' }}
      >
        {/* Animated ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-24 top-8 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-orb"
          />
          <div
            className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-violet-600/15 blur-3xl animate-orb-slow"
          />
          <div
            className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-400/10 blur-2xl animate-orb"
            style={{ animationDelay: '-4s' }}
          />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          {/* Left: copy */}
          <div>
            {/* Live badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-400/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-200">
                Swasthya Care Telehealth Platform
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Your doctor is{' '}
              <br className="hidden md:block" />
              <span
                style={{
                  background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 45%, #a78bfa 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                one tap away.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
              Consult, manage, and heal with secure telehealth visits, e-prescribing, and intelligent patient support built for patients, providers, and clinics.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/patient/book"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(255,255,255,0.35)]"
              >
                Book a Consultation
              </Link>
              <Link
                to="/signup/patient"
                className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/18"
              >
                Get Started Free →
              </Link>
            </div>

            {/* Stats strip */}
            <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-primary-300/80">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: How it works card */}
          <div className="animate-float rounded-2xl border border-white/12 bg-white/8 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-300">How it works</p>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: '01',
                  title: 'Sign Up',
                  desc: 'Create your secure profile in under two minutes.',
                  color: 'from-primary-500/25 to-primary-400/10 border-primary-400/20'
                },
                {
                  step: '02',
                  title: 'Connect',
                  desc: 'See available doctors in your local timezone instantly.',
                  color: 'from-violet-500/25 to-violet-400/10 border-violet-400/20'
                },
                {
                  step: '03',
                  title: 'Get Care',
                  desc: 'Consult, receive prescriptions, and pay in one flow.',
                  color: 'from-emerald-500/25 to-emerald-400/10 border-emerald-400/20'
                }
              ].map(({ step, title, desc, color }) => (
                <div
                  key={step}
                  className={`rounded-xl border bg-gradient-to-r ${color} p-4`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 font-heading text-xs font-black text-white/40">{step}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/55">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features + Live Capacity ──────────────────────── */}
      <section className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">

        {/* Feature tabs */}
        <div className="card p-6">
          <p className="section-title">Built for every healthcare role</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {Object.keys(featureContent).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all duration-200 ${
                  tab === activeTab
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-soft'
                    : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/80 dark:hover:text-primary-300'
                }`}
              >
                For {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-primary-100/80 bg-gradient-to-br from-primary-50/80 to-transparent p-5 dark:border-primary-800/30 dark:from-primary-900/20 dark:to-transparent">
            <h3 className="font-heading text-lg font-bold text-primary-900 dark:text-primary-100">
              {currentFeatures.title}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {currentFeatures.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live capacity */}
        <div className="card flex flex-col p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Live Capacity</p>
              <p className="mt-2 font-heading text-5xl font-bold tracking-tight text-primary-700 dark:text-primary-300">
                {onlineDoctors}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">doctors online now</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/25">
              <span className="relative flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500" />
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50/40 p-4 dark:border-emerald-800/30 dark:from-emerald-900/20 dark:to-teal-900/10">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Average wait: 7 min</p>
            <p className="mt-0.5 text-xs text-emerald-600/70 dark:text-emerald-500/60">
              Real-time availability synced every minute.
            </p>
          </div>

          <div className="mt-4 flex-1" />

          <Link
            to="/patient/book"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
          >
            See Next Available Slots →
          </Link>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="card overflow-hidden p-0">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <p className="section-title">Voices from real care journeys</p>
        </div>

        <div className="p-6">
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-50 to-primary-50/30 p-6 dark:from-slate-800/50 dark:to-primary-900/15">
            {/* Giant quote mark */}
            <span
              className="pointer-events-none absolute right-5 top-3 font-heading text-8xl font-black leading-none text-primary-100/60 dark:text-primary-900/40 select-none"
              aria-hidden="true"
            >
              "
            </span>

            <p className="relative text-base leading-relaxed text-slate-700 dark:text-slate-200 md:text-lg">
              "{testimonials[currentQuote].quote}"
            </p>

            <div className="mt-5 flex items-center justify-between">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-violet-600 text-sm font-bold text-white">
                  {testimonials[currentQuote].initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {testimonials[currentQuote].author}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {testimonials[currentQuote].role}
                  </p>
                </div>
              </div>

              {/* Dots + stars */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentQuote(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentQuote
                          ? 'w-7 bg-primary-500'
                          : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500'
                      }`}
                      aria-label={`Show testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
