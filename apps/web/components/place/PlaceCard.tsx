'use client';

import React from 'react';
import Link from 'next/link';
import { ToiletPaper, NavigationArrow, SealCheck, Clock } from '@phosphor-icons/react';
import type { PlaceRow } from '@modoltracker/api-client';
import { getPinColorByRating } from '@modoltracker/ui';
import { CategoryIcon } from '../common/ModolIcons';
import { t } from '@/lib/i18n';

export function PlaceCard({
  place,
  distanceMeters,
  onSelect,
  onCheckinClick,
}: {
  place: PlaceRow;
  distanceMeters?: number;
  onSelect?: (place: PlaceRow) => void;
  onCheckinClick?: (place: PlaceRow) => void;
}) {
  const pinColor = getPinColorByRating(place.avg_rating);

  const formatDist = (m?: number) => {
    if (m === undefined) return null;
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
  };

  return (
    <div
      onClick={() => onSelect?.(place)}
      className="bg-paper border-2 border-line rounded-lg p-4 [--lip-color:#D6C6AD] shadow-lip-sm hover:border-line-strong transition-all cursor-pointer flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 border-paper shadow-lip-sm text-paper"
            style={{
              backgroundColor: pinColor.bg,
              ['--lip-color' as string]: pinColor.shade,
            }}
          >
            <CategoryIcon category={place.category} size={22} weight="fill" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/place/${place.id}`}
                onClick={(e) => e.stopPropagation()}
                className="font-display font-bold text-lg text-ink leading-tight hover:text-splash"
              >
                {place.name}
              </Link>
              {place.is_verified_clean && (
                <span
                  title={t('review.verified_clean')}
                  className="inline-flex items-center gap-1 bg-fresh/15 text-fresh border border-fresh px-2 py-0.5 rounded-full text-xs font-extrabold"
                >
                  <SealCheck size={14} weight="fill" />
                  Kinclong
                </span>
              )}
            </div>
            <p className="text-sm text-ink-soft mt-0.5">
              {t(`categories.${place.category}`)} · {place.city ?? 'Jakarta'}
              {distanceMeters !== undefined && ` · ${formatDist(distanceMeters)}`}
            </p>
          </div>
        </div>

        {/* Rating Badge */}
        <div
          className="px-2.5 py-1 rounded-md border-2 flex items-center gap-1 font-display font-extrabold text-sm shrink-0"
          style={{
            backgroundColor: pinColor.bg,
            borderColor: pinColor.shade,
            color: place.avg_rating && place.avg_rating >= 3 && place.avg_rating < 4 ? '#3C2A1E' : '#FFFFFF',
          }}
        >
          <ToiletPaper size={16} weight="fill" />
          <span>{place.avg_rating ? place.avg_rating.toFixed(1) : 'Baru'}</span>
        </div>
      </div>

      {/* Chips Fasilitas */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-line">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              place.fee_type === 'free'
                ? 'bg-fresh/10 border-fresh text-fresh'
                : 'bg-sand border-line-strong text-ink-soft'
            }`}
          >
            {place.fee_type === 'free'
              ? t('fees.free')
              : place.fee_amount
              ? `Rp${place.fee_amount.toLocaleString('id-ID')}`
              : t(`fees.${place.fee_type}`)}
          </span>
          {place.is_24h && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-splash/10 border border-splash text-splash">
              <Clock size={12} weight="bold" />
              24 Jam
            </span>
          )}
          {place.has_jet_washer && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sand border border-line text-ink">
              💧 Jet Washer
            </span>
          )}
          {place.has_sitting && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sand border border-line text-ink">
              🚽 Duduk
            </span>
          )}
          {place.has_squat && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sand border border-line text-ink">
              Jongkok
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-paper border-2 border-line-strong text-xs font-extrabold text-splash hover:bg-sand"
          >
            <NavigationArrow size={14} weight="fill" />
            {t('map.navigate')}
          </a>
          {onCheckinClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCheckinClick(place);
              }}
              className="px-3 py-1.5 rounded-md bg-sunny border-2 border-sunny-shade text-xs font-extrabold text-ink [--lip-color:#E0A500] shadow-lip-sm active:translate-y-0.5 active:shadow-none"
            >
              💩 Modol!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
