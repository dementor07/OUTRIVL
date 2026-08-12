import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OUTRIVL — Compete for attention',
  description:
    'A live attention market where products compete for the throne. Rank is layout: #1 gets the canvas, everyone else fights for it.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
