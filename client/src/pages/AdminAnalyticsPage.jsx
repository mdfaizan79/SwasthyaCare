import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import api from '../lib/apiClient';

function AdminAnalyticsPage() {
  const analyticsQuery = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics');
      return data?.data;
    }
  });

  const statusBars = useMemo(() => {
    const raw = analyticsQuery.data?.appointmentsByStatus ?? [];
    const total = raw.reduce((sum, item) => sum + item.count, 0) || 1;

    return raw.map((item) => ({
      label: item._id,
      value: Math.round((item.count / total) * 100)
    }));
  }, [analyticsQuery.data]);

  const departmentBars = useMemo(() => {
    const raw = analyticsQuery.data?.appointmentsByDepartment ?? [];
    const top = raw.slice(0, 6);
    const max = top[0]?.count || 1;

    return top.map((item) => ({
      label: item._id,
      value: Math.round((item.count / max) * 100)
    }));
  }, [analyticsQuery.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics & Reporting"
        title="Outcome, financial, and operational intelligence"
        description="Live admin analytics with export-ready operational and status metrics."
      />

      {analyticsQuery.isLoading ? <div className="card p-5 text-sm text-slate-600">Loading analytics...</div> : null}
      {analyticsQuery.isError ? (
        <div className="card p-5 text-sm text-rose-600">Unable to load admin analytics. Verify admin login and API connection.</div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Total Users</p>
          <p className="font-heading text-3xl text-primary-900">{analyticsQuery.data?.totals?.users ?? '-'}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Appointments</p>
          <p className="font-heading text-3xl text-primary-900">{analyticsQuery.data?.totals?.appointments ?? '-'}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Doctors</p>
          <p className="font-heading text-3xl text-primary-900">{analyticsQuery.data?.totals?.doctors ?? '-'}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Patients</p>
          <p className="font-heading text-3xl text-primary-900">{analyticsQuery.data?.totals?.patients ?? '-'}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <p className="section-title">Appointment Status Distribution</p>
          <div className="mt-4 space-y-3">
            {statusBars.map((metric) => (
              <div key={metric.label}>
                <div className="mb-1 flex justify-between text-sm text-slate-700">
                  <span className="capitalize">{metric.label}</span>
                  <span>{metric.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary-600" style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
            {!statusBars.length ? <p className="text-sm text-slate-600">No status data available.</p> : null}
          </div>
        </div>

        <div className="card p-5">
          <p className="section-title">Department Load</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {departmentBars.map((point) => (
              <div key={point.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                <div className="mx-auto flex h-24 w-10 items-end rounded-full bg-slate-100 p-1">
                  <div className="w-full rounded-full bg-accent-500" style={{ height: `${point.value}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-600">{point.label}</p>
              </div>
            ))}
            {!departmentBars.length ? <p className="text-sm text-slate-600">No department data available.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminAnalyticsPage;
