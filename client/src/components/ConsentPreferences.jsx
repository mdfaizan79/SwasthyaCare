import { useEffect, useState } from 'react';

const defaultPrefs = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false
};

function ConsentPreferences() {
  const [isVisible, setIsVisible] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    const stored = localStorage.getItem('sc_cookie_prefs');
    if (!stored) {
      setIsVisible(true);
      return;
    }

    try {
      setPrefs(JSON.parse(stored));
    } catch {
      setIsVisible(true);
    }
  }, []);

  const savePreferences = (next) => {
    localStorage.setItem('sc_cookie_prefs', JSON.stringify(next));
    setPrefs(next);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(960px,94vw)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <p className="font-heading text-lg text-primary-900 dark:text-primary-100">Cookie Preferences</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Control essential, analytics, marketing, and personalization cookies.
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-4">
        {['essential', 'analytics', 'marketing', 'personalization'].map((key) => (
          <label key={key} className="flex items-center gap-2 rounded-xl border border-slate-100 p-2 text-xs capitalize dark:border-slate-700">
            <input
              type="checkbox"
              checked={Boolean(prefs[key])}
              disabled={key === 'essential'}
              onChange={(event) => setPrefs((current) => ({ ...current, [key]: event.target.checked }))}
            />
            {key}
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => savePreferences({ ...defaultPrefs, analytics: false, marketing: false, personalization: false })}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={() => savePreferences({ ...defaultPrefs, analytics: true, marketing: true, personalization: true })}
          className="rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-semibold text-primary-700 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-200"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => savePreferences(prefs)}
          className="rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default ConsentPreferences;
