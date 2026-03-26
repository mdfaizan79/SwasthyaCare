import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

const threadSeed = [
  {
    id: 'th-1',
    counterpart: 'Dr. A. Patel',
    role: 'Cardiology',
    responseSla: 'Typically replies within 2 hours',
    unread: 1,
    messages: [
      { from: 'provider', text: 'Please continue your BP log this week.', at: '09:02 AM', read: true },
      { from: 'patient', text: 'Shared updated readings and morning symptoms.', at: '09:11 AM', read: true },
      { from: 'provider', text: 'Received. I will review and adjust plan if needed.', at: '09:14 AM', read: false }
    ]
  },
  {
    id: 'th-2',
    counterpart: 'Care Team (GP + Dermatology)',
    role: 'Group Coordination',
    responseSla: 'Within same business day',
    unread: 0,
    messages: [{ from: 'provider', text: 'Combined care plan shared to your record.', at: 'Yesterday', read: true }]
  }
];

function MessagesPage() {
  const { user } = useAuth();
  const [threadId, setThreadId] = useState(threadSeed[0].id);
  const [draft, setDraft] = useState('');
  const [threads, setThreads] = useState(threadSeed);

  const current = useMemo(() => threads.find((thread) => thread.id === threadId) ?? threads[0], [threads, threadId]);

  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id !== threadId
          ? thread
          : {
              ...thread,
              messages: [...thread.messages, { from: user?.role === 'doctor' ? 'provider' : 'patient', text, at: 'Now', read: false }]
            }
      )
    );

    setDraft('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Secure Messaging"
        title="Encrypted care communication"
        description="Threaded conversations, attachment support, read receipts, and care-team collaboration."
      />

      <section className="grid gap-4 lg:grid-cols-[0.42fr_0.58fr]">
        <aside className="card p-4">
          <p className="font-heading text-lg text-primary-900 dark:text-primary-100">Threads</p>
          <div className="mt-3 space-y-2">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => setThreadId(thread.id)}
                className={`w-full rounded-xl border p-3 text-left text-sm ${
                  thread.id === threadId
                    ? 'border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/30'
                    : 'border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-900/70'
                }`}
              >
                <p className="font-semibold text-primary-900 dark:text-primary-100">{thread.counterpart}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{thread.role}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{thread.responseSla}</p>
                {thread.unread ? <span className="mt-2 inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">{thread.unread} unread</span> : null}
              </button>
            ))}
          </div>
        </aside>

        <div className="card p-4">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-700">
            <p className="font-heading text-lg text-primary-900 dark:text-primary-100">{current.counterpart}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">End-to-end encrypted • Attach files/images • Auto-reply available</p>
          </div>

          <div className="mt-3 max-h-[350px] space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            {current.messages.map((message, index) => {
              const mine = (user?.role === 'doctor' && message.from === 'provider') || (user?.role !== 'doctor' && message.from === 'patient');
              return (
                <div key={`${message.at}-${index}`} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${mine ? 'bg-primary-600 text-white' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>
                    {message.text}
                    <p className={`mt-1 text-[10px] ${mine ? 'text-primary-100' : 'text-slate-400 dark:text-slate-400'}`}>
                      {message.at} {message.read ? '• Read' : '• Delivered'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={sendMessage} className="mt-3 space-y-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Type your secure message"
            />
            <div className="flex flex-wrap justify-between gap-2">
              <label className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                Attach File
                <input type="file" className="hidden" />
              </label>
              <button type="submit" className="rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white">
                Send Secure Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default MessagesPage;
