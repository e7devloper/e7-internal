import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-montserrat', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'E7 Internal', template: '%s · E7 Internal' },
  description: 'Staff workspace for E7 Entertainments.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#1f3864' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
