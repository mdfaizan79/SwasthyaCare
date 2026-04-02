import { useForm } from 'react-hook-form';
import PageHeader from '../components/PageHeader';

const emergencyContacts = [
  { icon: '🚨', label: 'Emergency', number: '911', sub: 'Life-threatening situations' },
  { icon: '🏥', label: 'Hospital Helpline', number: '+1 (800) 555-1234', sub: 'General enquiries & support' },
  { icon: '🚑', label: 'Ambulance Desk', number: '+1 (800) 555-0099', sub: 'Non-emergency transport' }
];

function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting }
  } = useForm({
    defaultValues: { name: '', email: '', message: '' }
  });

  const onSubmit = () => {
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Contact"
        title="Reach support and emergency lines"
        description="Send a message, call helpline numbers, or locate your nearest hospital facility."
      />

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Contact form */}
        <form className="card p-6" onSubmit={handleSubmit(onSubmit)}>
          <p className="section-title">Send us a message</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            We respond to all messages within 2 business hours.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</span>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Your full name"
                className="input"
              />
              {errors.name ? (
                <span className="text-xs text-rose-600 dark:text-rose-400">{errors.name.message}</span>
              ) : null}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</span>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' }
                })}
                placeholder="you@example.com"
                className="input"
              />
              {errors.email ? (
                <span className="text-xs text-rose-600 dark:text-rose-400">{errors.email.message}</span>
              ) : null}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</span>
              <textarea
                {...register('message', { required: 'Message is required', minLength: 10 })}
                placeholder="How can we help you today?"
                className="input min-h-[120px] resize-none"
              />
              {errors.message ? (
                <span className="text-xs text-rose-600 dark:text-rose-400">Please enter at least 10 characters.</span>
              ) : null}
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </button>

            {isSubmitSuccessful ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400">
                Message submitted successfully. We'll be in touch shortly.
              </div>
            ) : null}
          </div>
        </form>

        <div className="space-y-4">
          {/* Emergency contacts */}
          <div className="card p-6">
            <p className="section-title">Emergency Contacts</p>
            <div className="mt-4 space-y-3">
              {emergencyContacts.map((c) => (
                <a
                  key={c.label}
                  href={`tel:${c.number.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-primary-200 hover:bg-primary-50/40 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-primary-700/50 dark:hover:bg-primary-900/15"
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.sub}</p>
                  </div>
                  <span className="font-heading text-sm font-bold text-primary-600 dark:text-primary-400">
                    {c.number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="card p-6">
            <p className="section-title">Location</p>
            <div className="mt-4 grid h-56 place-items-center rounded-xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-primary-50/30 dark:border-slate-700 dark:from-slate-800/50 dark:to-primary-900/10">
              <div className="text-center">
                <svg
                  className="mx-auto text-slate-400"
                  width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">Map integration</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
