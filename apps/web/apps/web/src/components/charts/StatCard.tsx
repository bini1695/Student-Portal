import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student Portal',
  description: 'Student Portal & Enrollment System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}