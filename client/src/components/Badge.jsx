function Badge({ children, tone = 'default' }) {
  const styles = {
    default:
      'border-primary-200/80 bg-primary-50 text-primary-700 dark:border-primary-700/40 dark:bg-primary-900/25 dark:text-primary-300',
    success:
      'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-900/25 dark:text-emerald-300',
    warning:
      'border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/25 dark:text-amber-300',
    danger:
      'border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-700/40 dark:bg-rose-900/25 dark:text-rose-300'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
