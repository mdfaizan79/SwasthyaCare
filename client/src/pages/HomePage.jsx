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
    author: 'Priya M., Parent'
  },
  {
    quote: 'Clinical notes are drafted before I even close the call. I spend more time with patients and less with tabs.',
    author: 'Dr. Omar Rahman, Internal Medicine'
  },
  {
    quote: 'Our no-show rate dropped 31% in one quarter after enabling reminders and faster re-booking.',
    author: 'Nina George, Clinic Operations Lead'
  }
];

function HomePage() {
  const [activeTab, setActiveTab] = useState('patients');
  const [currentQuote, setCurrentQuote] = useState(0);
  const [onlineDoctors, setOnlineDoctors] = useState(184);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((value) => (value + 1) % testimonials.length);
    }, 5000);

    const counterTimer = setInterval(() => {
      setOnlineDoctors((value) => {
        const next = value + Math.floor(Math.random() * 5 - 2);
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
    <div className="space-y-10 pb-4">
      <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 px-6 py-12 text-white shadow-soft md:px-10 md:py-14">
        <div className="absolute -left-14 top-8 h-44 w-44 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -right-10 bottom-4 h-56 w-56 rounded-full bg-cyan-200/20 blur-2xl" />
        <div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-primary-100">Swasthya Care Telehealth Platform</p>
            <h1 className="font-heading text-3xl leading-tight md:text-5xl">Your doctor is one tap away.</h1>
            <p className="mt-4 max-w-xl text-sm text-primary-50 md:text-base">
              Consult, manage, and heal with secure telehealth visits, e-prescribing, and intelligent patient support built for
              patients, providers, and clinics.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/patient/book"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary-900 transition hover:-translate-y-0.5"
              >
                Book a Consultation
              </Link>
              <Link
                to="/signup/patient"
                className="rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Get Started Free
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>HIPAA Compliant</Badge>
              <Badge>GDPR Ready</Badge>
              <Badge>256-bit Encryption</Badge>
              <Badge>4.9★ Patient Rating</Badge>
            </div>
          </div>

          <div className="card animate-float p-5 text-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-500">How it works</p>
            <div className="mt-4 space-y-3">
              {[
                ['1', 'Sign Up', 'Create your secure profile in under two minutes.'],
                ['2', 'Connect', 'See available doctors in your local timezone instantly.'],
                ['3', 'Get Care', 'Consult, receive prescriptions, and pay in one flow.']
              ].map(([step, title, description]) => (
                <div key={step} className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-xs font-semibold text-primary-600">Step {step}</p>
                  <p className="mt-1 font-semibold text-primary-900">{title}</p>
                  <p className="text-sm text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <p className="section-title">Built for every healthcare role</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.keys(featureContent).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                  tab === activeTab ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                For {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50/50 p-5">
            <h3 className="font-heading text-xl text-primary-900">{currentFeatures.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {currentFeatures.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-1 text-primary-600">●</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card p-6">
          <p className="text-xs uppercase tracking-wide text-slate-500">Live Capacity</p>
          <p className="mt-2 font-heading text-4xl text-primary-900">{onlineDoctors}</p>
          <p className="text-sm text-slate-600">doctors online now</p>
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-700">Average wait time: 7 min</p>
            <p className="mt-1 text-xs text-emerald-700">Real-time availability synced every minute.</p>
          </div>
          <Link to="/patient/book" className="mt-4 inline-flex rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
            See Next Available Slots
          </Link>
        </div>
      </section>

      <section className="card p-6">
        <p className="section-title">Voices from real care journeys</p>
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <p className="text-lg leading-relaxed text-slate-700">“{testimonials[currentQuote].quote}”</p>
          <p className="mt-3 text-sm font-semibold text-primary-700">{testimonials[currentQuote].author}</p>
          <div className="mt-4 flex gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.author}
                type="button"
                onClick={() => setCurrentQuote(index)}
                className={`h-2.5 rounded-full transition ${index === currentQuote ? 'w-8 bg-primary-600' : 'w-2.5 bg-slate-300'}`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
