import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import api from '../lib/apiClient';

const fallbackDoctors = [
  {
    _id: 'local-1',
    specialization: 'Cardiology',
    department: 'Cardiology',
    experience: 11,
    consultationFee: 110,
    userId: { name: 'Dr. Aarav Patel', phone: '+1 (555) 0101' }
  },
  {
    _id: 'local-2',
    specialization: 'General Practice',
    department: 'General Medicine',
    experience: 8,
    consultationFee: 75,
    userId: { name: 'Dr. Maya Chen', phone: '+1 (555) 0102' }
  },
  {
    _id: 'local-3',
    specialization: 'Dermatology',
    department: 'Dermatology',
    experience: 9,
    consultationFee: 95,
    userId: { name: 'Dr. Sofia Reed', phone: '+1 (555) 0103' }
  }
];

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const avatarColors = [
  'from-primary-500 to-primary-700',
  'from-violet-500 to-violet-700',
  'from-emerald-500 to-emerald-700',
  'from-rose-500 to-rose-700',
  'from-amber-500 to-amber-700',
  'from-blue-500 to-blue-700'
];

function DoctorsPage() {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All');

  const doctorsQuery = useQuery({
    queryKey: ['public-doctors'],
    queryFn: async () => {
      const { data } = await api.get('/users/doctors');
      return data?.data ?? [];
    },
    retry: 1
  });

  const source = doctorsQuery.data?.length ? doctorsQuery.data : fallbackDoctors;
  const departments = ['All', ...new Set(source.map((d) => d.department))];

  const doctors = useMemo(() => {
    const needle = query.toLowerCase();
    return source.filter((doctor) => {
      const matchesDept = department === 'All' || doctor.department === department;
      const text = `${doctor.userId?.name ?? ''} ${doctor.specialization ?? ''}`.toLowerCase();
      return matchesDept && text.includes(needle);
    });
  }, [source, query, department]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Doctors"
        title="Find your specialist"
        description="Browse doctor profiles by specialization, department, and experience."
      />

      {/* Search & filter */}
      <section className="card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or specialty…"
              className="input pl-10"
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="input"
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Doctor cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor, i) => {
          const name = doctor.userId?.name ?? 'Doctor';
          const gradient = avatarColors[i % avatarColors.length];
          return (
            <article
              key={doctor._id}
              className="card group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-lg font-bold text-white shadow-soft`}
                >
                  {getInitials(name)}
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-base font-bold text-slate-900 dark:text-white truncate">{name}</p>
                  <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    {doctor.specialization}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Department</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">{doctor.department}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Experience</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">{doctor.experience ?? 0} yrs</p>
                </div>
              </div>

              {/* Fee + contact */}
              <div className="mt-3 flex items-center justify-between rounded-xl border border-primary-100/80 bg-primary-50/50 px-4 py-2.5 dark:border-primary-800/30 dark:bg-primary-900/15">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Consultation fee</p>
                  <p className="font-heading text-lg font-bold text-primary-700 dark:text-primary-300">
                    ${doctor.consultationFee ?? 0}
                  </p>
                </div>
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  {doctor.userId?.phone || 'After booking'}
                </p>
              </div>
            </article>
          );
        })}

        {doctors.length === 0 && (
          <div className="card col-span-full flex flex-col items-center justify-center gap-3 py-14 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-400">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">No doctors found</p>
            <p className="text-sm text-slate-500">Try a different search or department filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default DoctorsPage;
