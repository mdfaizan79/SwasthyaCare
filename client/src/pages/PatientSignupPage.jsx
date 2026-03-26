import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';

const stepLabels = ['Basic Info', 'Health Profile', 'MFA Setup'];

function PatientSignupPage() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [cropZoom, setCropZoom] = useState(45);
  const [ocrText, setOcrText] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    dob: '',
    password: '',
    insuranceId: '',
    allergies: '',
    conditions: '',
    mfaMethod: 'sms'
  });

  const progress = useMemo(() => (step / stepLabels.length) * 100, [step]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const next = () => setStep((value) => Math.min(value + 1, stepLabels.length));
  const back = () => setStep((value) => Math.max(value - 1, 1));

  const submit = (event) => {
    event.preventDefault();
    if (step < stepLabels.length) {
      next();
      return;
    }
    setCompleted(true);
  };

  const onProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    setProfilePhotoUrl(nextUrl);
  };

  const mockInsuranceScan = () => {
    setOcrText('OCR extracted: Insurance Provider: HealthSure | Member ID: HS-284771 | Group: 4401');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Patient Onboarding"
        title="Create your care account"
        description="A guided onboarding wizard with profile setup, insurance scan, and MFA activation."
      />

      <div className="card p-6">
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-300">
            <span>Step {step} of 3</span>
            <span>{stepLabels[step - 1]}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
            <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {stepLabels.map((label, index) => (
              <span
                key={label}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  index + 1 <= step ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {completed ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-700 dark:bg-emerald-900/30">
            <p className="font-heading text-2xl text-emerald-700 dark:text-emerald-200">Welcome to MediConnect. Your health, your way.</p>
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-200">
              Your account is ready. Email verification and MFA are active. You can complete profile details anytime from Settings.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            {step === 1 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1 text-sm md:col-span-2">
                  Profile photo upload
                  <input type="file" accept="image/*" onChange={onProfilePhotoChange} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
                </label>

                {profilePhotoUrl ? (
                  <div className="md:col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500 dark:text-slate-300">Crop/zoom preview</p>
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={profilePhotoUrl}
                        alt="Profile preview"
                        className="h-16 w-16 rounded-full object-cover"
                        style={{ transform: `scale(${1 + cropZoom / 100})` }}
                      />
                      <label className="grid flex-1 gap-1 text-xs">
                        Crop Zoom
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={cropZoom}
                          onChange={(event) => setCropZoom(Number(event.target.value))}
                        />
                      </label>
                    </div>
                  </div>
                ) : null}

                <label className="grid gap-1 text-sm">
                  Full name
                  <input
                    required
                    name="fullName"
                    value={form.fullName}
                    onChange={updateField}
                    className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Ananya Sharma"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Email
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={updateField}
                    className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Date of birth
                  <input
                    required
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={updateField}
                    className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Password
                  <input
                    required
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={updateField}
                    className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="••••••••"
                  />
                </label>
                <div className="md:col-span-2 grid gap-2 sm:grid-cols-2">
                  <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                    Continue with Google
                  </button>
                  <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                    Continue with Apple ID
                  </button>
                </div>
                <p className="md:col-span-2 rounded-xl border border-primary-100 bg-primary-50 px-3 py-2 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
                  Email verification link will be sent immediately after this step.
                </p>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  Insurance ID
                  <input
                    name="insuranceId"
                    value={form.insuranceId}
                    onChange={updateField}
                    className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Optional"
                  />
                </label>

                <div className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                  <p className="font-semibold text-primary-900 dark:text-primary-100">Insurance Card Scan (OCR)</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">Use camera to auto-extract member details.</p>
                  <button
                    type="button"
                    onClick={mockInsuranceScan}
                    className="mt-2 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Scan with Camera
                  </button>
                  {ocrText ? <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">{ocrText}</p> : null}
                </div>

                <label className="grid gap-1 text-sm md:col-span-2">
                  Allergies
                  <textarea
                    name="allergies"
                    value={form.allergies}
                    onChange={updateField}
                    className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="e.g. Penicillin, peanuts"
                  />
                </label>
                <label className="grid gap-1 text-sm md:col-span-2">
                  Chronic conditions
                  <textarea
                    name="conditions"
                    value={form.conditions}
                    onChange={updateField}
                    className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="e.g. Type 2 diabetes"
                  />
                </label>
                <p className="md:col-span-2 text-xs text-slate-500 dark:text-slate-300">
                  You can click “Complete later” and update this from your dashboard.
                </p>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">Choose your multi-factor authentication method.</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { value: 'sms', title: 'SMS Code', detail: 'Receive one-time codes on your mobile.' },
                    { value: 'authenticator', title: 'Authenticator App', detail: 'Use TOTP app for stronger security.' }
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`cursor-pointer rounded-2xl border p-4 ${
                        form.mfaMethod === method.value ? 'border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/30' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name="mfaMethod"
                        value={method.value}
                        checked={form.mfaMethod === method.value}
                        onChange={updateField}
                      />
                      <p className="font-semibold text-primary-900 dark:text-primary-100">{method.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{method.detail}</p>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300">Biometric login (Face ID / Fingerprint) can be enabled later from mobile settings.</p>
              </div>
            ) : null}

            <div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
              <button
                type="button"
                onClick={back}
                disabled={step === 1}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
              >
                Back
              </button>
              <div className="flex gap-2">
                {step === 2 ? (
                  <button type="button" onClick={next} className="rounded-full px-4 py-2 text-sm font-semibold text-primary-700">
                    Complete Later
                  </button>
                ) : null}
                <button type="submit" className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white">
                  {step === 3 ? 'Finish Sign Up' : 'Continue'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PatientSignupPage;
