'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  {
    href: '/',
    label: 'This Week',
    short: 'Week',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
  },
  {
    href: '/shopping',
    label: 'Shopping',
    short: 'Shop',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    href: '/prep',
    label: 'Sunday Prep',
    short: 'Prep',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    href: '/history',
    label: 'History',
    short: 'History',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 8v4l3 3"/>
        <path d="M3.05 11a9 9 0 1 0 .5-4M3 3v5h5"/>
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    short: 'Settings',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

export default function NavBar() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/setup') return null;

  return (
    <>
      {/* ── Desktop top nav ─────────────────────────────── */}
      <header className="hidden sm:block sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="group flex items-center gap-2">
            {/* Fork + knife SVG logo mark */}
            <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 text-amber" aria-hidden>
              <path d="M7 3v5a3 3 0 003 3v10a1 1 0 002 0V11a3 3 0 003-3V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M18 3v18a1 1 0 002 0V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M18 3v7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.25"/>
            </svg>
            <span className="font-display italic text-amber text-xl tracking-tight leading-none group-hover:text-amber-light transition-colors">
              claude·eats
            </span>
          </Link>

          <nav className="flex items-center gap-0.5">
            {navLinks.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'text-amber bg-amber/10'
                      : 'text-muted hover:text-text hover:bg-surface-2'
                  }`}
                >
                  <span className="hidden lg:block">{icon(active)}</span>
                  {label}
                </Link>
              );
            })}
            <a
              href="https://buymeacoffee.com/boilerhaus"
              target="_blank"
              rel="noopener noreferrer"
              title="Buy me a coffee"
              aria-label="Support this project"
              className="ml-1 p-2 rounded-lg text-subtle/50 hover:text-amber/70 hover:bg-amber/8 transition-all duration-150"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M18 8h1a4 4 0 010 8h-1"/>
                <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            </a>
          </nav>
        </div>
      </header>

      {/* ── Mobile compact top bar ───────────────────────── */}
      <header className="sm:hidden sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="px-4 flex items-center justify-center h-12 gap-2">
          <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5 text-amber" aria-hidden>
            <path d="M7 3v5a3 3 0 003 3v10a1 1 0 002 0V11a3 3 0 003-3V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M18 3v18a1 1 0 002 0V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M18 3v7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.25"/>
          </svg>
          <Link href="/" className="font-display italic text-amber text-lg tracking-tight leading-none">
            claude·eats
          </Link>
        </div>
      </header>

      {/* ── Mobile bottom tab bar ───────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pb-safe">
        <div className="grid grid-cols-5">
          {navLinks.map(({ href, short, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 pt-2 pb-2 text-[10px] font-medium tracking-wide transition-colors ${
                  active ? 'text-amber' : 'text-subtle hover:text-muted'
                }`}
              >
                {icon(active)}
                <span>{short}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
