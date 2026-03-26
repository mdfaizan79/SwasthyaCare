import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useTheme } from '../context/ThemeContext';

function SettingsPage() {
  const [role, setRole] = useState('Patient');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York');
  const [digestFrequency, setDigestFrequency] = useState('Weekly');
  const [dndStart, setDndStart] = useState('22:00');
  const [dndEnd, setDndEnd] = useState('07:00');
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'MacBook Pro • Chrome', location: 'New York, US', active: true },
    { id: 'sess-2', device: 'iPhone 15 • App', location: 'New York, US', active: true },
    { id: 'sess-3', device: 'Windows • Edge', location: 'Boston, US', active: false }
  ]);
  const { isDark, toggleTheme } = useTheme();

  const notificationSummary = useMemo(
    () => `Digest: ${digestFrequency} • Do Not Disturb: ${dndStart} to ${dndEnd}`,
    [digestFrequency, dndStart, dndEnd]
  );

  const revokeSession = (sessionId) => {
    setSessions((current) => current.map((session) => (session.id === sessionId ? { ...session, active: false } : session)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Notifications, privacy, and security controls"
        description="Role-aware settings across Patient, Doctor, and Admin accounts."
      />

      <div className="card p-5">
        <label className="grid max-w-sm gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Role View
          <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <option>Patient</option>
            <option>Doctor</option>
            <option>Admin</option>
          </select>
        </label>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <p className="section-title">Notification Preferences</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> SMS alerts</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Email summaries</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Push notifications</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Lab trend alerts</label>
            <label className="grid gap-1 pt-2 text-xs">
              Digest frequency
              <select value={digestFrequency} onChange={(event) => setDigestFrequency(event.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Never</option>
              </select>
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">{notificationSummary}</p>
        </div>

        <div className="card p-5">
          <p className="section-title">Do Not Disturb</p>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <label className="grid gap-1">
              Start
              <input type="time" value={dndStart} onChange={(event) => setDndStart(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="grid gap-1">
              End
              <input type="time" value={dndEnd} onChange={(event) => setDndEnd(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">Critical emergency alerts bypass DND settings.</p>
        </div>

        <div className="card p-5">
          <p className="section-title">Privacy Controls</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Share data with primary care team</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Share anonymized analytics</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Keep connected apps enabled</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Consent to secure health record sharing links</label>
          </div>
        </div>

        <div className="card p-5">
          <p className="section-title">Security</p>
          <div className="mt-3 grid gap-2 text-sm">
            <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-left dark:border-slate-700">Change password</button>
            <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-left dark:border-slate-700">Manage MFA devices</button>
            <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-left dark:border-slate-700">Enable Face ID / Fingerprint</button>
            <button type="button" onClick={toggleTheme} className="rounded-xl border border-slate-200 px-3 py-2 text-left dark:border-slate-700">
              Toggle Dark Mode ({isDark ? 'On' : 'Off'})
            </button>
          </div>
        </div>

        <div className="card p-5">
          <p className="section-title">Language and Timezone</p>
          <div className="mt-3 grid gap-3 text-sm">
            <select className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              <option>Auto Detect</option>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Arabic</option>
              <option>Hindi</option>
            </select>
            <select value={timezone} onChange={(event) => setTimezone(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              <option>America/New_York</option>
              <option>America/Chicago</option>
              <option>America/Los_Angeles</option>
              <option>Europe/London</option>
              <option>Asia/Kolkata</option>
            </select>
          </div>
        </div>

        <div className="card p-5">
          <p className="section-title">Active Sessions</p>
          <div className="mt-3 space-y-2 text-sm">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="font-semibold text-primary-900 dark:text-primary-100">{session.device}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{session.location}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-xs font-semibold ${session.active ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-300'}`}>
                    {session.active ? 'Active' : 'Revoked'}
                  </span>
                  {session.active ? (
                    <button type="button" onClick={() => revokeSession(session.id)} className="rounded-full border border-rose-200 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-700 dark:text-rose-200">
                      Revoke
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <p className="section-title">Role-Specific Panel ({role})</p>
          {role === 'Patient' ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Reminder cadence and symptom follow-up nudges</li>
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Data export and account deletion request</li>
            </ul>
          ) : null}
          {role === 'Doctor' ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Availability templates and auto-replies</li>
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Clinical note preferences and default signature</li>
            </ul>
          ) : null}
          {role === 'Admin' ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Organization-wide notification defaults</li>
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Policy controls, retention windows, and audit export</li>
            </ul>
          ) : null}
        </div>

        <div className="card border-rose-200 bg-rose-50 p-5 dark:border-rose-700 dark:bg-rose-900/30">
          <p className="section-title">GDPR Actions</p>
          <p className="mt-2 text-sm text-rose-700 dark:text-rose-200">Request full data export, right-to-be-forgotten deletion, or consent updates.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-rose-700 dark:bg-slate-900 dark:text-rose-200">
              Export My Data
            </button>
            <button type="button" className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white">
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
