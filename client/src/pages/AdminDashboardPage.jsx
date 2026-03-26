import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import api from '../lib/apiClient';

function AdminDashboardPage() {
  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data?.data ?? [];
    }
  });

  const appointmentsQuery = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: async () => {
      const { data } = await api.get('/admin/appointments');
      return data?.data ?? [];
    }
  });

  const users = usersQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];

  const doctors = users.filter((item) => item.role === 'doctor').length;
  const patients = users.filter((item) => item.role === 'patient').length;
  const pendingAppointments = appointments.filter((item) => item.status === 'pending').length;
  const cancelledAppointments = appointments.filter((item) => item.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Practice operations center"
        description="Manage users, appointments, schedules, and compliance from one command panel."
        action={
          <Link to="/admin/analytics" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-900">
            Open Analytics
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total Users" value={users.length} meta={`Doctors: ${doctors} | Patients: ${patients}`} />
        <MetricCard label="Appointments" value={appointments.length} meta={`Pending: ${pendingAppointments}`} />
        <MetricCard label="Cancelled" value={cancelledAppointments} meta="Requires follow-up" />
        <MetricCard label="Active Accounts" value={users.filter((item) => item.isActive).length} meta="Across all roles" />
      </section>

      {(usersQuery.isLoading || appointmentsQuery.isLoading) && (
        <div className="card p-4 text-sm text-slate-600">Loading admin data...</div>
      )}
      {(usersQuery.isError || appointmentsQuery.isError) && (
        <div className="card p-4 text-sm text-rose-600">Unable to load admin data. Ensure admin login and API connection.</div>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <p className="section-title">User Management</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {users.slice(0, 6).map((user) => (
              <div key={user._id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-primary-900">{user.name}</p>
                  <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">{user.role}</span>
                </div>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            ))}
            {!users.length ? <p className="text-slate-600">No users found.</p> : null}
          </div>
        </div>

        <div className="card p-5">
          <p className="section-title">Appointment Management</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {appointments.slice(0, 6).map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-primary-900">{item.patientId?.userId?.name ?? 'Patient'}</p>
                  <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">{item.status}</span>
                </div>
                <p className="text-xs text-slate-500">Doctor: {item.doctorId?.userId?.name ?? 'Doctor'}</p>
              </div>
            ))}
            {!appointments.length ? <p className="text-slate-600">No appointments found.</p> : null}
          </div>
        </div>

        <div className="card p-5">
          <p className="section-title">Department Management</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">Manage hospital department master list</li>
            <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">Map doctors to departments and shifts</li>
            <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">Track demand and adjust capacity</li>
          </ul>
        </div>

        <div className="card p-5">
          <p className="section-title">Compliance & Settings</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">Audit logging enabled for profile and appointment access</li>
            <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">Role-based route protection active in frontend and backend</li>
            <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">Rate limiting and input sanitization enabled at API gateway</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;
