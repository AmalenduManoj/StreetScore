import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Live Scores', href: '/' },
  { label: 'Teams', href: '#' },
  { label: 'Schedule', href: '#' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navLinks = isAuthenticated ? [...links, { label: 'Profile', href: '/profile' }] : links;

  return (
    <header className="sticky top-4 z-20 mx-4 md:mx-auto md:max-w-6xl">
      <div className="relative z-50 rounded-full border border-[#454242] bg-white backdrop-blur-md">
        <nav
          className="mx-auto flex min-h-[68px] w-full items-center justify-between gap-3 px-4 sm:px-6"
          aria-label="Main navigation"
        >
          <Link
            className="text-xl font-bold tracking-tight text-[#00a79d]"
            to="/"
            aria-label="StreetScore home"
          >
            Street<span className="text-black">Score</span>
          </Link>

          <button
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-400/60 bg-white text-slate-900 transition-all duration-300 active:scale-95 md:hidden"
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            <span className="sr-only">Toggle navigation</span>
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-slate-900 transition-all duration-300 ${
                isOpen ? 'translate-y-0 rotate-45' : '-translate-y-[6px] rotate-0'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-slate-900 transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-slate-900 transition-all duration-300 ${
                isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[6px] rotate-0'
              }`}
            />
          </button>

          <ul className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  className="text-md relative cursor-pointer font-medium text-[#454242] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-green-500 after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
                  to={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-[#00a79d] flex items-center justify-center text-white text-sm font-bold">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
                  {user?.email || 'User'}
                </span>
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-red-300/70 bg-red-50 hover:bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition-colors duration-300"
                type="button"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border border-cyan-300/70 bg-white px-4 py-2 text-sm font-semibold text-[#454242] shadow-[6px_6px_0px_0px_black] transition-shadow duration-300 hover:shadow-[4px_4px_0px_0px_black]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full border border-cyan-300/70 bg-[#00a79d] px-4 py-2 text-sm font-semibold text-[#454242] shadow-[6px_6px_0px_0px_black] transition-shadow duration-300 hover:shadow-[4px_4px_0px_0px_black]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 flex h-[100dvh] flex-col overflow-hidden bg-[#f5f2ed] md:hidden
    transition-transform duration-[450ms] ease-[cubic-bezier(0.77,0,0.18,1)]
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ paddingTop: '104px', paddingBottom: '16px' }}
      >
        <ul className="flex min-h-0 flex-1 flex-col">
          {navLinks.map((link, index) => (
            <li
              key={link.label}
              className={`group relative flex flex-1 flex-col justify-center px-5
          transition-all duration-[450ms]
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
              style={{ transitionDelay: isOpen ? `${70 + index * 60}ms` : '0ms' }}
            >
              <Link
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="font-['Syne'] text-[30px] font-bold leading-none tracking-tight text-[#111]
            flex items-center gap-2.5 w-fit
            transition-all duration-200 hover:text-[#00a79d] hover:gap-4"
              >
                <span className="font-['DM_Sans'] text-[11px] font-medium text-[#aaa] self-start mt-1.5">
                  0{index + 1}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div
          className={`flex flex-col gap-4 px-5 pb-5 transition-all duration-[450ms] ${
            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}
          style={{ transitionDelay: isOpen ? `${70 + links.length * 60}ms` : '0ms' }}
        >
          {isAuthenticated ? (
            <div className="space-y-3">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 transition-colors hover:bg-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#00a79d] flex items-center justify-center text-white font-bold">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.email || 'User'}</p>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full rounded-full border border-red-300/70 bg-red-50 hover:bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center rounded-full border border-cyan-300/70 bg-white px-4 py-2 text-sm font-semibold text-[#454242] shadow-[6px_6px_0px_0px_black] transition-shadow duration-300 hover:shadow-[4px_4px_0px_0px_black]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center rounded-full border border-cyan-300/70 bg-[#00a79d] px-4 py-2 text-sm font-semibold text-[#454242] shadow-[6px_6px_0px_0px_black] transition-shadow duration-300 hover:shadow-[4px_4px_0px_0px_black]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
