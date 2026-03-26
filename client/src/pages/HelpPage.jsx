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

  const submitFeatureRequest = (event) => {
    event.preventDefault();
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
        <div className="card p-5">
          <div className="flex flex-wrap items-center gap-2">
            {['Patient', 'Doctor', 'Admin'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  role === item ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search FAQ"
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />

          <div className="mt-4 space-y-3">
            {filteredFaq.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="font-semibold text-primary-900 dark:text-primary-100">{faq.q}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{faq.a}</p>
              </div>
            ))}
            {filteredFaq.length === 0 ? <p className="text-sm text-slate-600 dark:text-slate-300">No FAQ entries match your search.</p> : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">Video Tutorials</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Getting started as a patient (4:18)</li>
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Running your first tele-consult (5:06)</li>
              <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Admin reporting walkthrough (6:42)</li>
            </ul>
          </div>

          <div className="card p-5">
            <p className="section-title">Live Support</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Intercom/chatbot widget placeholder for instant support with human escalation.</p>
            <button type="button" className="mt-3 w-full rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
              Start Live Chat
            </button>
          </div>

          <form onSubmit={submitFeatureRequest} className="card p-5">
            <p className="section-title">Feature Request</p>
            <textarea
              value={featureRequest}
              onChange={(event) => setFeatureRequest(event.target.value)}
              className="mt-3 min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Tell us what would make MediConnect better for you"
            />
            <button type="submit" className="mt-3 rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white">
              Submit Request
            </button>
            {submitted ? <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">Thanks, your feature request was submitted.</p> : null}
          </form>

          <div className="card border-amber-200 bg-amber-50 p-5 dark:border-amber-700 dark:bg-amber-900/30">
            <p className="section-title">Escalation Path</p>
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
              For medical emergencies call 911 immediately. For urgent billing or clinical concerns, escalate to human support via
              hotline: +1 (800) 555-1234.
            </p>
            <Link to="/status" className="mt-3 inline-flex text-sm font-semibold text-amber-900 underline dark:text-amber-200">
              Open System Status Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HelpPage;
