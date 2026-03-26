import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import api from '../lib/apiClient';

function ProviderDashboardPage() {
  const [search, setSearch] = useState('');
  const appointmentsQuery = useQuery({
    queryKey: ['provider-appointments'],
    queryFn: async () => {
      const { data } = await api.get('/appointments');
      return data?.data ?? [];
    }
  });

  const appointments = appointmentsQuery.data ?? [];
  const today = new Date();

  const todaysAppointments = appointments.filter((item) => {
    const date = new Date(item.appointmentDate);
    return date.toDateString() === today.toDateString();
  });

  const filteredToday = useMemo(() => {
    if (!search.trim()) return todaysAppointments;
    return todaysAppointments.filter((item) =>
      `${item.patientId?.userId?.name ?? ''} ${item.symptoms ?? ''}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [todaysAppointments, search]);

  const completedCount = appointments.filter((item) => item.status === 'completed').length;
  const pendingNotes = appointments.filter((item) => ['in-progress', 'completed'].includes(item.status)).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Doctor Dashboard"
        title="Today’s clinical command view"
        description="Daily schedule, pending actions, and patient context from live appointment data."
      />

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Appointments Today" value={todaysAppointments.length} meta="Live schedule" />
        <MetricCard label="Completed Cases" value={completedCount} meta="All-time" />
        <MetricCard label="Pending Notes" value={pendingNotes} meta="Need review" />
        <MetricCard label="Unread Messages" value="2" meta="In-app inbox" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">Today’s Schedule</p>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Quick patient search by name or complaint"
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            {appointmentsQuery.isLoading ? <p className="mt-2 text-sm text-slate-600">Loading schedule...</p> : null}
            {appointmentsQuery.isError ? <p className="mt-2 text-sm text-rose-600">Unable to load appointments.</p> : null}

            <div className="mt-3 space-y-2">
              {filteredToday.map((slot) => (
                <div key={slot._id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-primary-900">
                      {slot.timeSlot} • {slot.patientId?.userId?.name ?? 'Patient'}
                    </p>
                    <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">{slot.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">Chief complaint: {slot.symptoms || 'Not provided'}</p>
                </div>
              ))}

              {!filteredToday.length && !appointmentsQuery.isLoading ? (
                <p className="text-sm text-slate-600">No appointments scheduled today.</p>
              ) : null}
            </div>
          </div>

          <div className="card p-5">
            <p className="section-title">Clinical Notes Queue</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {appointments
                .filter((item) => item.status === 'in-progress' || item.status === 'completed')
                .slice(0, 4)
                .map((item) => (
                  <li key={`note-${item._id}`} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    {item.patientId?.userId?.name ?? 'Patient'} — {format(new Date(item.appointmentDate), 'PPP')} ({item.status})
                  </li>
                ))}
              {!appointments.length ? <li className="text-slate-600">No notes pending.</li> : null}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">AI-Flagged Alerts</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="rounded-xl border border-rose-200 bg-rose-50 p-3">Patient glucose trend increased over 3 visits.</li>
              <li className="rounded-xl border border-amber-200 bg-amber-50 p-3">Missed follow-up after hypertension medication change.</li>
            </ul>
          </div>

          <div className="card p-5">
            <p className="section-title">Prescription Queue</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {appointments.slice(0, 3).map((item) => (
                <li key={`rx-${item._id}`} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  {item.patientId?.userId?.name ?? 'Patient'} — {item.department}
                </li>
              ))}
              {!appointments.length ? <li className="text-slate-600">No pending prescriptions.</li> : null}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProviderDashboardPage;
