'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlass, UserPlus, Check } from '@phosphor-icons/react';
import { useModolStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { ModolButton } from '@/components/common/ModolButton';

export default function FriendsPage() {
  const { friends, acceptFriend } = useModolStore();
  const [activeTab, setActiveTab] = useState<'list' | 'requests' | 'search'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const acceptedFriends = friends.filter((f) => f.status === 'accepted');
  const pendingRequests = friends.filter((f) => f.status === 'pending');

  return (
    <div className="flex flex-col gap-5 pb-6">
      <h1 className="font-display font-extrabold text-2xl text-ink">
        👥 {t('friends.title')}
      </h1>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-sand p-1.5 rounded-xl border-2 border-line">
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`h-10 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'list'
              ? 'bg-paper text-splash border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-sm'
              : 'text-ink-soft'
          }`}
        >
          {t('friends.tab_list')} ({acceptedFriends.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`h-10 rounded-lg font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'requests'
              ? 'bg-paper text-splash border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-sm'
              : 'text-ink-soft'
          }`}
        >
          <span>{t('friends.tab_requests')}</span>
          {pendingRequests.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-cherry text-paper text-[10px]">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`h-10 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'search'
              ? 'bg-paper text-splash border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-sm'
              : 'text-ink-soft'
          }`}
        >
          {t('friends.tab_search')}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div className="flex flex-col gap-3">
          {acceptedFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-paper border-2 border-line rounded-xl p-4 [--lip-color:#D6C6AD] shadow-lip-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-bubble text-paper border-2 border-paper ring-2 ring-bubble font-display font-extrabold text-lg flex items-center justify-center">
                  {friend.display_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-display font-bold text-base text-ink">
                      {friend.display_name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-sunny/30 border border-sunny-shade text-[10px] font-extrabold text-choco">
                      {friend.title}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft">
                    Terakhir modol di {friend.last_city} · {friend.last_time}
                  </p>
                </div>
              </div>

              <Link href={`/u/${friend.username}`}>
                <ModolButton variant="secondary" size="sm">
                  {t('friends.view_trail')}
                </ModolButton>
              </Link>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="flex flex-col gap-3">
          {pendingRequests.length === 0 ? (
            <div className="bg-paper border-2 border-line rounded-xl p-6 text-center text-sm font-bold text-ink-soft">
              Belum ada permintaan pertemanan baru.
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-paper border-2 border-line rounded-xl p-4 [--lip-color:#D6C6AD] shadow-lip-sm flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-display font-bold text-base text-ink">
                    {req.display_name} (@{req.username})
                  </p>
                  <p className="text-xs text-ink-soft">
                    {req.total_checkins} check-in · Ingin berbagi peta jejak denganmu
                  </p>
                </div>
                <ModolButton
                  variant="success"
                  size="sm"
                  onClick={() => acceptFriend(req.id)}
                >
                  <Check size={16} weight="bold" />
                  {t('friends.accept_cta')}
                </ModolButton>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div className="bg-paper border-2 border-line rounded-xl p-5 flex flex-col gap-4">
          <div className="relative">
            <MagnifyingGlass
              size={18}
              weight="bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('friends.search_placeholder')}
              className="w-full h-12 pl-11 pr-4 rounded-md bg-sand border-2 border-line text-sm font-bold text-ink focus:outline-none focus:border-splash focus:bg-paper"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-cream border border-line">
            <div>
              <p className="font-display font-bold text-sm text-ink">
                @dewi_traveler
              </p>
              <p className="text-xs text-ink-soft">28 check-in di 7 kota</p>
            </div>
            <ModolButton variant="primary" size="sm">
              <UserPlus size={16} weight="bold" />
              Tambah
            </ModolButton>
          </div>
        </div>
      )}
    </div>
  );
}
