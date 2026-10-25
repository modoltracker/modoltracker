'use client';

import React from 'react';
import Link from 'next/link';
import { DEFAULT_BADGES } from '@modoltracker/core';
import { LockSimple, CheckCircle, Trophy } from '@phosphor-icons/react';
import { useModolStore } from '@/lib/store';
import { ModolButton } from '@/components/common/ModolButton';

export default function BadgesPage() {
  const { checkins, reviews } = useModolStore();
  const myCheckins = checkins.filter((c) => !c.user_id.startsWith('friend-'));

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="px-3 py-1 rounded-full bg-sunny/30 border border-sunny-shade text-xs font-extrabold uppercase text-choco">
            🏆 Koleksi Pencapaian & Gelar
          </span>
          <h1 className="font-display font-extrabold text-2xl text-ink mt-2">
            Badge Pejuang Modol ({myCheckins.length} Titik)
          </h1>
          <p className="text-sm text-ink-soft">
            Kumpulkan badge lucu dari setiap tempat yang pernah kamu taklukkan!
          </p>
        </div>

        <Link href="/leaderboard">
          <ModolButton variant="secondary" size="sm">
            <Trophy size={16} weight="fill" />
            Lihat Ranking Teman
          </ModolButton>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DEFAULT_BADGES.map((b, idx) => {
          const unlocked =
            (b.code === 'first_drop' && myCheckins.length >= 1) ||
            idx < 3 ||
            reviews.length >= 2;
          return (
            <div
              key={b.code}
              className={`p-4 rounded-xl border-2 flex flex-col gap-2 ${
                unlocked
                  ? 'bg-paper border-sunny-shade [--lip-color:#E0A500] shadow-lip-sm'
                  : 'bg-sand/70 border-line opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-cream border border-line">
                  Tier {b.tier}
                </span>
                {unlocked ? (
                  <CheckCircle size={18} weight="fill" className="text-fresh" />
                ) : (
                  <LockSimple size={16} weight="bold" className="text-ink-faint" />
                )}
              </div>
              <p className="font-display font-extrabold text-base text-ink">
                {b.name}
              </p>
              <p className="text-xs font-bold text-ink-soft">
                {unlocked ? '✅ Sudah Terbuka!' : '🔒 Tandai lebih banyak tempat'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
