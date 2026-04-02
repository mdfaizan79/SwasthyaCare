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
    defaultValues: { email: '', password: '' }
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

      <section className="mx-auto w-full max-w-lg">
        <div className="card p-7">
          {/* Social buttons */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => mockSocialLogin('Google')}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => mockSocialLogin('Apple')}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-medium text-slate-400 dark:bg-slate-900 dark:text-slate-500">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</span>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email address' }
                })}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-primary-600 dark:focus:ring-primary-900/30"
              />
              {errors.email ? (
                <span className="text-xs text-rose-600 dark:text-rose-400">{errors.email.message}</span>
              ) : null}
            </label>

            <label className="block space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
                <Link to="/auth/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Use at least 8 characters' }
                })}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-primary-600 dark:focus:ring-primary-900/30"
              />
              {errors.password ? (
                <span className="text-xs text-rose-600 dark:text-rose-400">{errors.password.message}</span>
              ) : null}
            </label>

            {serverError ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400">
                {serverError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={mockBiometricLogin}
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Use Face ID / Fingerprint
            </button>

            {biometricHint ? (
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{biometricHint}</p>
            ) : null}
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            New here?{' '}
            <Link to="/auth/register" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
