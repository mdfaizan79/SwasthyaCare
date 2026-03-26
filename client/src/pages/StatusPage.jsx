import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import api from '../lib/apiClient';
import { API_BASE_URL, HEALTH_URL, SOCKET_URL } from '../lib/runtimeConfig';

function StatusPage() {
  const healthQuery = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const { data } = await api.get('/health');
      return data;
    },
    retry: 1,
    staleTime: 15_000,
    refetchInterval: 30_000
  });

  const apiStatus =
    healthQuery.isLoading && !healthQuery.data
      ? 'Checking'
      : healthQuery.isSuccess
        ? 'Operational'
        : 'Unavailable';

  const services = useMemo(
    () => [
      {
        name: 'API Gateway',
        uptime: healthQuery.isSuccess ? 'Live health check passed' : 'Waiting for successful health check',
        status: apiStatus,
        detail: `Health endpoint: ${HEALTH_URL}`
      },
      {
        name: 'Realtime Appointment Sync',
        uptime: healthQuery.isSuccess ? 'Socket endpoint configured' : 'Socket endpoint ready after API recovery',
        status: healthQuery.isSuccess ? 'Operational' : 'Degraded Performance',
        detail: `Socket endpoint: ${SOCKET_URL}`
      },
      {
        name: 'Public Doctor Directory',
        uptime: healthQuery.isError ? 'Fallback catalogue active when API is unavailable' : 'Live data with fallback protection',
        status: healthQuery.isError ? 'Degraded Performance' : 'Operational',
        detail: 'Public browsing remains available even during temporary backend issues.'
      }
    ],
    [apiStatus, healthQuery.isError, healthQuery.isSuccess]
  );

  const lastCheckedAt = healthQuery.dataUpdatedAt || healthQuery.errorUpdatedAt;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System Status"
        title="Live platform connectivity"
        description="Frontend service checks wired to the real API configuration used by the app."
      />

      <section className="card p-5 text-sm text-slate-600 dark:text-slate-300">
        <div className="grid gap-2 md:grid-cols-2">
          <p>
            Current API base URL:{' '}
            <span className="font-semibold text-primary-700 dark:text-primary-200">{API_BASE_URL}</span>
          </p>
          <p>
            Last checked:{' '}
            <span className="font-semibold text-primary-700 dark:text-primary-200">
              {lastCheckedAt ? new Date(lastCheckedAt).toLocaleString() : 'Pending first check'}
            </span>
          </p>
        </div>
      </section>

      {healthQuery.isError ? (
        <section className="card border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100">
          Health check failed. API-powered screens may be limited until the backend is reachable again.
        </section>
      ) : null}

      <section className="card p-5">
        <div className="space-y-2">
          {services.map((service) => (
            <div
              key={service.name}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary-900 dark:text-primary-100">{service.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{service.uptime}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    service.status === 'Operational'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : service.status === 'Checking'
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                >
                  {service.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">{service.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default StatusPage;
