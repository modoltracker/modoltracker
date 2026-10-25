'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PLACE_CATEGORIES, FACILITY_KEYS, FEE_OPTIONS } from '@modoltracker/core';
import type { PlaceCategory, FeeType } from '@modoltracker/db-types';
import { useModolStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { ModolButton } from '@/components/common/ModolButton';
import { CategoryIcon, FacilityIcon } from '@/components/common/ModolIcons';

export default function AddNewPlacePage() {
  const router = useRouter();
  const { addPlace } = useModolStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('gas_station');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');
  const [feeType, setFeeType] = useState<FeeType>('free');
  const [feeAmount, setFeeAmount] = useState(2000);
  const [is24h, setIs24h] = useState(true);
  const [facilities, setFacilities] = useState<string[]>([
    'has_squat',
    'has_jet_washer',
    'has_soap',
  ]);

  const toggleFacility = (key: string) => {
    setFacilities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const created = addPlace({
      name: name.trim(),
      category,
      address: address.trim() || 'Lokasi ditambahkan komunitas',
      city: city.trim() || 'Jakarta Selatan',
      fee_type: feeType,
      fee_amount: feeType === 'paid' ? feeAmount : 0,
      is_24h: is24h,
      facilities,
    });
    router.push(`/place/${created.id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-md flex flex-col gap-5"
    >
      <div>
        <span className="px-3 py-1 rounded-full bg-sunny/25 border border-sunny-shade text-xs font-extrabold uppercase text-choco">
          🚩 Pionir Toilet
        </span>
        <h1 className="font-display font-extrabold text-2xl text-ink mt-2">
          Tambah Lokasi Toilet Baru
        </h1>
        <p className="text-sm text-ink-soft">
          Bantu pejuang kebelet lain menemukan toilet bersih di sekitar sini!
        </p>
      </div>

      {/* Nama Tempat */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
          Nama Tempat / Lokasi Toilet *
        </label>
        <input
          type="text"
          required
          minLength={3}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: SPBU Pertamina 34.12801 Tebet"
          className="w-full h-12 px-4 rounded-md bg-sand border-2 border-line text-ink font-bold text-sm focus:outline-none focus:border-splash focus:bg-paper"
        />
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
          Kategori Tempat
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PLACE_CATEGORIES.slice(0, 9).map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-2.5 rounded-lg border-2 text-xs font-extrabold flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-splash/15 border-splash text-splash [--lip-color:#1593CF] shadow-lip-sm'
                    : 'bg-cream border-line text-ink-soft'
                }`}
              >
                <CategoryIcon
                  category={cat.id}
                  size={18}
                  weight={active ? 'fill' : 'bold'}
                />
                {t(cat.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alamat & Kota */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
            Alamat Singkat
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Jl. Tebet Raya No. 45"
            className="w-full h-12 px-4 rounded-md bg-sand border-2 border-line text-ink font-bold text-sm focus:outline-none focus:border-splash focus:bg-paper"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
            Kota / Kabupaten
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-12 px-4 rounded-md bg-sand border-2 border-line text-ink font-bold text-sm focus:outline-none focus:border-splash focus:bg-paper"
          />
        </div>
      </div>

      {/* Tarif & Jam Buka */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
            Tarif Toilet
          </label>
          <div className="flex flex-wrap gap-2">
            {FEE_OPTIONS.slice(0, 3).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFeeType(opt.id)}
                className={`h-9 px-3.5 rounded-full border-2 text-xs font-extrabold ${
                  feeType === opt.id
                    ? 'bg-fresh/15 border-fresh text-fresh'
                    : 'bg-cream border-line text-ink-soft'
                }`}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
          {feeType === 'paid' && (
            <input
              type="number"
              step={500}
              value={feeAmount}
              onChange={(e) => setFeeAmount(Number(e.target.value))}
              className="mt-2 w-full h-10 px-3 rounded-md bg-sand border-2 border-line text-sm font-bold"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
            Jam Operasional
          </label>
          <button
            type="button"
            onClick={() => setIs24h((v) => !v)}
            className={`h-9 px-4 rounded-full border-2 text-xs font-extrabold ${
              is24h
                ? 'bg-splash/15 border-splash text-splash'
                : 'bg-cream border-line text-ink-soft'
            }`}
          >
            {is24h ? '⏰ Buka 24 Jam' : 'Jam Tertentu'}
          </button>
        </div>
      </div>

      {/* Fasilitas */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1.5">
          Fasilitas yang Tersedia
        </label>
        <div className="flex flex-wrap gap-2">
          {FACILITY_KEYS.map((fac) => {
            const active = facilities.includes(fac.key);
            return (
              <button
                key={fac.key}
                type="button"
                onClick={() => toggleFacility(fac.key)}
                className={`h-9 px-3 rounded-full border-2 text-xs font-extrabold inline-flex items-center gap-1.5 ${
                  active
                    ? 'bg-splash/15 border-splash text-splash'
                    : 'bg-cream border-line text-ink-soft'
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
      </div>

      <ModolButton type="submit" variant="primary" fullWidth>
        ➕ SIMPAN LOKASI TOILET
      </ModolButton>
    </form>
  );
}
