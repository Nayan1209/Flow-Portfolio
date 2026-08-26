import type { Metadata } from 'next';
import './globals.css';
import './polish.css';

export const metadata: Metadata = {
  title: 'Flow — Nayan Asati',
  description: 'An interactive network portfolio for Nayan Asati.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
