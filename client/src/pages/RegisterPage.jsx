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

function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'patient',
      phone: ''
    }
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

      <section className="mx-auto w-full max-w-2xl card p-6">
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Sign up with Google
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Sign up with Apple ID
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm md:col-span-2">
            Full Name
            <input
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name should be at least 2 characters' }
              })}
              className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
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
                  message: 'Enter a valid email address'
                }
              })}
              className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
          </label>

          <label className="grid gap-1 text-sm">
            Phone
            <input
              {...register('phone', {
                pattern: {
                  value: /^[+0-9()\-\s]{7,}$/,
                  message: 'Enter a valid phone number'
                }
              })}
              className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            {errors.phone ? <span className="text-xs text-rose-600">{errors.phone.message}</span> : null}
          </label>

          <label className="grid gap-1 text-sm">
            Password
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Use at least 8 characters' }
              })}
              className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            {errors.password ? <span className="text-xs text-rose-600">{errors.password.message}</span> : null}
          </label>

          <label className="grid gap-1 text-sm">
            Role
            <select {...register('role')} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {selectedRole === 'doctor' ? (
            <>
              <label className="grid gap-1 text-sm">
                Specialization
                <input {...register('specialization')} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              </label>
              <label className="grid gap-1 text-sm">
                Department
                <input {...register('department')} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              </label>
            </>
          ) : null}

          <p className="text-xs text-slate-500 dark:text-slate-300 md:col-span-2">Email verification will be sent immediately after registration.</p>

          {serverError ? <p className="text-sm text-rose-600 md:col-span-2">{serverError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-semibold text-primary-700">
            Sign in
          </Link>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;
