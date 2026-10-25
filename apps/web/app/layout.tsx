import type { Metadata, Viewport } from 'next';
import { Baloo_2, Nunito } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { ModolStoreProvider } from '@/lib/store';

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-baloo',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Modoltracker — Temukan Toilet Terbaik, Catat Setiap Perjalananmu',
  description:
    'Jejak modolmu, panduan toilet semua orang. Direktori toilet SPBU, masjid, rest area, dan mall di Indonesia.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#FFC800',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-cream text-ink font-sans">
        <ModolStoreProvider>{children}</ModolStoreProvider>
      </body>
    </html>
  );
}
