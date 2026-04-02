import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ConsentPreferences from './ConsentPreferences';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/departments', label: 'Departments' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/contact', label: 'Contact' },
  { to: '/help', label: 'Help' }
];

const roleDashboards = {
  patient: '/patient/dashboard',
  doctor: '/provider/dashboard',
  admin: '/admin/dashboard'
};

function SiteLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [...publicLinks];
  if (isAuthenticated && roleDashboards[user?.role]) {
    links.push({ to: roleDashboards[user.role], label: 'Dashboard' });
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className={`sticky top-0 z-20 transition-all duration-300 ${
          scrolled
            ? 'border-b border-slate-200/80 bg-white/96 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/96'
            : 'border-b border-transparent bg-white/80 backdrop-blur-lg dark:bg-slate-950/80'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-violet-600" />
              <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/10" />
              <span className="relative z-10 text-xs font-black tracking-tight text-white">SC</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-heading text-sm font-semibold leading-none text-slate-900 dark:text-white">
                Swasthya Care
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Consult · Manage · Heal</p>
            </div>
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="17" y2="17" />
              </svg>
            )}
          </button>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              {isDark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Helpline */}
            <a
              href="tel:+18005551234"
              className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              Helpline
            </a>

            {isAuthenticated ? (
              <>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 rounded-lg border border-primary-200/80 bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100 dark:border-primary-700/40 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-600 to-violet-600 text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                  </span>
                  {user?.name?.split(' ')[0] ?? 'Account'}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-px hover:shadow-glow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="animate-fadeSlideIn border-t border-slate-100 bg-white px-4 pb-4 pt-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <div className="grid gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/auth/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started Free
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/85 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/85">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600">
                <span className="text-xs font-black text-white">SC</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Swasthya Care</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">HIPAA-ready telehealth infrastructure</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <Link to="/settings" className="transition hover:text-primary-600 dark:hover:text-primary-400">
                Privacy & Settings
              </Link>
              <Link to="/help" className="transition hover:text-primary-600 dark:hover:text-primary-400">
                Support
              </Link>
              <Link to="/contact" className="transition hover:text-primary-600 dark:hover:text-primary-400">
                Contact
              </Link>
              <Link to="/status" className="transition hover:text-primary-600 dark:hover:text-primary-400">
                System Status
              </Link>
            </nav>
            <p className="text-xs text-slate-400 dark:text-slate-500">© {new Date().getFullYear()} Swasthya Care</p>
          </div>
        </div>
      </footer>

      <ConsentPreferences />
    </div>
  );
}

export default SiteLayout;
