import PageHeader from '../components/PageHeader';

function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="About Us"
        title="Compassionate care with digital precision"
        description="Swasthya Care combines clinical excellence, secure technology, and round-the-clock accessibility for modern healthcare delivery."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="section-title">Our History</p>
          <p className="mt-3 text-sm text-slate-700">
            Founded to make high-quality care accessible beyond clinic walls, we serve patients across virtual and in-person channels.
          </p>
        </div>
        <div className="card p-5">
          <p className="section-title">Mission</p>
          <p className="mt-3 text-sm text-slate-700">
            Deliver safe, timely, and human-centered care through integrated digital workflows and evidence-based clinical processes.
          </p>
        </div>
        <div className="card p-5">
          <p className="section-title">Vision</p>
          <p className="mt-3 text-sm text-slate-700">
            Build a proactive healthcare ecosystem where prevention, diagnosis, and treatment are seamless for patients and providers.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
