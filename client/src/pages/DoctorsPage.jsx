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
  const departments = ['All', ...new Set(source.map((item) => item.department))];

  const doctors = useMemo(() => {
    const needle = query.toLowerCase();

    return source.filter((doctor) => {
      const matchesDept = department === 'All' || doctor.department === department;
      const text = `${doctor.userId?.name ?? ''} ${doctor.specialization ?? ''}`.toLowerCase();
      const matchesSearch = text.includes(needle);
      return matchesDept && matchesSearch;
    });
  }, [source, query, department]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Doctors"
        title="Find your specialist"
        description="Browse doctor profiles by specialization, department, and experience."
      />

      <section className="card p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by doctor name or specialty"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            {departments.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <article key={doctor._id} className="card p-5">
            <p className="font-heading text-xl text-primary-900">{doctor.userId?.name ?? 'Doctor'}</p>
            <p className="mt-1 text-sm text-slate-600">{doctor.specialization}</p>
            <p className="mt-1 text-sm text-slate-600">Department: {doctor.department}</p>
            <p className="mt-1 text-sm text-slate-600">Experience: {doctor.experience ?? 0} years</p>
            <p className="mt-1 text-sm text-slate-600">Consultation fee: ${doctor.consultationFee ?? 0}</p>
            <p className="mt-2 text-xs text-primary-700">Contact: {doctor.userId?.phone || 'Available after booking'}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default DoctorsPage;
