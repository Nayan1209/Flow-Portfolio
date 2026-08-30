import type { Metadata, Viewport } from 'next';
import './globals.css';
import './graph-layout.css';
import NodeMessageLayer from './NodeMessageLayer';

export const metadata: Metadata = {
  title: 'Nayan Asati — Flow',
  description: 'Nayan Asati is a creative engineer and technical architect building software, systems and interactive digital experiences.',
  applicationName: 'Flow — Nayan Asati',
  keywords: ['Nayan Asati', 'creative engineer', 'technical architect', 'software developer', 'portfolio', 'React', 'Next.js', 'Python'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<NodeMessageLayer /></body>
    </html>
  );
}
