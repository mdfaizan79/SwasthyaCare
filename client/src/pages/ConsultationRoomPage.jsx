import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';

const patientRecord = {
  name: 'Ananya Sharma',
  age: 34,
  allergies: 'Penicillin',
  conditions: 'Type 2 Diabetes, Migraine',
  meds: 'Metformin, Sumatriptan'
};

const initialChat = [
  { from: 'doctor', text: 'Good morning, I reviewed your symptom summary before joining.' },
  { from: 'patient', text: 'Thank you doctor, headaches are getting more frequent this week.' }
];

function ConsultationRoomPage() {
  const { sessionId } = useParams();
  const [view, setView] = useState('patient');
  const [chat, setChat] = useState(initialChat);
  const [message, setMessage] = useState('');
  const [rxQuery, setRxQuery] = useState('');
  const [inWaitingRoom, setInWaitingRoom] = useState(true);
  const [waitMinutes, setWaitMinutes] = useState(3);
  const [recordingConsent, setRecordingConsent] = useState(null);
  const [callEnded, setCallEnded] = useState(false);
  const [feedback, setFeedback] = useState(5);
  const [screenSharing, setScreenSharing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [showReconnect, setShowReconnect] = useState(false);

  useEffect(() => {
    if (!inWaitingRoom || callEnded) return;

    const timer = setInterval(() => {
      setWaitMinutes((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setInWaitingRoom(false);
          return 0;
        }
        return current - 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [inWaitingRoom, callEnded]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() === 'm') setMuted((value) => !value);
      if (event.key.toLowerCase() === 'v') setCameraOff((value) => !value);
      if (event.key.toLowerCase() === 'r') setShowReconnect((value) => !value);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setChat((current) => [...current, { from: view, text: trimmed }]);
    setMessage('');
  };

  const endCall = () => {
    setCallEnded(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Virtual Consultation"
        title={`Session ${sessionId}`}
        description="Secure room with waiting room, HD video, chat, uploads, consent controls, and role-specific clinical tools."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView('patient')}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${view === 'patient' ? 'bg-white text-primary-900' : 'bg-white/20 text-white'}`}
            >
              Patient View
            </button>
            <button
              type="button"
              onClick={() => setView('doctor')}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${view === 'doctor' ? 'bg-white text-primary-900' : 'bg-white/20 text-white'}`}
            >
              Doctor View
            </button>
          </div>
        }
      />

      {inWaitingRoom && !callEnded ? (
        <section className="card p-6 text-center">
          <p className="font-heading text-2xl text-primary-900 dark:text-primary-100">Virtual Waiting Room</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Estimated wait time: {waitMinutes} minute(s)</p>
          <button type="button" onClick={() => setInWaitingRoom(false)} className="mt-4 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
            Join Now
          </button>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
              <p className="font-semibold text-slate-700 dark:text-slate-200">HD Video Feed</p>
              <div className="flex gap-2">
                <Badge success>Connection: {showReconnect ? 'Fair' : 'Good'}</Badge>
                <Badge>{screenSharing ? 'Screen Sharing On' : 'Screen Sharing Off'}</Badge>
              </div>
            </div>
            <div className="grid gap-3 bg-slate-100 p-4 dark:bg-slate-800 md:grid-cols-2">
              <div className="grid h-60 place-items-center rounded-2xl border border-white bg-gradient-to-br from-slate-700 to-slate-500 text-sm font-semibold text-white">
                {cameraOff ? 'Patient Camera Off' : 'Patient Camera'}
              </div>
              <div className="grid h-60 place-items-center rounded-2xl border border-white bg-gradient-to-br from-primary-800 to-primary-600 text-sm font-semibold text-white">
                Doctor Camera
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3 text-xs dark:border-slate-700">
              <button type="button" onClick={() => setMuted((value) => !value)} className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                {muted ? 'Unmute (M)' : 'Mute (M)'}
              </button>
              <button type="button" onClick={() => setCameraOff((value) => !value)} className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                {cameraOff ? 'Camera On (V)' : 'Camera Off (V)'}
              </button>
              <button type="button" onClick={() => setScreenSharing((value) => !value)} className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                {screenSharing ? 'Stop Share' : 'Share Screen'}
              </button>
              <button type="button" onClick={() => setShowReconnect((value) => !value)} className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                Simulate Reconnect (R)
              </button>
            </div>
          </div>

          {showReconnect ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              Connection dropped. Session auto-saved. Attempting reconnect...
              <button type="button" onClick={() => setShowReconnect(false)} className="ml-2 rounded-full border border-amber-300 px-2 py-0.5 text-xs">
                Reconnect Now
              </button>
            </div>
          ) : null}

          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-heading text-lg text-primary-900 dark:text-primary-100">In-call Chat</p>
              {!callEnded ? (
                <button type="button" onClick={endCall} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-200">
                  End Call
                </button>
              ) : null}
            </div>
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              {chat.map((item, index) => (
                <div key={`${item.from}-${index}`} className={`flex ${item.from === view ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      item.from === view ? 'bg-primary-600 text-white' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="mt-3 flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                placeholder="Type a message"
              />
              <button type="submit" className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
                Send
              </button>
            </form>
          </div>

          <div className="card p-4">
            <p className="font-heading text-lg text-primary-900 dark:text-primary-100">File Uploads</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Share test results, insurance docs, or images during the call.</p>
            <input type="file" className="mt-3 w-full rounded-xl border border-dashed border-slate-300 px-3 py-4 text-sm dark:border-slate-700 dark:bg-slate-900" />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">Supported: PDF, JPG, PNG, DICOM metadata package.</p>
          </div>

          {recordingConsent === null && !callEnded ? (
            <div className="rounded-xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-900 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-100">
              In-call recording consent required.
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={() => setRecordingConsent(true)} className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                  I Consent
                </button>
                <button type="button" onClick={() => setRecordingConsent(false)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold dark:border-slate-700">
                  Decline
                </button>
              </div>
            </div>
          ) : null}

          {callEnded ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
              <p className="font-semibold">Call Ended</p>
              <p className="mt-1">End-of-call summary sent to patient dashboard.</p>
              <label className="mt-3 grid gap-1 text-xs">
                Post-call feedback ({feedback}★)
                <input type="range" min="1" max="5" value={feedback} onChange={(event) => setFeedback(Number(event.target.value))} />
              </label>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          {view === 'patient' ? (
            <div className="card p-4">
              <p className="font-heading text-lg text-primary-900 dark:text-primary-100">Patient Call Tools</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Connection quality indicator with auto-adjust.</li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Real-time chat and notes for after-visit summary.</li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">Post-call feedback prompt appears on call end.</li>
              </ul>
            </div>
          ) : (
            <>
              <div className="card p-4">
                <p className="font-heading text-lg text-primary-900 dark:text-primary-100">Patient Health Record</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  {patientRecord.name} • {patientRecord.age} years
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">Allergies: {patientRecord.allergies}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">Conditions: {patientRecord.conditions}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">Current meds: {patientRecord.meds}</p>
              </div>

              <div className="card p-4">
                <p className="font-heading text-lg text-primary-900 dark:text-primary-100">Medical Image Viewer</p>
                <div className="mt-3 grid gap-2 text-sm">
                  <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">MRI_Brain_2026_01.dcm</div>
                  <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">XRay_Cervical_2025_11.dcm</div>
                </div>
              </div>

              <div className="card p-4">
                <p className="font-heading text-lg text-primary-900 dark:text-primary-100">e-Prescribing</p>
                <input
                  value={rxQuery}
                  onChange={(event) => setRxQuery(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  placeholder="Search medication"
                />
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200">
                  Interaction alert: New NSAID order may conflict with current anticoagulant.
                </div>
                <button type="button" className="mt-3 w-full rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
                  Send to Pharmacy
                </button>
              </div>

              <div className="card p-4">
                <p className="font-heading text-lg text-primary-900 dark:text-primary-100">AI Clinical Notes</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  Live transcription active. Draft SOAP note has been generated and saved to review queue.
                </p>
                <button type="button" className="mt-3 w-full rounded-full border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-700 dark:border-primary-700 dark:text-primary-200">
                  Flag for Follow-up
                </button>
              </div>
            </>
          )}
        </aside>
      </section>
    </div>
  );
}

export default ConsultationRoomPage;
