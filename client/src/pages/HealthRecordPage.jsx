import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';

const events = [
  { date: '2026-02-02', category: 'Lab', detail: 'HbA1c 6.9% (slightly elevated)' },
  { date: '2026-01-12', category: 'Consultation', detail: 'Neurology follow-up for migraine pattern' },
  { date: '2025-12-04', category: 'Prescription', detail: 'Metformin refill approved' },
  { date: '2025-11-18', category: 'Imaging', detail: 'Cervical spine X-ray uploaded' }
];

const labs = [
  { test: 'Glucose', value: '112 mg/dL', explanation: 'Slightly elevated. Keep monitoring fasting levels.' },
  { test: 'LDL', value: '98 mg/dL', explanation: 'Close to optimal. Continue current medication.' },
  { test: 'CRP', value: '2.1 mg/L', explanation: 'Within normal inflammation range.' }
];

function HealthRecordPage() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(events.map((item) => item.category))];

  const filteredEvents = useMemo(
    () => (filter === 'All' ? events : events.filter((item) => item.category === filter)),
    [filter]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Patient Health Record"
        title="Your complete medical timeline"
        description="Deep history view with labs, prescriptions, documents, and wearable trends in one journal-style layout."
        action={
          <button type="button" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-900">
            Download Summary PDF
          </button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="section-title">Medical History Timeline</p>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 space-y-3">
              {filteredEvents.map((item) => (
                <div key={`${item.date}-${item.detail}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">{item.date} • {item.category}</p>
                  <p className="mt-1 text-sm text-slate-700">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="section-title">Lab Results (Plain Language)</p>
            <div className="mt-4 space-y-3">
              {labs.map((lab) => (
                <div key={lab.test} className="rounded-xl border border-slate-100 p-4">
                  <p className="font-semibold text-primary-900">{lab.test}: {lab.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{lab.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="section-title">Prescriptions</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500">
                    <th className="pb-2">Medication</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Metformin', 'Active', 'Refill'],
                    ['Atorvastatin', 'Active', 'Refill'],
                    ['Sumatriptan', 'Past', 'View']
                  ].map(([med, status, action]) => (
                    <tr key={med} className="border-t border-slate-100">
                      <td className="py-3">{med}</td>
                      <td className="py-3">{status}</td>
                      <td className="py-3">
                        <button type="button" className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                          {action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">Vaccination History</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">Influenza — Oct 2025</li>
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">COVID Booster — Jun 2025</li>
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">Tdap — Apr 2024</li>
            </ul>
          </div>

          <div className="card p-5">
            <p className="section-title">Documents & Imaging</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">CBC_Report_Feb_2026.pdf</li>
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">MRI_Brain_Jan_2026.dcm</li>
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">Insurance_Card_2026.png</li>
            </ul>
          </div>

          <div className="card p-5">
            <p className="section-title">Connected Wearables</p>
            <div className="mt-3 grid gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Steps (7-day avg)</p>
                <p className="font-heading text-2xl text-primary-900">8,460</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Resting Heart Rate</p>
                <p className="font-heading text-2xl text-primary-900">71 bpm</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Sleep Duration</p>
                <p className="font-heading text-2xl text-primary-900">6h 52m</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HealthRecordPage;
