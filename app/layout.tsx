import type { Metadata } from 'next';
import './globals.css';
import './polish.css';
import FlowDirectionFix from './flow-direction-fix';

export const metadata: Metadata = {
  title: 'Flow — Nayan Asati',
  description: 'An interactive network portfolio for Nayan Asati.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <FlowDirectionFix />
        {children}
      </body>
    </html>
  );
}
