import { useForm } from 'react-hook-form';
import PageHeader from '../components/PageHeader';

function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
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
        <form className="card p-5" onSubmit={handleSubmit(onSubmit)}>
          <p className="section-title">Contact Form</p>
          <div className="mt-4 space-y-3">
            <label className="grid gap-1 text-sm">
              Name
              <input
                {...register('name', { required: 'Name is required' })}
                className="rounded-xl border border-slate-200 px-3 py-2"
              />
              {errors.name ? <span className="text-xs text-rose-600">{errors.name.message}</span> : null}
            </label>

            <label className="grid gap-1 text-sm">
              Email
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Enter a valid email'
                  }
                })}
                className="rounded-xl border border-slate-200 px-3 py-2"
              />
              {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
            </label>

            <label className="grid gap-1 text-sm">
              Message
              <textarea
                {...register('message', { required: 'Message is required', minLength: 10 })}
                className="min-h-32 rounded-xl border border-slate-200 px-3 py-2"
              />
              {errors.message ? <span className="text-xs text-rose-600">Please enter at least 10 characters.</span> : null}
            </label>

            <button type="submit" className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white">
              Send Message
            </button>
            {isSubmitSuccessful ? <p className="text-sm text-emerald-700">Message submitted successfully.</p> : null}
          </div>
        </form>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">Emergency Contacts</p>
            <p className="mt-3 text-sm text-slate-700">Emergency: 911</p>
            <p className="text-sm text-slate-700">Hospital Helpline: +1 (800) 555-1234</p>
            <p className="text-sm text-slate-700">Ambulance Desk: +1 (800) 555-0099</p>
          </div>

          <div className="card p-5">
            <p className="section-title">Location Map</p>
            <div className="mt-3 grid h-56 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
              Map integration placeholder
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
