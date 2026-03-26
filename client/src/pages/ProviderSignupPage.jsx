import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const ehrSystems = ['Epic', 'Cerner', 'Meditech', 'Athenahealth'];
const blocks = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

function ProviderSignupPage() {
  const [step, setStep] = useState(1);
  const [selectedBlocks, setSelectedBlocks] = useState(['09:00', '10:00', '14:00']);
  const [selectedEhr, setSelectedEhr] = useState('Epic');

  const toggleBlock = (block) => {
    setSelectedBlocks((current) => (current.includes(block) ? current.filter((item) => item !== block) : [...current, block]));
  };

  return (
    <div>
      <PageHeader
        eyebrow="Provider Onboarding"
        title="Set up your clinical workspace"
        description="Upload credentials, configure schedule, connect EHR, and complete payout routing in one guided flow."
      />

      <div className="card p-6">
        <div className="mb-6 flex flex-wrap gap-2 text-xs font-semibold">
          {['Credentials', 'Practice Setup', 'Verification'].map((label, index) => (
            <span
              key={label}
              className={`rounded-full px-3 py-1 ${index + 1 <= step ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}
            >
              Step {index + 1}: {label}
            </span>
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <label className="grid gap-1 text-sm">
              License and credential upload
              <input type="file" className="rounded-xl border border-dashed border-slate-300 px-3 py-3" />
            </label>
            <label className="grid gap-1 text-sm">
              Specialty
              <select className="rounded-xl border border-slate-200 px-3 py-2">
                <option>General Practice</option>
                <option>Dermatology</option>
                <option>Cardiology</option>
                <option>Mental Health</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              Sub-specialty
              <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Optional" />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-slate-700">Availability (drag/drop style quick blocks)</p>
              <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {blocks.map((block) => (
                  <button
                    key={block}
                    type="button"
                    onClick={() => toggleBlock(block)}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold ${
                      selectedBlocks.includes(block)
                        ? 'border-primary-300 bg-primary-100 text-primary-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {block}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">EHR / EMR connection</p>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {ehrSystems.map((system) => (
                  <button
                    key={system}
                    type="button"
                    onClick={() => setSelectedEhr(system)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm ${
                      selectedEhr === system ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-slate-200'
                    }`}
                  >
                    {system}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                Bank Account Number
                <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="••••••••" />
              </label>
              <label className="grid gap-1 text-sm">
                Routing Number
                <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="••••••••" />
              </label>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="font-heading text-2xl text-amber-800">Verification in progress</p>
            <p className="mt-2 text-sm text-amber-800">
              Your credentials have been received. Typical review time is 24–48 hours. You will be notified by email and SMS once
              approved.
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(1, value - 1))}
            disabled={step === 1}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep((value) => Math.min(3, value + 1))}
            disabled={step === 3}
            className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {step === 2 ? 'Submit for Review' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProviderSignupPage;
