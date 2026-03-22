import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'claude-eats',
  description: 'Weekly meal planner for the family',
};

const navLinks = [
  { href: '/',            label: 'This Week' },
  { href: '/shopping',    label: 'Shopping' },
  { href: '/prep',        label: 'Sunday Prep' },
  { href: '/preferences', label: 'Preferences' },
  { href: '/history',     label: 'History' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.className} h-full antialiased`}>
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <header className="border-b border-gray-800 bg-gray-900">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
            <span className="font-semibold tracking-tight text-orange-400 text-lg">claude-eats</span>
            <nav className="flex gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
