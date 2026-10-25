'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Crosshair,
  Trophy,
  FlagBanner,
  UsersThree,
  Sparkle,
  ToiletPaper,
  ArrowsOutSimple,
  ArrowsInSimple,
} from '@phosphor-icons/react';
import { REACTION_EMOJIS } from '@modoltracker/core';
import { useModolStore, type ReactionEmoji } from '@/lib/store';
import { ToiletLeafletMap } from '@/components/map/ToiletLeafletMap';
import { ModolButton } from '@/components/common/ModolButton';
import { SiModiMascot } from '@/components/common/SiModiMascot';

export default function MapPage() {
  const {
    places,
    checkins,
    friends,
    reactions,
    myReactions,
    toggleReaction,
    userLocation,
    gpsStatus,
    gpsAccuracyMeters,
    gpsRequestCount,
    refreshGpsLocation,
    setManualUserLocation,
    openCheckinSheet,
  } = useModolStore();

  const [mapMode, setMapMode] = useState<'all_trails' | 'my_trail' | 'toilet_info'>(
    'all_trails'
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isFullScreenMap, setIsFullScreenMap] = useState(false);

  const myCheckins = checkins.filter((c) => !c.user_id.startsWith('friend-'));
  const myUniqueSpots = new Set(myCheckins.map((c) => c.place_id ?? c.id)).size;
  const myUniqueCities = new Set(myCheckins.map((c) => c.city).filter(Boolean)).size;

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) ?? null;

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Papan Skor Jejak Modol (Dimulai dari 0 untuk akun baru!) */}
      <div className="bg-paper border-2 border-line rounded-xl p-4 [--lip-color:#D6C6AD] shadow-lip-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlagBanner size={20} weight="fill" className="text-choco" />
            <h1 className="font-display font-extrabold text-lg text-ink">
              Peta Jejak Modolmu & Teman
            </h1>
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sunny/30 border border-sunny-shade text-xs font-extrabold text-choco"
          >
            <Trophy size={14} weight="fill" />
            Klasemen Teman
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-cream border border-line rounded-lg p-2.5">
            <p className="font-display font-extrabold text-2xl text-sunny-shade">
              {myCheckins.length}x
            </p>
            <p className="text-[10px] font-extrabold uppercase text-ink-soft">
              Total Modol
            </p>
          </div>
          <div className="bg-cream border border-line rounded-lg p-2.5">
            <p className="font-display font-extrabold text-2xl text-splash">
              {myUniqueSpots}
            </p>
            <p className="text-[10px] font-extrabold uppercase text-ink-soft">
              Tempat Ditandai
            </p>
          </div>
          <div className="bg-cream border border-line rounded-lg p-2.5">
            <p className="font-display font-extrabold text-2xl text-fresh">
              {myUniqueCities}
            </p>
            <p className="text-[10px] font-extrabold uppercase text-ink-soft">
              Kota Takluk
            </p>
          </div>
        </div>
      </div>

      {/* Mode Switcher (Saat tidak full screen) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setMapMode('all_trails')}
          className={`h-9 px-3.5 rounded-full border-2 text-xs font-extrabold shrink-0 inline-flex items-center gap-1.5 transition-all ${
            mapMode === 'all_trails'
              ? 'bg-choco border-choco-shade text-paper [--lip-color:#5C3A22] shadow-lip-sm'
              : 'bg-paper border-line text-ink-soft'
          }`}
        >
          <UsersThree size={15} weight="fill" />
          💩 Jejakku & Teman ({checkins.length})
        </button>

        <button
          type="button"
          onClick={() => setMapMode('my_trail')}
          className={`h-9 px-3.5 rounded-full border-2 text-xs font-extrabold shrink-0 inline-flex items-center gap-1.5 transition-all ${
            mapMode === 'my_trail'
              ? 'bg-sunny border-sunny-shade text-ink [--lip-color:#E0A500] shadow-lip-sm'
              : 'bg-paper border-line text-ink-soft'
          }`}
        >
          🚩 Jejakku Saja ({myCheckins.length})
        </button>

        <button
          type="button"
          onClick={() => setMapMode('toilet_info')}
          className={`h-9 px-3.5 rounded-full border-2 text-xs font-extrabold shrink-0 inline-flex items-center gap-1.5 transition-all ${
            mapMode === 'toilet_info'
              ? 'bg-splash border-splash-shade text-paper [--lip-color:#1593CF] shadow-lip-sm'
              : 'bg-paper border-line text-ink-soft'
          }`}
        >
          <Sparkle size={15} weight="fill" />
          🧻 Skor Kenyamanan Toilet
        </button>
      </div>

      {/* Peta Jejak Interaktif (Mendukung mode Normal & Full Screen dengan menu tetap tampil) */}
      <div
        style={
          isFullScreenMap
            ? {
                position: 'fixed',
                top: '62px',
                left: 0,
                right: 0,
                bottom: '64px',
                height: 'calc(100vh - 126px)',
                width: '100vw',
                zIndex: 25,
              }
            : {
                position: 'relative',
                height: '360px',
                width: '100%',
              }
        }
        className="bg-sand"
      >
        <ToiletLeafletMap
          places={places}
          checkins={checkins}
          mapMode={mapMode}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={(p) => setSelectedPlaceId(p.id)}
          center={userLocation}
          gpsRequestCount={gpsRequestCount}
          onManualPickLocation={(lat, lng) => setManualUserLocation(lat, lng)}
          isFullScreen={isFullScreenMap}
        />

        {/* Legenda Pin Jejak */}
        <div className="absolute top-3 left-12 z-20 bg-paper/95 border-2 border-line rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold flex items-center gap-3 shadow-sm">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-splash inline-block border border-paper ring-1 ring-splash" />
            Posisimu
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-sunny inline-block border border-ink" />
            Jejakmu
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-bubble inline-block border border-ink" />
            Teman
          </span>
        </div>

        {/* Tombol Pilihan Full Screen / Kecilkan Peta */}
        <button
          type="button"
          onClick={() => setIsFullScreenMap((prev) => !prev)}
          aria-label={isFullScreenMap ? 'Kecilkan Peta' : 'Layar Penuh'}
          className="absolute top-3 right-3 z-20 h-9 px-3 rounded-lg bg-paper border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-sm inline-flex items-center gap-1.5 text-xs font-extrabold text-ink active:translate-y-0.5 active:shadow-none"
        >
          {isFullScreenMap ? (
            <>
              <ArrowsInSimple size={16} weight="bold" className="text-cherry" />
              <span>Kecilkan Peta</span>
            </>
          ) : (
            <>
              <ArrowsOutSimple size={16} weight="bold" className="text-splash" />
              <span>Full Screen</span>
            </>
          )}
        </button>

        {/* Filter Mode Melayang saat Full Screen Aktif */}
        {isFullScreenMap && (
          <div className="absolute top-14 left-3 right-3 z-20 flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto">
            <button
              type="button"
              onClick={() => setMapMode('all_trails')}
              className={`h-8 px-3 rounded-full border-2 text-[11px] font-extrabold shrink-0 inline-flex items-center gap-1 ${
                mapMode === 'all_trails'
                  ? 'bg-choco border-choco-shade text-paper [--lip-color:#5C3A22] shadow-lip-sm'
                  : 'bg-paper/95 border-line text-ink-soft'
              }`}
            >
              💩 Semua ({checkins.length})
            </button>
            <button
              type="button"
              onClick={() => setMapMode('my_trail')}
              className={`h-8 px-3 rounded-full border-2 text-[11px] font-extrabold shrink-0 inline-flex items-center gap-1 ${
                mapMode === 'my_trail'
                  ? 'bg-sunny border-sunny-shade text-ink [--lip-color:#E0A500] shadow-lip-sm'
                  : 'bg-paper/95 border-line text-ink-soft'
              }`}
            >
              🚩 Jejakku ({myCheckins.length})
            </button>
            <button
              type="button"
              onClick={() => setMapMode('toilet_info')}
              className={`h-8 px-3 rounded-full border-2 text-[11px] font-extrabold shrink-0 inline-flex items-center gap-1 ${
                mapMode === 'toilet_info'
                  ? 'bg-splash border-splash-shade text-paper [--lip-color:#1593CF] shadow-lip-sm'
                  : 'bg-paper/95 border-line text-ink-soft'
              }`}
            >
              🧻 Skor Toilet
            </button>
          </div>
        )}

        {/* Kartu Info Toilet Melayang saat Full Screen dan Pin Diklik */}
        {isFullScreenMap && selectedPlace && (
          <div className="absolute bottom-16 left-3 right-3 max-w-md mx-auto z-20 bg-paper border-2 border-line-strong rounded-xl p-3 [--lip-color:#D6C6AD] shadow-lip-sm flex items-center justify-between gap-3">
            <div>
              <p className="font-display font-bold text-sm text-ink">
                {selectedPlace.name}
              </p>
              <p className="text-xs text-ink-soft">
                🧻 {selectedPlace.avg_rating ? selectedPlace.avg_rating.toFixed(1) : 'Belum diulas'} ·{' '}
                {selectedPlace.checkin_count}x modol
              </p>
            </div>
            <Link href={`/place/${selectedPlace.id}`}>
              <ModolButton variant="secondary" size="sm">
                <ToiletPaper size={14} weight="fill" />
                Ulasan
              </ModolButton>
            </Link>
          </div>
        )}

        {/* Tombol Kunci GPS */}
        <button
          type="button"
          onClick={refreshGpsLocation}
          className={`absolute ${
            isFullScreenMap ? 'bottom-6' : 'bottom-3'
          } right-3 z-20 h-10 px-3.5 rounded-full bg-paper border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-sm inline-flex items-center gap-1.5 text-xs font-extrabold text-ink active:translate-y-0.5 active:shadow-none`}
        >
          <Crosshair
            size={16}
            weight="fill"
            className={
              gpsStatus === 'locked' || gpsStatus === 'manual'
                ? 'text-fresh'
                : 'text-sunny-shade'
            }
          />
          <span>
            {gpsStatus === 'manual'
              ? '📍 Titik Presisi Terkunci'
              : gpsStatus === 'locked'
              ? `GPS Sensor (±${gpsAccuracyMeters ?? 15}m)`
              : 'Deteksi Ulang GPS'}
          </span>
        </button>
      </div>

      {/* Kartu Info Singkat Toilet yang Diklik di Peta */}
      {selectedPlace && (
        <div className="bg-sand/70 border-2 border-line-strong rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-ink-soft">
              Info Kenyamanan Titik yang Dipilih:
            </span>
            <p className="font-display font-bold text-base text-ink">
              {selectedPlace.name}
            </p>
            <p className="text-xs text-ink-soft">
              Rating Toilet:{' '}
              <strong>
                🧻 {selectedPlace.avg_rating ? selectedPlace.avg_rating.toFixed(1) : 'Belum diulas'}
              </strong>{' '}
              · {selectedPlace.checkin_count}x ditandai modol
            </p>
          </div>
          <Link href={`/place/${selectedPlace.id}`}>
            <ModolButton variant="secondary" size="sm">
              <ToiletPaper size={15} weight="fill" />
              Ulasan
            </ModolButton>
          </Link>
        </div>
      )}

      {/* Feed Jejak Modol Terbaru */}
      <section className="flex flex-col gap-3 mt-1">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-extrabold text-xl text-ink">
            🔥 Jejak Modol Terbaru (Kamu & Teman)
          </h2>
          <button
            type="button"
            onClick={() => openCheckinSheet()}
            className="text-xs font-extrabold text-splash hover:underline"
          >
            + Tandai Sekarang
          </button>
        </div>

        {checkins.length === 0 ? (
          <div className="bg-paper border-2 border-line rounded-xl p-6 text-center [--lip-color:#D6C6AD] shadow-lip-sm flex flex-col items-center gap-3">
            <SiModiMascot pose="sleep" size={76} />
            <h3 className="font-display font-extrabold text-xl text-ink">
              Peta Jejakmu Masih Bersih (0 Titik)!
            </h3>
            <p className="text-xs font-bold text-ink-soft max-w-sm leading-relaxed">
              Arahkan titik biru di peta ke posisimu sekarang, lalu klik tombol{' '}
              <strong className="text-ink">MODOL!</strong> di bawah buat nancepin
              bendera pertamamu!
            </p>
            <ModolButton variant="primary" size="md" onClick={() => openCheckinSheet()}>
              🚩 TANCAP JEJAK PERTAMAKU!
            </ModolButton>
          </div>
        ) : (
          checkins.map((chk) => {
            const isFriend = chk.user_id.startsWith('friend-');
            const friendProfile = friends.find((f) => f.id === chk.user_id);
            const authorName = isFriend
              ? friendProfile?.display_name ?? 'Temanmu'
              : 'Kamu';
            const authorBadge = isFriend
              ? friendProfile?.title ?? 'Penjelajah'
              : 'Pejuang Modol';
            const place = places.find((p) => p.id === chk.place_id);
            const checkinReactions = reactions[chk.id] ?? {
              '💩': 0,
              '😂': 0,
              '🫡': 0,
              '🤢': 0,
            };
            const myEmoji = myReactions[chk.id];

            return (
              <div
                key={chk.id}
                onClick={() => place && setSelectedPlaceId(place.id)}
                className="bg-paper border-2 border-line rounded-xl p-4 [--lip-color:#D6C6AD] shadow-lip-sm flex flex-col gap-3 cursor-pointer hover:border-line-strong"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-full font-display font-extrabold text-base flex items-center justify-center border-2 border-paper ${
                        isFriend ? 'bg-bubble text-paper' : 'bg-sunny text-ink'
                      }`}
                    >
                      {isFriend ? '👥' : '💩'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-display font-extrabold text-sm text-ink">
                          {authorName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-sand border border-line text-[10px] font-extrabold text-choco">
                          {authorBadge}
                        </span>
                      </div>
                      <p className="text-xs text-ink-soft">
                        menandai modol di{' '}
                        <strong className="text-ink">
                          {place ? place.name : '🏠 Rumah / Lokasi Pribadi'}
                        </strong>{' '}
                        · {chk.city}
                      </p>
                    </div>
                  </div>

                  {place?.avg_rating && (
                    <Link
                      href={`/place/${place.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded-md bg-splash/10 border border-splash text-splash font-display font-extrabold text-xs shrink-0"
                    >
                      🧻 {place.avg_rating.toFixed(1)}
                    </Link>
                  )}
                </div>

                {chk.note && (
                  <p className="text-sm font-bold text-ink bg-cream px-3.5 py-2.5 rounded-lg border border-line">
                    “{chk.note}”
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-line">
                  <div className="flex items-center gap-1.5">
                    {REACTION_EMOJIS.map((emoji) => {
                      const count = checkinReactions[emoji as ReactionEmoji] ?? 0;
                      const active = myEmoji === emoji;
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReaction(chk.id, emoji as ReactionEmoji);
                          }}
                          className={`h-8 px-2.5 rounded-full border text-xs font-extrabold inline-flex items-center gap-1 transition-transform active:scale-125 ${
                            active
                              ? 'bg-bubble/20 border-bubble text-ink'
                              : 'bg-sand/70 border-line text-ink-soft hover:border-line-strong'
                          }`}
                        >
                          <span>{emoji}</span>
                          {count > 0 && <span>{count}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {place && (
                    <Link
                      href={`/place/${place.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-extrabold text-splash hover:underline"
                    >
                      Cek Kondisi Toilet →
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
