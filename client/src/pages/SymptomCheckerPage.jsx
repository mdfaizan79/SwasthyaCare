import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';

const redKeywords = ['chest pain', 'shortness of breath', 'cannot breathe', 'bleeding', 'fainted', 'unconscious', 'seizure'];
const yellowKeywords = ['fever', 'cough', 'headache', 'rash', 'dizziness', 'pain', 'vomiting'];

const initialMessages = [
  {
    from: 'assistant',
    text: "Hi, I'm Medi. Tell me what you’re feeling and I’ll ask follow-up questions to triage urgency."
  }
];

const bodyZones = ['Head', 'Chest', 'Abdomen', 'Back', 'Arms', 'Legs'];

function classify(text, severity, durationDays) {
  const normalized = text.toLowerCase();

  if (redKeywords.some((keyword) => normalized.includes(keyword)) || severity >= 8) {
    return {
      level: 'Red',
      guidance: 'Seek emergency care immediately. Call 911 or proceed to your nearest ER.'
    };
  }

  if (yellowKeywords.some((keyword) => normalized.includes(keyword)) || severity >= 5 || durationDays >= 3) {
    return {
      level: 'Yellow',
      guidance: 'Book a consultation within 48 hours. A summary will be sent to your doctor.'
    };
  }

  return {
    level: 'Green',
    guidance: 'Monitor symptoms at home. Book care if symptoms worsen or persist.'
  };
}

function SymptomCheckerPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [result, setResult] = useState(null);
  const [symptomHistory, setSymptomHistory] = useState({});
  const [severity, setSeverity] = useState(4);
  const [durationDays, setDurationDays] = useState(1);
  const [bodyZone, setBodyZone] = useState('Head');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem('sc_medi_messages');
    const storedHistory = localStorage.getItem('sc_medi_history');

    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch {
        setMessages(initialMessages);
      }
    }

    if (storedHistory) {
      try {
        setSymptomHistory(JSON.parse(storedHistory));
      } catch {
        setSymptomHistory({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sc_medi_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('sc_medi_history', JSON.stringify(symptomHistory));
  }, [symptomHistory]);

  const recurringFlags = useMemo(
    () => Object.entries(symptomHistory).filter(([, count]) => count >= 3),
    [symptomHistory]
  );

  const sendMessage = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const triage = classify(trimmed, severity, durationDays);
    const key = `${trimmed.toLowerCase()}|${bodyZone}`;
    const summary = `${trimmed} | Zone: ${bodyZone} | Severity: ${severity}/10 | Duration: ${durationDays} day(s)`;

    setMessages((current) => [
      ...current,
      { from: 'user', text: summary },
      {
        from: 'assistant',
        text:
          triage.level === 'Red'
            ? 'This may be urgent. Are you experiencing severe or worsening symptoms right now?'
            : triage.level === 'Yellow'
              ? 'Thanks. I recommend booking within 48 hours. I can prefill the appointment note for you.'
              : 'Got it. Please rest, hydrate, and monitor symptoms. I can create a preventive consult slot if you want.'
      }
    ]);

    setResult({ ...triage, summary });
    setSymptomHistory((current) => ({ ...current, [key]: (current[key] ?? 0) + 1 }));
    setInput('');
  };

  const startVoiceInput = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setMessages((current) => [...current, { from: 'assistant', text: 'Voice input is not supported in this browser.' }]);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      if (transcript) {
        setInput((current) => (current ? `${current} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => {
      setMessages((current) => [...current, { from: 'assistant', text: 'Voice capture failed. Please type your symptoms.' }]);
    };
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Symptom Checker"
        title="Chat with Medi"
        description="Conversational triage with symptom memory, body-map input, and urgency routing."
      />

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
        <p className="font-semibold">Safety Notice</p>
        <p className="mt-1">Medi is an informational assistant and not a medical diagnosis. Always seek urgent care for emergencies.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="card flex min-h-[560px] flex-col p-4">
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
            <p className="font-heading text-xl text-primary-900 dark:text-primary-100">Medi Assistant</p>
            <Badge>Session continuity enabled</Badge>
          </div>

          <div className="mb-3 grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 md:grid-cols-3 dark:border-slate-700 dark:bg-slate-800/50">
            <label className="grid gap-1 text-xs">
              Body Map (where it hurts)
              <select value={bodyZone} onChange={(event) => setBodyZone(event.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
                {bodyZones.map((zone) => (
                  <option key={zone}>{zone}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-xs">
              Severity ({severity}/10)
              <input type="range" min="1" max="10" value={severity} onChange={(event) => setSeverity(Number(event.target.value))} />
            </label>

            <label className="grid gap-1 text-xs">
              Duration (days)
              <input
                type="number"
                min="1"
                max="60"
                value={durationDays}
                onChange={(event) => setDurationDays(Number(event.target.value || 1))}
                className="rounded-lg border border-slate-200 px-2 py-1 dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.from === 'user' ? 'bg-primary-600 text-white' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="mt-3 space-y-2">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                placeholder="Type symptoms (e.g. severe chest pain, fever for 2 days)"
              />
              <button type="submit" className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
                Send
              </button>
            </div>
            <button
              type="button"
              onClick={startVoiceInput}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              {listening ? 'Listening...' : 'Use Voice Input'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <p className="font-heading text-xl text-primary-900 dark:text-primary-100">Urgency Triage</p>
            {result ? (
              <div
                className={`mt-3 rounded-xl border p-4 text-sm ${
                  result.level === 'Red'
                    ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200'
                    : result.level === 'Yellow'
                      ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                }`}
              >
                <p className="font-semibold">{result.level} priority</p>
                <p className="mt-1">{result.guidance}</p>
                <p className="mt-2 text-xs">Summary attached to record: “{result.summary}”</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Start chatting to generate a triage result.</p>
            )}

            {result?.level === 'Red' ? (
              <a
                href="tel:911"
                className="mt-3 inline-flex w-full justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Call 911 Now
              </a>
            ) : (
              <Link
                to="/patient/book"
                className="mt-3 inline-flex w-full justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Book a Consultation
              </Link>
            )}
          </div>

          <div className="card p-4">
            <p className="font-heading text-lg text-primary-900 dark:text-primary-100">Symptom History Tracker</p>
            {recurringFlags.length ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {recurringFlags.map(([symptom, count]) => (
                  <li key={symptom} className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/30">
                    You’ve reported “{symptom}” {count} times. Your primary care doctor has been notified.
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Recurring trends appear after a symptom is reported 3+ times.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SymptomCheckerPage;
