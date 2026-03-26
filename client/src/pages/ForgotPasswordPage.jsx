import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../components/PageHeader';
import api from '../lib/apiClient';

function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { email: '' }
  });

  const onSubmit = async (values) => {
    setMessage('');
    setError('');

    try {
      const { data } = await api.post('/auth/forgot-password', values);
      setMessage(data?.message ?? 'Reset link sent if email exists.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? 'Unable to process request');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Password Recovery"
        title="Forgot your password?"
        description="Enter your email and we will send a secure reset link."
      />

      <section className="mx-auto w-full max-w-lg card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <label className="grid gap-1 text-sm">
            Email
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="rounded-xl border border-slate-200 px-3 py-2"
            />
            {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>

          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}

export default ForgotPasswordPage;
