import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addMinutes, format } from 'date-fns';
import PageHeader from '../components/PageHeader';
import api from '../lib/apiClient';

const allSpecialties = [
  'General Practice',
  'Dermatology',
  'Cardiology',
  'Mental Health',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Endocrinology',
  'ENT',
  'Pulmonology',
  'Gastroenterology',
  'Nephrology',
  'Urology',
  'Oncology',
  'Rheumatology',
  'Allergy & Immunology',
  'Ophthalmology',
  'Gynecology',
  'Obstetrics',
  'Family Medicine',
  'Internal Medicine',
  'Infectious Disease',
  'Sports Medicine',
  'Pain Management',
  'Psychiatry',
  'Nutrition',
  'Sleep Medicine',
  'Geriatrics',
  'Hematology',
  'Rehabilitation'
];

const fallbackDoctors = [
  {
    _id: 'local-1',
    specialization: 'Cardiology',
    department: 'Cardiology',
    subSpecialty: 'Preventive Cardiology',
    consultationFee: 110,
    languages: ['English', 'Hindi'],
    rating: 4.9,
    bio: 'Focuses on hypertension and preventive heart care.',
    nextAvailable: 'Today 4:00 PM',
    userId: { name: 'Dr. A. Patel', email: 'apatel@example.com' }
  },
  {
    _id: 'local-2',
    specialization: 'Dermatology',
    department: 'Dermatology',
    subSpecialty: 'Clinical Dermatology',
    consultationFee: 95,
    languages: ['English', 'Spanish'],
    rating: 4.8,
    bio: 'Treats rashes, acne, and skin inflammation.',
    nextAvailable: 'Tomorrow 9:30 AM',
    userId: { name: 'Dr. Maya Chen', email: 'mchen@example.com' }
  },
  {
    _id: 'local-3',
    specialization: 'General Practice',
    department: 'General Medicine',
    subSpecialty: 'Primary Care',
    consultationFee: 75,
    languages: ['English', 'Urdu'],
    rating: 4.7,
    bio: 'Primary consultations and continuity of care.',
    nextAvailable: 'Today 6:00 PM',
    userId: { name: 'Dr. Farhan Ali', email: 'fali@example.com' }
  }
];

