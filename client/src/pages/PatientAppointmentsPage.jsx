import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import PageHeader from '../components/PageHeader';
import api from '../lib/apiClient';
import { SOCKET_URL } from '../lib/runtimeConfig';

function PatientAppointmentsPage() {
  const queryClient = useQueryClient();
  const [socketState, setSocketState] = useState('connecting');

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      timeout: 5000,
      reconnectionAttempts: 3
    });

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    };

    const onConnect = () => {
      setSocketState('connected');
    };

    const onDisconnect = () => {
      setSocketState('unavailable');
    };

    const onConnectError = () => {
      setSocketState('unavailable');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('appointment:created', refresh);
    socket.on('appointment:updated', refresh);
    socket.on('appointment:cancelled', refresh);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('appointment:created', refresh);
      socket.off('appointment:updated', refresh);
      socket.off('appointment:cancelled', refresh);
      socket.disconnect();
    };
  }, [queryClient]);

  const appointmentsQuery = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await api.get('/appointments');
      return data?.data ?? [];
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Appointments"
        title="Track upcoming and past consultations"
        description="Real-time status transitions from pending to completed with cancellation controls."
      />

      <section className="card p-5">
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-300">
          Realtime sync: {socketState === 'connected' ? 'Connected' : 'Temporarily unavailable. Manual refresh still works.'}
        </p>
        {appointmentsQuery.isLoading ? <p className="text-sm text-slate-600">Loading appointments...</p> : null}
        {appointmentsQuery.isError ? (
          <p className="text-sm text-rose-600">Unable to load appointments. Login and API connection are required.</p>
        ) : null}

        <div className="space-y-3">
          {(appointmentsQuery.data ?? []).map((appointment) => (
            <article key={appointment._id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-primary-900">{appointment.doctorId?.userId?.name ?? 'Doctor not assigned'}</p>
                  <p className="text-sm text-slate-600">{appointment.department}</p>
                </div>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  {appointment.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                {format(new Date(appointment.appointmentDate), 'PPP')} • {appointment.timeSlot}
              </p>
              <p className="text-sm text-slate-600">Symptoms: {appointment.symptoms || 'Not provided'}</p>

              {appointment.status !== 'cancelled' && appointment.status !== 'completed' ? (
                <button
                  type="button"
                  onClick={() => cancelMutation.mutate(appointment._id)}
                  className="mt-3 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700"
                >
                  Cancel Appointment
                </button>
              ) : null}
            </article>
          ))}
        </div>

        {appointmentsQuery.data?.length === 0 && !appointmentsQuery.isLoading ? (
          <p className="text-sm text-slate-600">No appointments found yet.</p>
        ) : null}
      </section>
    </div>
  );
}

export default PatientAppointmentsPage;
