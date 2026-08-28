import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flow — Nayan Asati',
  description: 'An interactive system map portfolio for Nayan Asati — creative engineer and technical architect.',
  metadataBase: new URL('https://flow-portfolio.vercel.app'),
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
