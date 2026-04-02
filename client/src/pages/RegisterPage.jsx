import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

function nextPathByRole(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'doctor') return '/provider/dashboard';
  return '/patient/dashboard';
}

const roles = [
  {
    value: 'patient',
    label: 'Patient',
    desc: 'Book consultations & manage health',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
  {
    value: 'doctor',
    label: 'Doctor',
    desc: 'Provide consultations & manage patients',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  },
  {
    value: 'admin',
    label: 'Admin',
    desc: 'Manage platform operations',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    )
  }
];

function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '', role: 'patient', phone: '' }
  });

  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const user = await registerUser(values);
      navigate(nextPathByRole(user.role), { replace: true });
    } catch (error) {
      setServerError(error?.response?.data?.message ?? 'Registration failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Authentication"
        title="Create a new account"
        description="Role-specific registration for patients, doctors, and admins with real-time validation."
      />

      <section className="mx-auto w-full max-w-2xl">
        <div className="card p-7">
          {/* Social sign-up */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Sign up with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-medium text-slate-400 dark:bg-slate-900 dark:text-slate-500">
              or register with email
            </span>
          </div>

          {/* Role selector */}
          <div className="mb-5">
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">I am registering as a…</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setValue('role', r.value, { shouldValidate: true })}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                    selectedRole === r.value
                      ? 'border-primary-300 bg-primary-50 ring-1 ring-primary-200 dark:border-primary-600 dark:bg-primary-900/25 dark:ring-primary-800'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'
                  }`}
                >
                  <span className={`mt-0.5 ${selectedRole === r.value ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>
                    {r.icon}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${selectedRole === r.value ? 'text-primary-800 dark:text-primary-200' : 'text-slate-700 dark:text-slate-300'}`}>
                      {r.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</span>
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name should be at least 2 characters' }
                })}
                placeholder="Your full name"
                className="input"
              />
              {errors.name ? (
                <span className="text-xs text-rose-600 dark:text-rose-400">{errors.name.message}</span>
              ) : null}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email address' }
                })}
                placeholder="you@example.com"
                className="input"
              />
              {errors.email ? (
                <span className="text-xs text-rose-600 dark:text-rose-400">{errors.email.message}</span>
              ) : null}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</span>
              <input
                {...register('phone', {
                  pattern: { value: /^[+0-9()\-\s]{7,}$/, message: 'Enter a valid phone number' }
                })}
                placeholder="+1 (555) 000-0000"
                className="input"
              />
              {errors.phone ? (
                <span className="text-xs text-rose-600 dark:text-rose-400">{errors.phone.message}</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Use at least 8 characters' }
                })}
                placeholder="Minimum 8 characters"
                className="input"
              />
              {errors.password ? (
                <span className="text-xs text-rose-600 dark:text-rose-400">{errors.password.message}</span>
              ) : null}
            </label>

            {selectedRole === 'doctor' ? (
              <>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Specialization</span>
                  <input {...register('specialization')} placeholder="e.g. Cardiology" className="input" />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</span>
                  <input {...register('department')} placeholder="e.g. Internal Medicine" className="input" />
                </label>
              </>
            ) : null}

            <p className="text-xs text-slate-500 dark:text-slate-400 md:col-span-2">
              A verification email will be sent immediately after registration.
            </p>

            {serverError ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400 md:col-span-2">
                {serverError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary md:col-span-2"
            >
              {isSubmitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;
