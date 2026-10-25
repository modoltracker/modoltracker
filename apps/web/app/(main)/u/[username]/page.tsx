'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin } from '@phosphor-icons/react';
import { useModolStore } from '@/lib/store';
import { SiModiMascot } from '@/components/common/SiModiMascot';

export default function OtherUserProfilePage() {
  const params = useParams<{ username: string }>();
  const { friends, places } = useModolStore();

  const friend = friends.find((f) => f.username === params.username);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <Link
        href="/friends"
        className="inline-flex items-center gap-1.5 text-sm font-extrabold text-splash w-fit"
      >
        <ArrowLeft size={18} weight="bold" />
        Kembali ke Teman
      </Link>

      <div className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-md flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-bubble/20 border-2 border-bubble flex items-center justify-center">
          <SiModiMascot pose="celebrate" size={48} />
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-sunny border border-sunny-shade text-xs font-extrabold text-ink">
            {friend?.title ?? 'Petualang Toilet'}
          </span>
          <h1 className="font-display font-extrabold text-2xl text-ink mt-1">
            {friend?.display_name ?? `@${params.username}`}
          </h1>
          <p className="text-xs font-bold text-ink-soft">
            @{params.username} · {friend?.total_checkins ?? 12} Check-in
          </p>
        </div>
      </div>

      <div className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-sm flex flex-col gap-3">
        <h2 className="font-display font-extrabold text-lg text-ink">
          🗺️ Jejak Toilet Publik yang Dibagikan
        </h2>
        {places.slice(0, 3).map((p) => (
          <Link
            key={p.id}
            href={`/place/${p.id}`}
            className="p-3 rounded-lg bg-cream border border-line flex items-center justify-between hover:border-splash"
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} weight="fill" className="text-bubble" />
              <span className="font-display font-bold text-sm text-ink">
                {p.name}
              </span>
            </div>
            <span className="text-xs font-extrabold text-ink-soft">{p.city}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
