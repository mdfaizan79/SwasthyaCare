import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const prescriptions = [
  { name: 'Metformin 500mg', refillStatus: 'Due in 2 days', delivery: 'Pickup' },
  { name: 'Atorvastatin 20mg', refillStatus: 'Ready for refill', delivery: 'Delivery' },
  { name: 'Vitamin D3', refillStatus: 'Active', delivery: 'Pickup' }
];

function PharmacyPage() {
  const [pharmacy, setPharmacy] = useState('GreenLeaf Pharmacy - Main Street');
  const [delivery, setDelivery] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pharmacy"
        title="Prescriptions and refills"
        description="Manage current medications, preferred pharmacy, and mail-order options in one place."
      />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-5">
          <p className="section-title">Current Prescriptions</p>
          <div className="mt-4 space-y-3">
            {prescriptions.map((item) => (
              <div key={item.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-primary-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Status: {item.refillStatus}</p>
                  </div>
                  <button type="button" className="rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white">
                    Refill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">Preferred Pharmacy</p>
            <select
              value={pharmacy}
              onChange={(event) => setPharmacy(event.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option>GreenLeaf Pharmacy - Main Street</option>
              <option>WellCare Pharmacy - City Center</option>
              <option>RapidRx - Oak Avenue</option>
            </select>
            <div className="mt-3 grid h-40 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
              Map Integration Placeholder
            </div>
          </div>

          <div className="card p-5">
            <p className="section-title">Delivery & Reminders</p>
            <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={delivery} onChange={(event) => setDelivery(event.target.checked)} />
              Enable partnered mail-order delivery
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={reminders} onChange={(event) => setReminders(event.target.checked)} />
              Refill reminder notifications
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PharmacyPage;
