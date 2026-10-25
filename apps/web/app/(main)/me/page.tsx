'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, LockSimple, GlobeHemisphereEast, UsersThree } from '@phosphor-icons/react';
import { useModolStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { SiModiMascot } from '@/components/common/SiModiMascot';
import { ModolButton } from '@/components/common/ModolButton';

export default function MyProfilePage() {
  const {
    username,
    displayName,
    activeTitle,
    checkins,
    places,
    openCheckinSheet,
  } = useModolStore();

  const uniquePlacesCount = new Set(
    checkins.map((c) => c.place_id).filter(Boolean)
  ).size;
  const uniqueCitiesCount = new Set(
    checkins.map((c) => c.city).filter(Boolean)
  ).size;

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header Profile Card */}
      <div className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-md flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sunny/30 border-4 border-paper ring-2 ring-bubble flex items-center justify-center shrink-0">
            <SiModiMascot pose="happy" size={50} />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-sunny border border-sunny-shade text-xs font-display font-extrabold text-ink">
              👑 {activeTitle}
            </span>
            <h1 className="font-display font-extrabold text-2xl text-ink mt-1">
              {displayName}
            </h1>
            <p className="text-xs font-extrabold text-ink-soft">@{username}</p>
          </div>
        </div>

        <Link href="/settings">
          <ModolButton variant="secondary" size="sm">
            Privasi & Zona
          </ModolButton>
        </Link>
      </div>

      {/* Stat Tile 3 Kolom (Baloo 2 800 Display) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-paper border-2 border-line rounded-xl p-4 text-center [--lip-color:#D6C6AD] shadow-lip-sm">
          <p className="font-display font-extrabold text-3xl text-sunny-shade">
            {checkins.length}
          </p>
          <p className="text-[11px] font-extrabold tracking-wider uppercase text-ink-soft mt-1">
            {t('profile.stat_checkins')}
          </p>
        </div>

        <div className="bg-paper border-2 border-line rounded-xl p-4 text-center [--lip-color:#D6C6AD] shadow-lip-sm">
          <p className="font-display font-extrabold text-3xl text-splash">
            {uniquePlacesCount}
          </p>
          <p className="text-[11px] font-extrabold tracking-wider uppercase text-ink-soft mt-1">
            {t('profile.stat_places')}
          </p>
        </div>

        <div className="bg-paper border-2 border-line rounded-xl p-4 text-center [--lip-color:#D6C6AD] shadow-lip-sm">
          <p className="font-display font-extrabold text-3xl text-fresh">
            {uniqueCitiesCount}
          </p>
          <p className="text-[11px] font-extrabold tracking-wider uppercase text-ink-soft mt-1">
            {t('profile.stat_cities')}
          </p>
        </div>
      </div>

      {/* Riwayat Jejak Check-in */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-extrabold text-xl text-ink">
            🗺️ {t('profile.recent_history')}
          </h2>
          <button
            type="button"
            onClick={() => openCheckinSheet()}
            className="text-xs font-extrabold text-splash hover:underline"
          >
            + Catat Baru
          </button>
        </div>

        {checkins.length === 0 ? (
          <div className="bg-paper border-2 border-line rounded-xl p-6 text-center flex flex-col items-center gap-3">
            <SiModiMascot pose="sleep" size={72} />
            <p className="text-sm font-bold text-ink-soft">
              {t('profile.empty_history')}
            </p>
          </div>
        ) : (
          checkins.map((chk) => {
            const place = places.find((p) => p.id === chk.place_id);
            return (
              <div
                key={chk.id}
                className="bg-paper border-2 border-line rounded-xl p-4 [--lip-color:#D6C6AD] shadow-lip-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} weight="fill" className="text-choco shrink-0" />
                    <span className="font-display font-bold text-base text-ink">
                      {place ? place.name : '🏠 Lokasi Pribadi / Rumah'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sand border border-line text-[11px] font-extrabold text-ink-soft">
                    {chk.visibility === 'public' && <GlobeHemisphereEast size={13} />}
                    {chk.visibility === 'friends' && <UsersThree size={13} />}
                    {chk.visibility === 'private' && <LockSimple size={13} />}
                    {t(`visibility.${chk.visibility}`)}
                  </span>
                </div>
                {chk.note && (
                  <p className="text-sm text-ink-soft bg-cream px-3 py-2 rounded-md border border-line">
                    “{chk.note}”
                  </p>
                )}
                <p className="text-xs text-ink-faint font-bold">
                  {chk.city ?? 'Jakarta'} ·{' '}
                  {new Date(chk.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
