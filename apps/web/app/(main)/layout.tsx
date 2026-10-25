'use client';

import React from 'react';
import Link from 'next/link';
import { GearSix, PlusCircle, EnvelopeSimple, X } from '@phosphor-icons/react';
import { BottomNav } from '@/components/common/BottomNav';
import { CheckinSheetModal } from '@/components/checkin/CheckinSheetModal';
import { SiModiMascot } from '@/components/common/SiModiMascot';
import { useModolStore } from '@/lib/store';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    username,
    showEmailLinkReminder,
    dismissEmailLinkReminder,
  } = useModolStore();

  return (
    <div className="min-h-screen bg-cream pb-24 flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-cream/95 border-b-2 border-line px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/map" className="flex items-center gap-2 group">
            <SiModiMascot pose="happy" size={34} />
            <span className="font-display font-extrabold text-2xl tracking-tight text-choco">
              modoltracker
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/place/new"
              className="h-9 px-3 rounded-lg bg-paper border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-sm inline-flex items-center gap-1.5 text-xs font-extrabold text-splash active:translate-y-0.5 active:shadow-none"
            >
              <PlusCircle size={16} weight="fill" />
              <span>Tambah Toilet</span>
            </Link>
            <Link
              href="/settings"
              aria-label="Pengaturan"
              className="w-9 h-9 rounded-lg bg-paper border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-sm flex items-center justify-center text-ink-soft hover:text-ink"
            >
              <GearSix size={18} weight="bold" />
            </Link>
          </div>
        </div>
      </header>

      {/* Banner Pengingat Halus: Kaitkan Email / Google Supaya Akun Tidak Hilang */}
      {showEmailLinkReminder && (
        <div className="w-full max-w-2xl mx-auto px-4 pt-3">
          <div className="bg-sunny/25 border-2 border-sunny-shade rounded-xl p-3.5 [--lip-color:#E0A500] shadow-lip-sm flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sunny border border-sunny-shade text-ink flex items-center justify-center shrink-0 mt-0.5">
                <EnvelopeSimple size={20} weight="fill" />
              </div>
              <div>
                <p className="font-display font-extrabold text-sm text-ink">
                  Hai @{username}! Biar jejak modolmu nggak hilang kalau lupa password:
                </p>
                <p className="text-xs font-bold text-ink-soft mt-0.5">
                  Kamu bisa kaitkan akunmu ke Email atau Google kapan saja.{' '}
                  <Link
                    href="/settings"
                    className="text-splash font-extrabold underline hover:text-ink"
                  >
                    Kaitkan Sekarang →
                  </Link>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissEmailLinkReminder}
              aria-label="Ingatkan nanti"
              className="w-7 h-7 rounded-full bg-paper/80 border border-line flex items-center justify-center text-ink-soft hover:text-ink shrink-0"
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4">
        {children}
      </main>

      {/* Check-in & Quiz Modal */}
      <CheckinSheetModal />

      {/* Bottom Navigation + FAB */}
      <BottomNav />
    </div>
  );
}
