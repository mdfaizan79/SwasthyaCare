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

const appointmentStart = new Date(Date.now() + 26 * 60 * 60 * 1000 + 18 * 60 * 1000);

function formatCountdown(msRemaining) {
  const totalMinutes = Math.max(0, Math.floor(msRemaining / 60000));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d ${hours}h ${minutes}m`;
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function PatientDashboardPage() {
  const { user } = useAuth();
  const [countdownText, setCountdownText] = useState(formatCountdown(appointmentStart.getTime() - Date.now()));

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
        description="Your health command center: upcoming care, urgent actions, wearables, and personalized AI insights in one place."
        action={
          <Link to="/patient/book" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-900">
            Book Now
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Next appointment" value="Tomorrow, 10:30 AM" meta={`Countdown: ${countdownText}`} />
        <MetricCard label="Active medications" value="4" meta="1 refill due in 3 days" />
        <MetricCard label="Unread messages" value="2" meta="From care team" />
        <MetricCard label="Latest triage" value="Yellow" meta="Book within 48 hours" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">Quick Actions</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['Book Now', '/patient/book'],
                ['My Appointments', '/patient/appointments'],
                ['Refill Prescription', '/patient/pharmacy'],
                ['Message My Doctor', '/messages'],
                ['View Lab Results', '/patient/health-record']
              ].map(([label, path]) => (
                <Link
                  key={label}
                  to={path}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary-800 transition hover:border-primary-200 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-900 dark:text-primary-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="section-title">Health Summary</p>
              <Badge success>Updated 2h ago</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-300">Blood Pressure</p>
                <p className="font-heading text-xl text-primary-900 dark:text-primary-100">132 / 86</p>
                <p className="text-xs text-amber-600 dark:text-amber-300">Slightly elevated</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-300">Heart Rate</p>
                <p className="font-heading text-xl text-primary-900 dark:text-primary-100">74 bpm</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-300">Within range</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-300">Recent Diagnosis</p>
                <p className="font-heading text-xl text-primary-900 dark:text-primary-100">Migraine</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">Added 3 weeks ago</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="section-title">Connected Wearables</p>
              <Badge>Auto Sync</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {[
                ['Steps', '8,460'],
                ['Heart Rate', '71 bpm'],
                ['Sleep', '6h 52m'],
                ['SpO2', '97%']
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-300">{label}</p>
                  <p className="font-heading text-lg text-primary-900 dark:text-primary-100">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="section-title">Your Health Insights</p>
              <Badge warning>AI Coach</Badge>
            </div>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              <p className="font-semibold">Blood pressure trend alert</p>
              <p className="mt-1">
                Your home readings have gradually increased across 6 months. This note was added to Dr. Patel’s prep card for your
                upcoming visit in 3 weeks.
              </p>
            </div>
            <div className="mt-3 rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
              <p className="font-semibold">Daily AI Tip</p>
              <p className="mt-1">A 15-minute evening walk after dinner can improve fasting glucose trend consistency this week.</p>
            </div>
            <div className="mt-3 rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
              <p className="font-semibold">Medication adherence nudge</p>
              <p className="mt-1">Metformin refill is overdue by 12 days. Tap below to send a one-click refill request.</p>
              <Link to="/patient/pharmacy" className="mt-3 inline-flex rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white">
                Refill Now
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">AI Symptom Checker</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Describe your symptoms and get triage guidance in minutes.</p>
            <Link
              to="/patient/symptom-checker"
              className="mt-4 inline-flex rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Open Medi Assistant
            </Link>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="section-title">Notifications</p>
              <Badge>Categorized</Badge>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {notifications.map((item) => (
                <li key={item.text} className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                  <span className="mr-2 inline-flex rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                    {item.type}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="section-title">Emergency Contact</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Rohan Sharma (Spouse) • +1 (555) 213-4567</p>
            <a href="tel:+15552134567" className="mt-3 inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
              Call Emergency Contact
            </a>
          </div>

          <div className="card p-5">
            <p className="section-title">Recent Activity</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {activity.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 text-primary-600">●</span>
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
