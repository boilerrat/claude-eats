import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import NavBar from '@/components/NavBar';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'claude·eats',
  description: 'Weekly family meal planner',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} h-full`}>
      <body className="bg-bg text-text min-h-screen font-sans antialiased">
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-12">
          {children}
        </main>
        <footer className="max-w-5xl mx-auto px-6 pb-28 sm:pb-8">
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://buymeacoffee.com/boilerhaus"
              target="_blank"
              rel="noopener noreferrer"
              title="Buy me a coffee"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFDD00]/10 border border-[#FFDD00]/20 text-[#FFDD00]/60 hover:bg-[#FFDD00]/15 hover:border-[#FFDD00]/35 hover:text-[#FFDD00]/90 transition-all duration-200 text-[11px] font-medium"
            >
              ☕ <span>Buy me a coffee</span>
            </a>
            <a
              href="https://etherscan.io/address/0xa2216234014166BCf0B64E6D7363bBAC9Da2b75f"
              target="_blank"
              rel="noopener noreferrer"
              title="Send ETH — 0xa2216234014166BCf0B64E6D7363bBAC9Da2b75f"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#627EEA]/10 border border-[#627EEA]/20 text-[#627EEA]/60 hover:bg-[#627EEA]/15 hover:border-[#627EEA]/35 hover:text-[#627EEA]/90 transition-all duration-200 text-[11px] font-medium"
            >
              <svg viewBox="0 0 12 20" fill="currentColor" className="w-2.5 h-4 shrink-0" aria-hidden>
                <path d="M6 0L0 10.2 6 13.8 12 10.2 6 0Z" opacity=".6"/>
                <path d="M0 10.2L6 13.8 12 10.2 6 0 0 10.2Z" opacity=".45"/>
                <path d="M6 15.2L0 11.6 6 20 12 11.6 6 15.2Z" opacity=".8"/>
                <path d="M0 11.6L6 20 6 15.2 0 11.6Z" opacity=".45"/>
              </svg>
              <span>Send ETH</span>
              <span className="font-mono text-[10px] opacity-70">0xa221…2b75f</span>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
