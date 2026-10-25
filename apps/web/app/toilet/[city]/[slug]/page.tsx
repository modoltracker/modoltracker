'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_DEMO_PLACES } from '@modoltracker/api-client';
import { ModolButton } from '@/components/common/ModolButton';

export default function SeoPublicToiletPage() {
  const params = useParams<{ city: string; slug: string }>();
  const place =
    INITIAL_DEMO_PLACES.find((p) => p.slug === params.slug) ??
    INITIAL_DEMO_PLACES[0]!;

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col gap-4">
      <div className="bg-paper border-2 border-line rounded-xl p-6 [--lip-color:#D6C6AD] shadow-lip-md flex flex-col gap-3">
        <span className="text-xs font-extrabold uppercase text-splash">
          Direktori Toilet {decodeURIComponent(params.city)}
        </span>
        <h1 className="font-display font-extrabold text-3xl text-ink">
          {place.name}
        </h1>
        <p className="text-sm text-ink-soft">{place.address}</p>
        <p className="font-display font-extrabold text-xl text-fresh">
          Rating Kebersihan: 🧻 {place.avg_rating} / 5.0 ({place.review_count} ulasan)
        </p>
        <Link href={`/place/${place.id}`}>
          <ModolButton variant="primary" fullWidth>
            Lihat Detail & Peta Interaktif
          </ModolButton>
        </Link>
      </div>
    </div>
  );
}
