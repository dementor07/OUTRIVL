import type { Metadata } from 'next';
import { AppRoot } from '@/components/AppRoot';

export const metadata: Metadata = {
  title: 'OUTRIVL — Market',
  description: 'The live attention market: board, floor and ladder for the Indie, Startup and Open economies.',
};

export default function AppPage() {
  return <AppRoot />;
}
