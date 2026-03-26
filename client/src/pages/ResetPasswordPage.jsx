import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import api from '../lib/apiClient';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const userId = searchParams.get('userId') ?? '';
  const token = searchParams.get('token') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { newPassword: '' }
  });

  const onSubmit = async (values) => {
    setMessage('');
    setError('');

    try {
      const { data } = await api.post('/auth/reset-password', {
        userId,
        token,
        newPassword: values.newPassword
      });
      setMessage(data?.message ?? 'Password reset successful.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? 'Unable to reset password');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Password Recovery"
        title="Reset your password"
        description="Use the secure token from your email to create a new password."
      />

      <section className="mx-auto w-full max-w-lg card p-6">
        {!userId || !token ? (
          <p className="text-sm text-rose-600">Reset token is missing. Please request a new reset link.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <label className="grid gap-1 text-sm">
              New Password
              <input
                type="password"
                {...register('newPassword', { required: 'Password is required', minLength: 8 })}
                className="rounded-xl border border-slate-200 px-3 py-2"
              />
              {errors.newPassword ? <span className="text-xs text-rose-600">Use at least 8 characters.</span> : null}
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Reset Password'}
            </button>

            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </form>
        )}
      </section>
    </div>
  );
}

export default ResetPasswordPage;