const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.max(0, seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

function BookAppointmentPage() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [specialty, setSpecialty] = useState('All');
  const [subSpecialty, setSubSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState(slots[0]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [consultationType, setConsultationType] = useState('Video Call');
  const [insuranceVerified, setInsuranceVerified] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(0);

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('sc_favorite_doctors');
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sc_favorite_doctors', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!holdExpiresAt) {
      setHoldSecondsLeft(0);
      return;
    }

    const update = () => {
      const diff = Math.max(0, Math.floor((holdExpiresAt - Date.now()) / 1000));
      setHoldSecondsLeft(diff);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [holdExpiresAt]);

  const doctorsQuery = useQuery({
    queryKey: ['doctor-list'],
    queryFn: async () => {
      const { data } = await api.get('/users/doctors');
      return data?.data ?? [];
    },
    retry: 1
  });

  const doctorsSource = useMemo(() => {
    const apiDoctors = doctorsQuery.data?.length ? doctorsQuery.data : fallbackDoctors;
    return apiDoctors.map((doctor) => ({
      ...doctor,
      subSpecialty: doctor.subSpecialty ?? 'General',
      languages: doctor.languages ?? ['English'],
      rating: doctor.rating ?? 4.8,
      bio: doctor.bio ?? 'Experienced clinician focused on patient-centered care.',
      nextAvailable: doctor.nextAvailable ?? 'Today 5:00 PM'
    }));
  }, [doctorsQuery.data]);

  const specialties = ['All', ...new Set([...allSpecialties, ...doctorsSource.map((doctor) => doctor.specialization)])];

  const filteredDoctors = useMemo(() => {
    return doctorsSource.filter((doctor) => {
      const specialtyMatch = specialty === 'All' || doctor.specialization === specialty;
      const subSpecialtyMatch = !subSpecialty.trim() || doctor.subSpecialty.toLowerCase().includes(subSpecialty.toLowerCase());
      return specialtyMatch && subSpecialtyMatch;
    });
  }, [specialty, subSpecialty, doctorsSource]);

  const holdExpired = holdExpiresAt && holdSecondsLeft <= 0;

  const startSlotHold = () => {
    setHoldExpiresAt(addMinutes(new Date(), 5).getTime());
  };

  const onSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    startSlotHold();
  };

  const onSelectSlot = (slot) => {
    setSelectedSlot(slot);
    startSlotHold();
  };

  const toggleFavorite = (doctorId) => {
    setFavorites((current) => (current.includes(doctorId) ? current.filter((id) => id !== doctorId) : [...current, doctorId]));
  };

  const createAppointmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDoctor?._id) {
        throw new Error('Select a doctor before booking');
      }

      if (holdExpired) {
        throw new Error('Slot hold expired. Please reselect slot.');
      }

      const payload = {
        doctorId: selectedDoctor._id,
        appointmentDate: new Date(`${selectedDate}T00:00:00.000Z`).toISOString(),
        timeSlot: selectedSlot,
        department: selectedDoctor.department,
        symptoms,
        fees: selectedDoctor.consultationFee ?? 0,
        consultationType,
        remindersEnabled,
        waitlistEnabled
      };

      const { data } = await api.post('/appointments', payload);
      return data?.data;
    }
  });

  const addToGoogleCalendar = () => {
    if (!selectedDoctor) return '#';
    const start = new Date(`${selectedDate}T${selectedSlot}:00`);
    const end = addMinutes(start, 30);
    const formatGoogleDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Consultation with ${selectedDoctor.userId?.name}`,
      dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
      details: `Consultation type: ${consultationType}. Symptoms: ${symptoms || 'N/A'}`
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Appointment Scheduling"
        title="Find and book in under 90 seconds"
        description="Real-time scheduling with hold-timer protection, timezone-aware slots, and waitlist fallback."
      />

      <section className="card p-4 text-sm text-slate-600 dark:text-slate-300">
        Local timezone detected: <span className="font-semibold text-primary-700 dark:text-primary-200">{timezone}</span>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <div className="card p-5">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Specialty
                <select
                  value={specialty}
                  onChange={(event) => {
                    setSpecialty(event.target.value);
                    setSelectedDoctor(null);
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  {specialties.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Sub-specialty
                <input
                  value={subSpecialty}
                  onChange={(event) => setSubSpecialty(event.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                  placeholder="e.g. Preventive"
                />
              </label>

              <label className="grid gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Appointment Date
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
            </div>

            {doctorsQuery.isError ? (
              <p className="mt-3 text-xs text-amber-700 dark:text-amber-200">API unavailable. Showing fallback doctor directory.</p>
            ) : null}
          </div>

          <div className="grid gap-3">
            {filteredDoctors.map((doctor) => {
              const isFavorite = favorites.includes(doctor._id);
              const selected = selectedDoctor?._id === doctor._id;

              return (
                <div
                  key={doctor._id}
                  className={`card p-4 transition ${selected ? 'border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20' : ''}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <button type="button" onClick={() => onSelectDoctor(doctor)} className="flex-1 text-left">
                      <p className="font-heading text-lg text-primary-900 dark:text-primary-100">{doctor.userId?.name ?? 'Doctor'}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{doctor.specialization} • {doctor.subSpecialty}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{doctor.bio}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                        ⭐ {doctor.rating} • Languages: {doctor.languages.join(', ')} • Next: {doctor.nextAvailable}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(doctor._id)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${isFavorite ? 'border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200'}`}
                    >
                      {isFavorite ? '★ Favourite' : '☆ Add Favourite'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="font-heading text-xl text-primary-900 dark:text-primary-100">Booking Details</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {selectedDoctor ? `${selectedDoctor.userId?.name} • ${selectedDoctor.department}` : 'Select a doctor to continue'}
            </p>

            <div className="mt-3 rounded-xl border border-primary-100 bg-primary-50 p-3 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
              Slot reservation hold: {holdExpiresAt ? formatTimer(holdSecondsLeft) : 'Not started'}
              {holdExpired ? ' • Expired, please reselect a slot.' : ''}
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Time Slot</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSelectSlot(slot)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      selectedSlot === slot ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Consultation Type</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['Video Call', 'Async Message', 'In-Person'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setConsultationType(type)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      consultationType === type ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-4 grid gap-1 text-sm text-slate-700 dark:text-slate-200">
              Symptoms
              <textarea
                value={symptoms}
                onChange={(event) => setSymptoms(event.target.value)}
                className="min-h-20 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                placeholder="Short summary of symptoms"
              />
            </label>

            <label className="mt-4 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
              <input
                type="checkbox"
                checked={insuranceVerified}
                onChange={(event) => setInsuranceVerified(event.target.checked)}
                className="mt-1"
              />
              Insurance eligibility verified for this appointment.
            </label>

            <label className="mt-3 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={remindersEnabled} onChange={(event) => setRemindersEnabled(event.target.checked)} />
              Enable 24h and 1h reminders
            </label>

            <label className="mt-2 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={waitlistEnabled} onChange={(event) => setWaitlistEnabled(event.target.checked)} />
              Join waitlist if preferred slot is unavailable
            </label>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">
              Cancellation/reschedule policy: Free up to 12h before appointment. Late cancellation may incur a fee.
            </p>

            <button
              type="button"
              onClick={() => createAppointmentMutation.mutate()}
              disabled={!insuranceVerified || !selectedDoctor || createAppointmentMutation.isPending || holdExpired}
              className="mt-4 w-full rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {createAppointmentMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </button>

            {createAppointmentMutation.isError ? (
              <p className="mt-2 text-sm text-rose-600">
                {createAppointmentMutation.error?.response?.data?.message ?? createAppointmentMutation.error?.message ?? 'Booking failed'}
              </p>
            ) : null}
          </div>

          {createAppointmentMutation.isSuccess ? (
            <div className="card border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-700 dark:bg-emerald-900/30">
              <p className="font-heading text-xl text-emerald-700 dark:text-emerald-200">Appointment Confirmed</p>
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-200">
                {selectedDoctor?.userId?.name} • {selectedDate} • {selectedSlot} • {consultationType}
              </p>
              <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-200">Reminders: {remindersEnabled ? 'Enabled' : 'Disabled'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={addToGoogleCalendar()} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                  Add to Google Calendar
                </a>
                <a href={addToGoogleCalendar()} target="_blank" rel="noreferrer" className="rounded-full border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:text-emerald-200">
                  Add to Outlook/Apple
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default BookAppointmentPage;
