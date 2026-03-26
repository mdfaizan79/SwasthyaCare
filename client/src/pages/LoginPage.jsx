import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

function nextPathByRole(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'doctor') return '/provider/dashboard';
  return '/patient/dashboard';
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [biometricHint, setBiometricHint] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    setServerError('');

    try {
      const user = await login(values);
      const redirect = location.state?.from || nextPathByRole(user.role);
      navigate(redirect, { replace: true });
    } catch (error) {
      setServerError(error?.response?.data?.message ?? 'Login failed');
    }
  };

  const mockSocialLogin = (provider) => {
    setServerError(`${provider} social login is enabled in production with OAuth keys.`);
  };

  const mockBiometricLogin = () => {
    setBiometricHint('Biometric login requires mobile app secure enclave support (Face ID / Fingerprint).');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Authentication"
        title="Sign in to your account"
        description="Access patient, doctor, and admin dashboards with role-aware routing."
      />

      <section className="mx-auto w-full max-w-lg card p-6">
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => mockSocialLogin('Google')}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => mockSocialLogin('Apple')}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Continue with Apple ID
          </button>
        </div>

        <div className="relative mb-4">
          <div className="h-px bg-slate-200 dark:bg-slate-700" />
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-300">
            OR
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <label className="grid gap-1 text-sm">
            Email
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Enter a valid email address'
                }
              })}
              className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
          </label>

          <label className="grid gap-1 text-sm">
            Password
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Use at least 8 characters'
                }
              })}
              className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            {errors.password ? <span className="text-xs text-rose-600">{errors.password.message}</span> : null}
          </label>

          {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={mockBiometricLogin}
            className="w-full rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Use Face ID / Fingerprint
          </button>

          {biometricHint ? <p className="text-xs text-slate-500 dark:text-slate-300">{biometricHint}</p> : null}

          <div className="text-right text-xs">
            <Link to="/auth/forgot-password" className="font-semibold text-primary-700">
              Forgot password?
            </Link>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          New here?{' '}
          <Link to="/auth/register" className="font-semibold text-primary-700">
            Create account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
