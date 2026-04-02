import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import Badge from '../components/Badge';
import { useAuth } from '../context/AuthContext';

const notifications = [
  { type: 'appointments', text: 'Reminder: Video consultation tomorrow at 10:30 AM local time.' },
  { type: 'results', text: 'New HbA1c lab result uploaded with plain-language explanation.' },
  { type: 'messages', text: 'Dr. Patel replied to your blood pressure question 14 minutes ago.' }
];

const activity = [
  'Completed symptom check for recurring headaches.',
  'Booked Dermatology appointment with Dr. Mehta.',
  'Uploaded latest CBC lab report.',
  'Paid invoice #INV-2983 ($42 co-pay).',
  'Enabled refill reminder for Metformin.'
];

const quickActions = [
  {
    label: 'Book Now',
    path: '/patient/book',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  },
  {
    label: 'My Appointments',
    path: '/patient/appointments',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    )
  },
  {
    label: 'Refill Prescription',
    path: '/patient/pharmacy',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    )
  },
  {
    label: 'Message My Doctor',
    path: '/messages',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    label: 'View Lab Results',
    path: '/patient/health-record',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  }
];

const healthStats = [
  { label: 'Blood Pressure', value: '132 / 86', status: 'Slightly elevated', statusColor: 'text-amber-600 dark:text-amber-400' },
  { label: 'Heart Rate', value: '74 bpm', status: 'Within range', statusColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Recent Diagnosis', value: 'Migraine', status: 'Added 3 weeks ago', statusColor: 'text-slate-500 dark:text-slate-400' }
];

const wearables = [
  { label: 'Steps', value: '8,460' },
  { label: 'Heart Rate', value: '71 bpm' },
  { label: 'Sleep', value: '6h 52m' },
  { label: 'SpO2', value: '97%' }
];

const notifTypeColors = {
  appointments: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  results: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  messages: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
};

const appointmentStart = new Date(Date.now() + 26 * 60 * 60 * 1000 + 18 * 60 * 1000);

function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 60000));
  const d = Math.floor(total / (24 * 60));
  const h = Math.floor((total % (24 * 60)) / 60);
  const m = total % 60;
  return `${d}d ${h}h ${m}m`;
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function PatientDashboardPage() {
  const { user } = useAuth();
  const [countdownText, setCountdownText] = useState(
    formatCountdown(appointmentStart.getTime() - Date.now())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownText(formatCountdown(appointmentStart.getTime() - Date.now()));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const firstName = useMemo(() => user?.name?.split(' ')[0] || 'Ananya', [user]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Patient Dashboard"
        title={`${getTimeGreeting()}, ${firstName}`}
        description="Your health command center: upcoming care, urgent actions, wearables, and personalized AI insights."
        action={
          <Link
            to="/patient/book"
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-900 shadow transition hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        }
      />

      {/* Metrics row */}
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Next appointment" value="Tomorrow, 10:30 AM" meta={`Countdown: ${countdownText}`} />
        <MetricCard label="Active medications" value="4" meta="1 refill due in 3 days" />
        <MetricCard label="Unread messages" value="2" meta="From care team" />
        <MetricCard label="Latest triage" value="Yellow" meta="Book within 48 hours" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">

          {/* Quick actions */}
          <div className="card p-5">
            <p className="section-title">Quick Actions</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {quickActions.map(({ label, path, icon }) => (
                <Link
                  key={label}
                  to={path}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary-700 dark:hover:bg-primary-900/20 dark:hover:text-primary-200"
                >
                  <span className="text-primary-500 dark:text-primary-400">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Health summary */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="section-title">Health Summary</p>
              <Badge tone="success">Updated 2h ago</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {healthStats.map(({ label, value, status, statusColor }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-700 dark:from-slate-800/60 dark:to-slate-800/30"
                >
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</p>
                  <p className="mt-1 font-heading text-xl font-bold text-slate-900 dark:text-white">{value}</p>
                  <p className={`mt-1 text-xs font-medium ${statusColor}`}>{status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Wearables */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="section-title">Connected Wearables</p>
              <Badge>Auto Sync</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {wearables.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3 text-center dark:border-slate-700 dark:from-slate-800/60 dark:to-slate-800/30"
                >
                  <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                  <p className="mt-1 font-heading text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="section-title">Health Insights</p>
              <Badge tone="warning">AI Coach</Badge>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-amber-50/30 p-4 dark:border-amber-700/40 dark:from-amber-900/20 dark:to-transparent">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Blood pressure trend alert</p>
                <p className="mt-1 text-sm leading-relaxed text-amber-800/80 dark:text-amber-300/80">
                  Your home readings have gradually increased across 6 months. This note was added to Dr. Patel's prep
                  card for your upcoming visit in 3 weeks.
                </p>
              </div>
              <div className="rounded-2xl border border-primary-200/80 bg-gradient-to-br from-primary-50 to-primary-50/30 p-4 dark:border-primary-700/40 dark:from-primary-900/20 dark:to-transparent">
                <p className="text-sm font-bold text-primary-900 dark:text-primary-200">Daily AI Tip</p>
                <p className="mt-1 text-sm leading-relaxed text-primary-800/80 dark:text-primary-300/80">
                  A 15-minute evening walk after dinner can improve fasting glucose trend consistency this week.
                </p>
              </div>
              <div className="rounded-2xl border border-primary-200/80 bg-gradient-to-br from-primary-50 to-primary-50/30 p-4 dark:border-primary-700/40 dark:from-primary-900/20 dark:to-transparent">
                <p className="text-sm font-bold text-primary-900 dark:text-primary-200">Medication adherence nudge</p>
                <p className="mt-1 text-sm leading-relaxed text-primary-800/80 dark:text-primary-300/80">
                  Metformin refill is overdue by 12 days. Tap below to send a one-click refill request.
                </p>
                <Link
                  to="/patient/pharmacy"
                  className="mt-3 inline-flex rounded-full bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-1.5 text-xs font-bold text-white shadow-soft transition hover:-translate-y-px hover:shadow-glow"
                >
                  Refill Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* AI symptom checker */}
          <div
            className="relative overflow-hidden rounded-2xl p-5 text-white"
            style={{ background: 'linear-gradient(135deg, #0c2a36 0%, #0b3d55 60%, #1a1040 100%)' }}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-400/20 blur-2xl" />
            <p className="relative font-heading text-base font-bold">AI Symptom Checker</p>
            <p className="relative mt-1.5 text-xs leading-relaxed text-white/70">
              Describe your symptoms and get triage guidance in minutes.
            </p>
            <Link
              to="/patient/symptom-checker"
              className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-primary-900 shadow transition hover:-translate-y-0.5"
            >
              Open Medi Assistant
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Notifications */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="section-title">Notifications</p>
              <Badge>Categorized</Badge>
            </div>
            <ul className="space-y-2">
              {notifications.map((item) => (
                <li
                  key={item.text}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <span className={`mr-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${notifTypeColors[item.type]}`}>
                    {item.type}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency contact */}
          <div className="card p-5">
            <p className="section-title">Emergency Contact</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Rohan Sharma (Spouse) • +1 (555) 213-4567
            </p>
            <a
              href="tel:+15552134567"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              Call Emergency Contact
            </a>
          </div>

          {/* Recent activity */}
          <div className="card p-5">
            <p className="section-title">Recent Activity</p>
            <ul className="mt-3 space-y-2">
              {activity.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500 dark:bg-primary-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PatientDashboardPage;
