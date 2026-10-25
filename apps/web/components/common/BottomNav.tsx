'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapTrifold, UsersThree, Medal, UserCircle } from '@phosphor-icons/react';
import { t } from '@/lib/i18n';
import { useModolStore } from '@/lib/store';
import { SiModiMascot } from './SiModiMascot';

export function BottomNav() {
  const pathname = usePathname();
  const { openCheckinSheet } = useModolStore();

  const items = [
    { href: '/map', label: t('nav.map'), icon: MapTrifold },
    { href: '/friends', label: t('nav.friends'), icon: UsersThree },
    { href: '/badges', label: t('nav.badges'), icon: Medal },
    { href: '/me', label: t('nav.profile'), icon: UserCircle },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-0 inset-x-0 z-40 bg-paper border-t-2 border-line h-16 px-2 flex items-center justify-around max-w-2xl mx-auto rounded-t-xl shadow-sheet"
    >
      {items.slice(0, 2).map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition-colors ${
              isActive ? 'text-splash font-extrabold' : 'text-ink-faint font-bold hover:text-ink-soft'
            }`}
          >
            <Icon size={26} weight={isActive ? 'fill' : 'bold'} />
            <span className="text-[11px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}

      {/* Center FAB 💩 "Modol di Sini" */}
      <div className="relative -top-5 flex flex-col items-center">
        <button
          type="button"
          onClick={() => openCheckinSheet()}
          aria-label={t('nav.checkin_fab')}
          className="w-[72px] h-[72px] rounded-full bg-sunny border-[3px] border-sunny-shade [--lip-color:#E0A500] shadow-lip-lg flex items-center justify-center active:translate-y-1.5 active:shadow-none transition-transform duration-75 group"
        >
          <SiModiMascot pose="happy" size={48} className="group-hover:scale-105 transition-transform" />
        </button>
        <span className="text-[11px] font-display font-extrabold text-choco mt-1">
          MODOL!
        </span>
      </div>

      {items.slice(2).map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition-colors ${
              isActive ? 'text-splash font-extrabold' : 'text-ink-faint font-bold hover:text-ink-soft'
            }`}
          >
            <Icon size={26} weight={isActive ? 'fill' : 'bold'} />
            <span className="text-[11px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
