'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  HouseLine,
  Sparkle,
  Crosshair,
  WarningCircle,
  FlagBanner,
} from '@phosphor-icons/react';
import {
  VISIBILITY_OPTIONS,
  FACILITY_KEYS,
  PLACE_CATEGORIES,
  calculateDistanceMeters,
} from '@modoltracker/core';
import type { Visibility, PlaceCategory } from '@modoltracker/db-types';
import { useModolStore } from '@/lib/store';
import { reverseGeocodeGps } from '@/lib/geocoding';
import { t } from '@/lib/i18n';
import { ModolButton } from '../common/ModolButton';
import { SiModiMascot } from '../common/SiModiMascot';
import { CategoryIcon, VisibilityIcon, FacilityIcon } from '../common/ModolIcons';
import { TissueRollRating } from '../review/TissueRollRating';

type FlowStage =
  | 'drop_flag'
  | 'celebrate_checkin'
  | 'quiz_cleanliness'
  | 'quiz_water'
  | 'quiz_smell'
  | 'quiz_facilities'
  | 'review_done';

const QUICK_CATEGORIES: { id: PlaceCategory | 'private_home'; label: string }[] = [
  { id: 'gas_station', label: '⛽ Pom Bensin' },
  { id: 'minimarket', label: '🏪 Indomaret/Alfa' },
  { id: 'mosque', label: '🕌 Masjid' },
  { id: 'mall', label: '🛍️ Mall/Kafe' },
  { id: 'office', label: '🏢 Kantor/Kampus' },
  { id: 'private_home', label: '🏠 Rumah Sendiri/Teman' },
];

