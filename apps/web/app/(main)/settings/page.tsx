'use client';

import React, { useState } from 'react';
import {
  HouseLine,
  ShieldCheck,
  CheckCircle,
  EnvelopeSimple,
  GoogleLogo,
} from '@phosphor-icons/react';
import { VISIBILITY_OPTIONS } from '@modoltracker/core';
import { getSupabaseClient } from '@modoltracker/api-client';
import type { Visibility } from '@modoltracker/db-types';
import { useModolStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { ModolButton } from '@/components/common/ModolButton';
import { VisibilityIcon } from '@/components/common/ModolIcons';

export default function SettingsPage() {
  const {
    username,
    hasLinkedEmail,
    linkedEmailAddress,
    linkAccountToEmail,
    defaultVisibility,
    feedDelayHours,
    privateZoneRadius,
    updatePrivacySettings,
  } = useModolStore();

  const [vis, setVis] = useState<Visibility>(defaultVisibility);
  const [delay, setDelay] = useState<number>(feedDelayHours);
  const [radius, setRadius] = useState<number>(privateZoneRadius);
  const [recoveryEmail, setRecoveryEmail] = useState<string>(linkedEmailAddress ?? '');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrivacySettings({
      defaultVisibility: vis,
      feedDelayHours: delay,
      privateZoneRadius: radius,
    });
    setSavedToast('Pengaturan privasi berhasil disimpan!');
    setTimeout(() => setSavedToast(null), 2500);
  };

  const handleLinkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;
    linkAccountToEmail(recoveryEmail.trim());
    setSavedToast(`Akun @${username} berhasil dikaitkan ke ${recoveryEmail.trim()}!`);
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleLinkGoogle = async () => {
    const sb = getSupabaseClient();
    if (sb) {
      await sb.auth.linkIdentity({ provider: 'google' }).catch(() => {});
    }
    linkAccountToEmail(`${username}@gmail.com`);
    setSavedToast('Akun Google berhasil dikaitkan sebagai pemulihan akun!');
    setTimeout(() => setSavedToast(null), 3000);
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center gap-2">
        <ShieldCheck size={28} weight="fill" className="text-splash" />
        <h1 className="font-display font-extrabold text-2xl text-ink">
          {t('settings.title')}
        </h1>
      </div>

      {savedToast && (
        <div className="p-3.5 rounded-lg bg-fresh text-paper border-2 border-fresh-shade [--lip-color:#3AA14F] shadow-lip-sm flex items-center gap-2 text-sm font-extrabold">
          <CheckCircle size={20} weight="fill" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* KARTU PEMULIHAN AKUN: KAITKAN EMAIL / GOOGLE AGAR TIDAK HILANG */}
      <div className="bg-paper border-2 border-sunny-shade rounded-xl p-5 [--lip-color:#E0A500] shadow-lip-sm flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <EnvelopeSimple size={22} weight="fill" className="text-choco" />
            <h2 className="font-display font-extrabold text-lg text-ink">
              Pemulihan Akun (@{username})
            </h2>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
              hasLinkedEmail
                ? 'bg-fresh/15 border-fresh text-fresh'
                : 'bg-sunny/30 border-sunny-shade text-choco'
            }`}
          >
            {hasLinkedEmail ? '✅ Sudah Terkait' : '⚠️ Belum Dikaitkan'}
          </span>
        </div>

        <p className="text-xs font-bold text-ink-soft leading-relaxed">
          Kamu login menggunakan <strong>Username & Password</strong>. Kaitkan email
          atau akun Google kamu supaya kalau lupa password atau ganti HP, semua
          jejak modolmu tidak hilang!
        </p>

        <form onSubmit={handleLinkEmail} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            placeholder="Masukkan email aktif kamu..."
            className="flex-1 h-11 px-3.5 rounded-md bg-sand border-2 border-line text-sm font-bold text-ink focus:outline-none focus:border-splash focus:bg-paper"
          />
          <ModolButton type="submit" variant="primary" size="md">
            Simpan Email
          </ModolButton>
        </form>

        <button
          type="button"
          onClick={handleLinkGoogle}
          className="h-10 px-4 rounded-lg bg-cream border-2 border-line-strong text-xs font-extrabold text-ink inline-flex items-center justify-center gap-2 hover:bg-sand"
        >
          <GoogleLogo size={16} weight="bold" className="text-cherry" />
          <span>Atau Kaitkan dengan Akun Google</span>
        </button>
      </div>

      {/* FORM PRIVASI LOKASI */}
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Default Visibility */}
        <div className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-sm flex flex-col gap-3">
          <h2 className="font-display font-extrabold text-lg text-ink">
            {t('settings.default_visibility_label')}
          </h2>
          <p className="text-xs text-ink-soft">
            Menentukan siapa yang bisa melihat check-in barumu secara bawaan.
          </p>
          <div className="flex flex-wrap gap-2">
            {VISIBILITY_OPTIONS.map((opt) => {
              const active = vis === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setVis(opt.id)}
                  className={`h-10 px-4 rounded-full border-2 text-xs font-extrabold inline-flex items-center gap-2 ${
                    active
                      ? 'bg-splash/15 border-splash text-splash'
                      : 'bg-cream border-line text-ink-soft'
                  }`}
                >
                  <VisibilityIcon visibility={opt.id} size={16} />
                  {t(opt.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Anti Real-time Tracking Delay */}
        <div className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-lg text-ink">
              ⏱️ {t('settings.feed_delay_label')}
            </h2>
            <span className="px-3 py-1 rounded-full bg-sunny font-display font-extrabold text-sm text-ink">
              {delay} Jam
            </span>
          </div>
          <p className="text-xs text-ink-soft">
            Mencegah pelacakan lokasi secara real-time. Check-in baru muncul di peta teman setelah jeda waktu ini.
          </p>
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full accent-splash"
          />
        </div>

        {/* Private Zone (Rumah/Kantor) */}
        <div className="bg-paper border-2 border-line rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HouseLine size={22} weight="fill" className="text-bubble" />
              <h2 className="font-display font-extrabold text-lg text-ink">
                {t('settings.private_zone_title')}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-bubble/20 border border-bubble font-display font-extrabold text-xs text-ink">
              Radius {radius} m
            </span>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed">
            {t('settings.private_zone_desc')}
          </p>
          <input
            type="range"
            min={200}
            max={1000}
            step={100}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-bubble"
          />
        </div>

        <ModolButton type="submit" variant="primary" fullWidth>
          {t('settings.save_cta')}
        </ModolButton>
      </form>
    </div>
  );
}
