'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Crown, Medal } from '@phosphor-icons/react';
import { useModolStore } from '@/lib/store';
import { ModolButton } from '@/components/common/ModolButton';

export default function LeaderboardPage() {
  const { checkins, friends, displayName, username, openCheckinSheet } = useModolStore();

  const myCount = checkins.filter((c) => !c.user_id.startsWith('friend-')).length;

  const rankings = [
    {
      id: 'friend-2',
      name: friends[1]?.display_name ?? 'Sari Wulandari',
      username: friends[1]?.username ?? 'sari_ojol',
      title: 'Ratu Toilet Gratis',
      count: 51,
      cities: 6,
      isMe: false,
    },
    {
      id: 'friend-1',
      name: friends[0]?.display_name ?? 'Rizky Pratama',
      username: friends[0]?.username ?? 'rizky_petualang',
      title: 'Penjelajah SPBU',
      count: 34,
      cities: 5,
      isMe: false,
    },
    {
      id: 'me',
      name: `${displayName} (Kamu)`,
      username,
      title: 'Raja SPBU',
      count: myCount,
      cities: 2,
      isMe: true,
    },
    {
      id: 'friend-3',
      name: friends[2]?.display_name ?? 'Budi Santoso',
      username: friends[2]?.username ?? 'budi_santoso',
      title: 'Sultan Toilet Mall',
      count: 19,
      cities: 3,
      isMe: false,
    },
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-md flex items-center justify-between gap-3">
        <div>
          <span className="px-3 py-1 rounded-full bg-sunny/30 border border-sunny-shade text-xs font-extrabold uppercase text-choco inline-flex items-center gap-1">
            <Trophy size={14} weight="fill" />
            Klasemen Teman Bulan Ini
          </span>
          <h1 className="font-display font-extrabold text-2xl text-ink mt-2">
            Siapa Paling Banyak Nancepin Jejak Modol? 💩
          </h1>
          <p className="text-xs text-ink-soft mt-0.5">
            Tancapkan pin setiap kali kamu modol di tempat baru buat nyalip temanmu!
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {rankings.map((r, index) => {
          const rank = index + 1;
          return (
            <div
              key={r.id}
              className={`rounded-xl border-2 p-4 flex items-center justify-between gap-3 ${
                r.isMe
                  ? 'bg-sunny/20 border-sunny-shade [--lip-color:#E0A500] shadow-lip-sm'
                  : 'bg-paper border-line [--lip-color:#D6C6AD] shadow-lip-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-full font-display font-extrabold text-lg flex items-center justify-center border-2 ${
                    rank === 1
                      ? 'bg-sunny text-ink border-sunny-shade'
                      : rank === 2
                      ? 'bg-sand text-ink border-line-strong'
                      : 'bg-cream text-ink-soft border-line'
                  }`}
                >
                  {rank === 1 ? <Crown size={20} weight="fill" /> : `#${rank}`}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-display font-extrabold text-base text-ink">
                      {r.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cream border border-line text-[10px] font-extrabold text-choco">
                      {r.title}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft">
                    @{r.username} · {r.cities} kota dijelajahi
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-display font-extrabold text-2xl text-choco">
                  {r.count}x
                </p>
                <p className="text-[10px] font-extrabold uppercase text-ink-soft">
                  Titik Modol
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <ModolButton variant="primary" fullWidth onClick={() => openCheckinSheet()}>
        🚩 TANCAP PIN SEKARANG BIAR NAIK RANKING!
      </ModolButton>
    </div>
  );
}
