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
      </body>
    </html>
  );
}
