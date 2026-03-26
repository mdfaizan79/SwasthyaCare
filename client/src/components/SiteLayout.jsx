import { useState } from 'react';
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
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const links = [...publicLinks];
  if (isAuthenticated && roleDashboards[user?.role]) {
    links.push({ to: roleDashboards[user.role], label: 'Dashboard' });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white">
              SC
            </div>
            <div>
              <p className="font-heading text-sm text-primary-700">Swasthya Care</p>
              <p className="text-xs text-slate-500">Consult, Manage, Heal</p>
            </div>
          </Link>

          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden"
            onClick={() => setIsOpen((value) => !value)}
          >
            Menu
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm transition ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-200'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/settings"
                  className="rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-200"
                >
                  {user?.name?.split(' ')[0] ?? 'Account'} ({user?.role})
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Login
                </Link>
                <Link to="/auth/register" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
                  Register
                </Link>
              </>
            )}

            <a
              href="tel:+18005551234"
              className="ml-1 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700"
            >
              Helpline
            </a>
          </nav>
        </div>

        {isOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 md:hidden">
            <div className="grid gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-primary-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm dark:border-slate-700 dark:text-slate-200"
              >
                {isDark ? 'Switch to Light' : 'Switch to Dark'}
              </button>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/auth/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-primary-600 px-3 py-2 text-sm text-white"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/70 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 py-6 text-sm text-slate-600 dark:text-slate-300 md:flex-row md:items-center md:px-6">
          <p>© {new Date().getFullYear()} Swasthya Care. HIPAA-ready infrastructure.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/settings" className="hover:text-primary-700">
              Privacy & Settings
            </Link>
            <Link to="/help" className="hover:text-primary-700">
              Support
            </Link>
            <Link to="/contact" className="hover:text-primary-700">
              Contact
            </Link>
            <Link to="/status" className="hover:text-primary-700">
              System Status
            </Link>
          </div>
        </div>
      </footer>
      <ConsentPreferences />
    </div>
  );
}

export default SiteLayout;
