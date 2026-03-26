import PageHeader from '../components/PageHeader';

const departments = [
  {
    name: 'General Medicine',
    summary: 'Primary and preventive care for adults and families.',
    emergency: '24/7 on-call support'
  },
  {
    name: 'Cardiology',
    summary: 'Cardiac risk assessment, hypertension, and heart monitoring.',
    emergency: 'Priority triage enabled'
  },
  {
    name: 'Dermatology',
    summary: 'Skin consultations with imaging support and follow-up plans.',
    emergency: 'Same-day slots available'
  },
  {
    name: 'Mental Health',
    summary: 'Confidential therapy, psychiatry, and medication management.',
    emergency: 'Crisis escalation path included'
  },
  {
    name: 'Orthopedics',
    summary: 'Joint, spine, and musculoskeletal assessment and recovery.',
    emergency: 'Fast-track injury bookings'
  },
  {
    name: 'Pediatrics',
    summary: 'Child-focused care from newborn wellness to acute consults.',
    emergency: 'Night and weekend pediatric coverage'
  }
];

function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Departments"
        title="Specialized care teams"
        description="Explore departments, services, and emergency support options across the hospital network."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <article key={department.name} className="card p-5">
            <p className="font-heading text-xl text-primary-900">{department.name}</p>
            <p className="mt-2 text-sm text-slate-700">{department.summary}</p>
            <p className="mt-3 text-xs font-semibold text-primary-700">{department.emergency}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default DepartmentsPage;
