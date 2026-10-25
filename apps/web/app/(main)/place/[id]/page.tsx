'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  NavigationArrow,
  SealCheck,
  ToiletPaper,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react';
import { FACILITY_KEYS } from '@modoltracker/core';
import { getPinColorByRating } from '@modoltracker/ui';
import { useModolStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { CategoryIcon, FacilityIcon } from '@/components/common/ModolIcons';
import { ModolButton } from '@/components/common/ModolButton';
import { SiModiMascot } from '@/components/common/SiModiMascot';

export default function PlaceDetailPage() {
  const params = useParams<{ id: string }>();
  const { places, reviews, openCheckinSheet } = useModolStore();

  const place = places.find((p) => p.id === params.id) ?? places[0];
  if (!place) {
    return (
      <div className="bg-paper border-2 border-line rounded-xl p-6 text-center">
        <SiModiMascot pose="panic" size={72} className="mx-auto mb-3" />
        <h1 className="font-display font-extrabold text-xl">
          Toilet tidak ditemukan
        </h1>
      </div>
    );
  }

  const placeReviews = reviews.filter((r) => r.place_id === place.id);
  const pinColor = getPinColorByRating(place.avg_rating);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <Link
        href="/map"
        className="inline-flex items-center gap-1.5 text-sm font-extrabold text-splash w-fit"
      >
        <ArrowLeft size={18} weight="bold" />
        Kembali ke Peta
      </Link>

      {/* Header Card */}
      <div className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-md flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-paper border-2 border-paper shrink-0"
            style={{ backgroundColor: pinColor.bg }}
          >
            <CategoryIcon category={place.category} size={28} weight="fill" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sand border border-line text-ink-soft">
                {t(`categories.${place.category}`)}
              </span>
              {place.is_verified_clean && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-fresh/15 border border-fresh text-fresh">
                  <SealCheck size={14} weight="fill" />
                  {t('review.verified_clean')}
                </span>
              )}
            </div>
            <h1 className="font-display font-extrabold text-2xl text-ink mt-1">
              {place.name}
            </h1>
            <p className="text-sm text-ink-soft">{place.address}</p>
          </div>
        </div>

        {/* Big Score & Bars */}
        <div className="bg-cream border-2 border-line rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="text-center sm:border-r-2 border-line pr-2">
            <div className="font-display font-extrabold text-4xl text-ink flex items-center justify-center gap-1.5">
              <ToiletPaper size={32} weight="fill" className="text-splash" />
              {place.avg_rating ? place.avg_rating.toFixed(1) : 'Baru'}
            </div>
            <p className="text-xs font-extrabold uppercase text-ink-soft mt-1">
              {place.review_count} Ulasan · {place.checkin_count} Check-in
            </p>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2.5">
            <div>
              <div className="flex justify-between text-xs font-extrabold mb-1">
                <span>🧼 Kebersihan</span>
                <span>{place.avg_cleanliness ?? 4.5} / 5.0</span>
              </div>
              <div className="h-2.5 bg-sand rounded-full overflow-hidden border border-line">
                <div
                  className="h-full bg-splash rounded-full"
                  style={{ width: `${((place.avg_cleanliness ?? 4.5) / 5) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-extrabold mb-1">
                <span>💧 Ketersediaan Air</span>
                <span>{place.avg_water ?? 4.7} / 5.0</span>
              </div>
              <div className="h-2.5 bg-sand rounded-full overflow-hidden border border-line">
                <div
                  className="h-full bg-fresh rounded-full"
                  style={{ width: `${((place.avg_water ?? 4.7) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            <ModolButton variant="secondary" fullWidth size="md">
              <NavigationArrow size={18} weight="fill" />
              {t('map.navigate')}
            </ModolButton>
          </a>
          <ModolButton
            variant="primary"
            fullWidth
            size="md"
            onClick={() => openCheckinSheet(place)}
          >
            💩 {t('map.checkin_here')}
          </ModolButton>
        </div>
      </div>

      {/* Grid Fasilitas */}
      <div className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-sm">
        <h2 className="font-display font-extrabold text-lg text-ink mb-3">
          Fasilitas Toilet
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {FACILITY_KEYS.map((fac) => {
            const hasIt = Boolean(place[fac.key as keyof typeof place]);
            return (
              <div
                key={fac.key}
                className={`p-2.5 rounded-lg border-2 flex items-center gap-2 text-xs font-extrabold ${
                  hasIt
                    ? 'bg-fresh/10 border-fresh text-ink'
                    : 'bg-sand/60 border-line text-ink-faint line-through'
                }`}
              >
                {hasIt ? (
                  <CheckCircle size={16} weight="fill" className="text-fresh shrink-0" />
                ) : (
                  <XCircle size={16} weight="bold" className="text-ink-faint shrink-0" />
                )}
                <FacilityIcon facilityKey={fac.key} size={15} />
                <span>{t(fac.labelKey)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daftar Ulasan */}
      <div className="flex flex-col gap-3">
        <h2 className="font-display font-extrabold text-xl text-ink">
          🧻 Ulasan Komunitas ({placeReviews.length})
        </h2>
        {placeReviews.length === 0 ? (
          <div className="bg-paper border-2 border-line rounded-xl p-6 text-center">
            <p className="text-sm font-bold text-ink-soft">
              Belum ada ulasan tertulis. Jadilah yang pertama mengulas toilet ini!
            </p>
          </div>
        ) : (
          placeReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-paper border-2 border-line rounded-xl p-4 [--lip-color:#D6C6AD] shadow-lip-sm flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-bubble text-paper font-display font-extrabold flex items-center justify-center text-sm">
                    P
                  </div>
                  <span className="font-extrabold text-sm text-ink">
                    @pejuang_kebelet
                  </span>
                  {rev.is_location_verified && (
                    <span className="px-2 py-0.5 rounded-full bg-fresh/15 border border-fresh text-fresh text-[11px] font-extrabold">
                      ✅ {t('review.verified_badge')}
                    </span>
                  )}
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-sunny border border-sunny-shade font-display font-extrabold text-xs text-ink">
                  🧻 {rev.overall_rating.toFixed(1)}
                </span>
              </div>
              {rev.body && (
                <p className="text-sm text-ink leading-relaxed">{rev.body}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