export function CheckinSheetModal() {
  const {
    places,
    userLocation,
    gpsAccuracyMeters,
    gpsStatus,
    refreshGpsLocation,
    defaultVisibility,
    isCheckinSheetOpen,
    selectedPlaceForCheckin,
    closeCheckinSheet,
    addCheckin,
    addPlace,
    addReview,
  } = useModolStore();

  const [stage, setStage] = useState<FlowStage>('drop_flag');
  const [spotName, setSpotName] = useState<string>('');
  const [spotCategory, setSpotCategory] = useState<PlaceCategory | 'private_home'>('gas_station');
  const [selectedExistingPlaceId, setSelectedExistingPlaceId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>(defaultVisibility);
  const [note, setNote] = useState('');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [detectedCity, setDetectedCity] = useState<string>('Jakarta');
  const [detectedAddress, setDetectedAddress] = useState<string>('Mendeteksi nama jalan dari GPS...');
  const [lastCheckinId, setLastCheckinId] = useState<string | null>(null);
  const [createdOrPickedPlaceId, setCreatedOrPickedPlaceId] = useState<string | null>(null);

  // Quiz state (info toilet pendukung)
  const [ratingCleanliness, setRatingCleanliness] = useState(5);
  const [ratingWater, setRatingWater] = useState(5);
  const [ratingSmell, setRatingSmell] = useState(4);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'has_jet_washer',
    'has_soap',
  ]);
  const [reviewBody, setReviewBody] = useState('');

  React.useEffect(() => {
    if (isCheckinSheetOpen) {
      setStage('drop_flag');
      setGpsError(null);
      if (selectedPlaceForCheckin) {
        setSelectedExistingPlaceId(selectedPlaceForCheckin.id);
        setSpotName(selectedPlaceForCheckin.name);
        setSpotCategory(selectedPlaceForCheckin.category);
      } else {
        setSelectedExistingPlaceId(null);
        setSpotName('');
        setSpotCategory('gas_station');
      }
      setVisibility(defaultVisibility);
      setNote('');

      // Otomatis deteksi nama jalan & kota dari koordinat GPS via OpenStreetMap (Gratis tanpa Kartu Kredit)
      reverseGeocodeGps(userLocation.lat, userLocation.lng).then((geo) => {
        setDetectedCity(geo.city);
        setDetectedAddress(geo.displayAddress);
        if (!selectedPlaceForCheckin && geo.placeSuggestedName) {
          setSpotName((prev) => (prev.trim() === '' ? geo.placeSuggestedName! : prev));
        }
      });
    }
  }, [isCheckinSheetOpen, selectedPlaceForCheckin, defaultVisibility, userLocation.lat, userLocation.lng]);

  if (!isCheckinSheetOpen) return null;

  const fireCelebration = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFC800', '#1CB0F6', '#4CC764', '#FF7EB6'],
      });
    } catch {
      // ignore
    }
  };

  // Cari tempat yang kebetulan dekat (< 300m) sebagai saran 1-klik
  const nearbySuggestions = places
    .map((p) => ({
      ...p,
      dist: calculateDistanceMeters(userLocation.lat, userLocation.lng, p.lat, p.lng),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  const handleConfirmCheckin = () => {
    setGpsError(null);

    if (gpsAccuracyMeters && gpsAccuracyMeters > 300) {
      setGpsError(
        `Sinyal GPS kurang akurat (±${gpsAccuracyMeters}m). Klik 'Perbarui GPS' agar titik jejakmu akurat.`
      );
      return;
    }

    let finalPlaceId: string | null = selectedExistingPlaceId;

    if (spotCategory === 'private_home') {
      finalPlaceId = null;
    } else if (!finalPlaceId) {
      const cleanName =
        spotName.trim() ||
        `${
          QUICK_CATEGORIES.find((c) => c.id === spotCategory)?.label.replace(/^[^\s]+\s/, '') ??
          'Spot Modol'
        } (${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)})`;

      const newPlace = addPlace({
        name: cleanName,
        category: spotCategory,
        address: detectedAddress,
        city: detectedCity,
        fee_type: 'free',
        fee_amount: 0,
        is_24h: true,
        facilities: ['has_jet_washer'],
      });
      finalPlaceId = newPlace.id;
    }

    const created = addCheckin({
      place_id: finalPlaceId,
      lat: userLocation.lat,
      lng: userLocation.lng,
      visibility: spotCategory === 'private_home' ? 'private' : visibility,
      note: note.trim() ? note.trim() : undefined,
      city: detectedCity,
    });

    setCreatedOrPickedPlaceId(finalPlaceId);
    setLastCheckinId(created.id);
    setStage('celebrate_checkin');
    fireCelebration();
  };

  const handleFinishReview = () => {
    if (createdOrPickedPlaceId) {
      addReview({
        place_id: createdOrPickedPlaceId,
        checkin_id: lastCheckinId,
        rating_cleanliness: ratingCleanliness,
        rating_water: ratingWater,
        rating_smell: ratingSmell,
        body: reviewBody.trim() ? reviewBody.trim() : undefined,
        facilities: selectedFacilities,
      });
      fireCelebration();
    }
    setStage('review_done');
  };

  const toggleFacility = (key: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const quizProgress =
    stage === 'quiz_cleanliness'
      ? 25
      : stage === 'quiz_water'
      ? 50
      : stage === 'quiz_smell'
      ? 75
      : 100;

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-end justify-center p-0 sm:p-4">
      <div className="bg-cream w-full max-w-lg rounded-t-xl sm:rounded-xl border-2 border-line p-5 shadow-sheet max-h-[92vh] overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-line">
          <div className="flex items-center gap-2">
            <FlagBanner size={22} weight="fill" className="text-choco" />
            <h2 className="font-display font-extrabold text-xl text-ink">
              {stage.startsWith('quiz_')
                ? 'Bonus: Ulas Kenyamanan Toilet 🧻'
                : '💩 Tancap Bendera Modol!'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCheckinSheet}
            aria-label="Tutup"
            className="w-9 h-9 rounded-full bg-sand border-2 border-line flex items-center justify-center text-ink-soft hover:text-ink"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* STAGE 1: TANCAP BENDERA DI TITIK GPS SAAT INI */}
        {stage === 'drop_flag' && (
          <div className="mt-4 flex flex-col gap-4">
            {/* Banner Status GPS Real-time */}
            <div className="p-3 rounded-lg bg-sand border-2 border-line flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Crosshair
                  size={20}
                  weight="fill"
                  className={gpsStatus === 'locked' ? 'text-fresh' : 'text-sunny-shade'}
                />
                <div>
                  <p className="text-xs font-extrabold text-ink">
                    {gpsStatus === 'locked'
                      ? `📍 Titik GPS Kamu Terkunci (±${gpsAccuracyMeters ?? 15}m)`
                      : 'Mengunci titik GPS lokasi kamu sekarang...'}
                  </p>
                  <p className="text-[11px] font-bold text-ink-soft">
                    📍 {detectedAddress} ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={refreshGpsLocation}
                className="px-2.5 py-1 rounded-md bg-paper border border-line-strong text-[11px] font-extrabold text-splash shrink-0"
              >
                Perbarui GPS
              </button>
            </div>

            {gpsError && (
              <div className="p-3 rounded-lg bg-cherry/15 border-2 border-cherry text-cherry text-xs font-extrabold flex items-start gap-2">
                <WarningCircle size={18} weight="fill" className="shrink-0 mt-0.5" />
                <span>{gpsError}</span>
              </div>
            )}

            {/* Kategori Cepat (1-Tap) */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-2">
                1. Lagi numpang modol di mana nih?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUICK_CATEGORIES.map((cat) => {
                  const active = spotCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSpotCategory(cat.id);
                        setSelectedExistingPlaceId(null);
                      }}
                      className={`p-2.5 rounded-lg border-2 text-xs font-extrabold text-left transition-all ${
                        active
                          ? 'bg-sunny/30 border-sunny-shade text-ink [--lip-color:#E0A500] shadow-lip-sm'
                          : 'bg-paper border-line text-ink-soft hover:border-line-strong'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nama Tempat (Bebas ketik atau klik saran yang pernah ditandai teman) */}
            {spotCategory !== 'private_home' && (
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
                  2. Kasih Nama Tempatnya (Biar Temanmu Tahu!)
                </label>
                <input
                  type="text"
                  value={spotName}
                  onChange={(e) => {
                    setSpotName(e.target.value);
                    setSelectedExistingPlaceId(null);
                  }}
                  placeholder="Misal: Pom Bensin Cikini / Indomaret Dago / Rumah Rian..."
                  className="w-full h-12 px-4 rounded-md bg-paper border-2 border-line-strong text-ink placeholder:text-ink-faint focus:outline-none focus:border-splash text-sm font-bold"
                />

                {/* Saran titik yang sudah pernah ditandai di dekat sini */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-extrabold text-ink-faint">
                    Atau pilih yang sudah ada:
                  </span>
                  {nearbySuggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedExistingPlaceId(s.id);
                        setSpotName(s.name);
                        setSpotCategory(s.category);
                      }}
                      className={`px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${
                        selectedExistingPlaceId === s.id
                          ? 'bg-splash text-paper border-splash'
                          : 'bg-sand border-line text-ink-soft'
                      }`}
                    >
                      📍 {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Catatan seru untuk feed teman */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
                3. Cerita / Kesan Singkat (Muncul di Jejak Teman)
              </label>
              <input
                type="text"
                maxLength={280}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Misal: Kebelet parah pas macet, untung airnya kenceng 😂"
                className="w-full h-12 px-4 rounded-md bg-sand border-2 border-line text-ink placeholder:text-ink-faint focus:outline-none focus:border-splash focus:bg-paper text-sm font-bold"
              />
            </div>

            {/* Visibility chips */}
            {spotCategory !== 'private_home' && (
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-2">
                  {t('checkin.visibility_label')}
                </p>
                <div className="flex items-center gap-2">
                  {VISIBILITY_OPTIONS.map((opt) => {
                    const active = visibility === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setVisibility(opt.id)}
                        className={`h-9 px-3.5 rounded-full border-2 text-xs font-extrabold inline-flex items-center gap-1.5 transition-all ${
                          active
                            ? 'bg-splash/10 border-splash text-splash'
                            : 'bg-paper border-line text-ink-soft'
                        }`}
                      >
                        <VisibilityIcon visibility={opt.id} size={15} />
                        {t(opt.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <ModolButton variant="primary" fullWidth onClick={handleConfirmCheckin}>
              🚩 TANCAP PIN MODOL DI SINI!
            </ModolButton>
          </div>
        )}

        {/* STAGE 2: CELEBRATION LEGA 😌 + OPSIONAL ULAS TOILET */}
        {stage === 'celebrate_checkin' && (
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <SiModiMascot pose="relieved" size={96} />
            <span className="px-3 py-1 rounded-full bg-fresh/15 border border-fresh text-fresh text-xs font-extrabold">
              🚩 +1 TITIK JEJAK BARU TERTANCAP!
            </span>
            <h3 className="font-display font-extrabold text-3xl text-ink">
              {t('checkin.success_title')}
            </h3>
            <p className="text-sm text-ink-soft max-w-xs">
              Titik ini sudah masuk ke Peta Jejakmu & siap dilihat teman-temanmu!
            </p>
            {createdOrPickedPlaceId !== null ? (
              <div className="w-full flex flex-col gap-2.5 mt-2">
                <ModolButton
                  variant="secondary"
                  fullWidth
                  onClick={() => setStage('quiz_cleanliness')}
                >
                  🧻 BONUS: KASIH RATING TOILETNYA (+10 XP)
                </ModolButton>
                <ModolButton variant="primary" fullWidth onClick={closeCheckinSheet}>
                  CUKUP TANDAI SAJA, LIHAT PETA JEJAK!
                </ModolButton>
              </div>
            ) : (
              <ModolButton variant="primary" fullWidth onClick={closeCheckinSheet}>
                Lihat Peta Jejakku
              </ModolButton>
            )}
          </div>
        )}

        {/* STAGE 3: BONUS DUOLINGO-STYLE QUIZ REVIEW (NOMOR 2 / PENDUKUNG) */}
        {stage.startsWith('quiz_') && (
          <div className="mt-4 flex flex-col gap-5">
            <div className="w-full h-3 bg-sand rounded-full overflow-hidden border border-line">
              <div
                className="h-full bg-fresh transition-all duration-300 rounded-full"
                style={{ width: `${quizProgress}%` }}
              />
            </div>

            {stage === 'quiz_cleanliness' && (
              <div className="py-4 flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-splash/15 border-2 border-splash text-splash flex items-center justify-center">
                  <Sparkle size={34} weight="fill" />
                </div>
                <h3 className="font-display font-extrabold text-2xl text-ink">
                  🧼 {t('review.quiz_step_cleanliness')}
                </h3>
                <TissueRollRating
                  value={ratingCleanliness}
                  onChange={(v) => {
                    setRatingCleanliness(v);
                    setTimeout(() => setStage('quiz_water'), 320);
                  }}
                />
                <ModolButton
                  variant="secondary"
                  size="md"
                  onClick={() => setStage('quiz_water')}
                >
                  Lanjut →
                </ModolButton>
              </div>
            )}

            {stage === 'quiz_water' && (
              <div className="py-4 flex flex-col items-center text-center gap-5">
                <h3 className="font-display font-extrabold text-2xl text-ink">
                  💧 {t('review.quiz_step_water')}
                </h3>
                <TissueRollRating
                  value={ratingWater}
                  onChange={(v) => {
                    setRatingWater(v);
                    setTimeout(() => setStage('quiz_smell'), 320);
                  }}
                />
                <ModolButton
                  variant="secondary"
                  size="md"
                  onClick={() => setStage('quiz_smell')}
                >
                  Lanjut →
                </ModolButton>
              </div>
            )}

            {stage === 'quiz_smell' && (
              <div className="py-4 flex flex-col items-center text-center gap-5">
                <h3 className="font-display font-extrabold text-2xl text-ink">
                  👃 {t('review.quiz_step_smell')}
                </h3>
                <TissueRollRating
                  value={ratingSmell}
                  activeColorClass="text-bubble border-bubble bg-bubble/15"
                  onChange={(v) => {
                    setRatingSmell(v);
                    setTimeout(() => setStage('quiz_facilities'), 320);
                  }}
                />
                <ModolButton
                  variant="secondary"
                  size="md"
                  onClick={() => setStage('quiz_facilities')}
                >
                  Lanjut →
                </ModolButton>
              </div>
            )}

            {stage === 'quiz_facilities' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-display font-extrabold text-xl text-ink text-center">
                  ✨ {t('review.quiz_step_facilities')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {FACILITY_KEYS.map((fac) => {
                    const active = selectedFacilities.includes(fac.key);
                    return (
                      <button
                        key={fac.key}
                        type="button"
                        onClick={() => toggleFacility(fac.key)}
                        className={`h-9 px-3 rounded-full border-2 text-xs font-extrabold inline-flex items-center gap-1.5 transition-all ${
                          active
                            ? 'bg-splash/15 border-splash text-splash'
                            : 'bg-paper border-line text-ink-soft'
                        }`}
                      >
                        <FacilityIcon
                          facilityKey={fac.key}
                          size={15}
                          weight={active ? 'fill' : 'bold'}
                        />
                        {t(fac.labelKey)}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  rows={2}
                  maxLength={1000}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder={t('review.body_placeholder')}
                  className="w-full p-3 rounded-md bg-sand border-2 border-line text-sm font-bold text-ink placeholder:text-ink-faint focus:outline-none focus:border-splash focus:bg-paper"
                />
                <ModolButton variant="primary" fullWidth onClick={handleFinishReview}>
                  🎉 {t('review.submit_cta')}
                </ModolButton>
              </div>
            )}
          </div>
        )}

        {/* STAGE 4: REVIEW DONE */}
        {stage === 'review_done' && (
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <SiModiMascot pose="celebrate" size={96} />
            <span className="px-3 py-1 rounded-full bg-sunny border-2 border-sunny-shade font-display font-extrabold text-sm text-ink">
              +10 XP · INFO TOILET TERSIMPAN!
            </span>
            <h3 className="font-display font-extrabold text-2xl text-ink">
              Mantap! Jejak & Ulasanmu Sudah Nancep 🙌
            </h3>
            <ModolButton variant="primary" fullWidth onClick={closeCheckinSheet}>
              Kembali ke Peta Jejak
            </ModolButton>
          </div>
        )}
      </div>
    </div>
  );
}
