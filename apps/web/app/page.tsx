'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FlagBanner,
  Trophy,
  UsersThree,
  ToiletPaper,
  Crosshair,
  ShieldCheck,
  Crown,
  Sparkle,
  ArrowRight,
  MapPin,
} from '@phosphor-icons/react';
import { SiModiMascot, type ModiPose } from '@/components/common/SiModiMascot';
import { ModolButton } from '@/components/common/ModolButton';

export default function LandingPage() {
  const [demoPose, setDemoPose] = useState<ModiPose>('celebrate');
  const [demoCount, setDemoCount] = useState<number>(27);
  const [demoReactionCount, setDemoReactionCount] = useState<number>(14);
  const [hasTappedDemo, setHasTappedDemo] = useState<boolean>(false);

  const handleDemoTap = () => {
    setDemoPose('relieved');
    if (!hasTappedDemo) {
      setDemoCount((c) => c + 1);
      setHasTappedDemo(true);
    }
    setTimeout(() => setDemoPose('celebrate'), 1600);
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col justify-between selection:bg-sunny selection:text-ink">
      {/* Sticky Chunky Navbar */}
      <header className="sticky top-0 z-30 bg-cream/95 border-b-2 border-line px-4 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-sunny border-2 border-sunny-shade [--lip-color:#E0A500] shadow-lip-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <SiModiMascot pose="happy" size={30} />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-choco">
              modoltracker
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/leaderboard"
              className="hidden md:inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-paper border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-sm text-xs font-extrabold uppercase text-ink hover:border-choco active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Trophy size={16} weight="fill" className="text-sunny-shade" />
              Klasemen
            </Link>
            <Link
              href="/login?mode=login"
              className="inline-flex items-center h-10 px-4 rounded-lg bg-paper border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-sm text-xs font-extrabold uppercase text-splash hover:bg-sand active:translate-y-0.5 active:shadow-none transition-all"
            >
              Login
            </Link>
            <Link href="/login?mode=register">
              <ModolButton variant="primary" size="md">
                Sign Up
              </ModolButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-14 flex flex-col gap-12 sm:gap-16">
        {/* HERO SECTION: 2 Kolom Asimetris (Kiri Pitch & CTA, Kanan Kartu Interaktif Peta Jejak) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Kolom Kiri: Headline & Primary Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sunny/30 border-2 border-sunny-shade text-xs font-extrabold uppercase tracking-wider text-choco [--lip-color:#E0A500] shadow-lip-sm">
              <FlagBanner size={15} weight="fill" />
              <span>Jejak Modolmu & Circle Pertemananmu</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[54px] text-ink leading-[1.08] tracking-tight">
              Sudah Pernah Modol di Mana Aja{' '}
              <span className="inline-block bg-sunny px-3 py-0.5 rounded-xl border-2 border-sunny-shade [--lip-color:#E0A500] shadow-lip-sm text-ink">
                Kamu & Temanmu?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-soft font-bold leading-relaxed max-w-xl">
              Lagi nongkrong di kloset SPBU, Indomaret, kafe, atau rumah teman?{' '}
              <strong className="text-ink">Tancapkan bendera GPS-mu sekarang!</strong>{' '}
              Koleksi jumlah tempat & kota yang sudah kamu taklukkan, adu ranking
              bulanan, dan saling lempar reaksi bareng circle-mu.
            </p>

            {/* Tombol Utama */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link href="/map" className="w-full sm:w-auto">
                <ModolButton variant="primary" size="lg" fullWidth>
                  💩 TANCAP PIN MODOL SEKARANG
                  <ArrowRight size={20} weight="bold" />
                </ModolButton>
              </Link>
              <Link href="/friends" className="w-full sm:w-auto">
                <ModolButton variant="secondary" size="lg" fullWidth>
                  <UsersThree size={20} weight="fill" />
                  LIHAT JEJAK TEMAN
                </ModolButton>
              </Link>
            </div>

            {/* Trust Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border-2 border-line text-xs font-extrabold text-ink-soft">
                <Crosshair size={15} weight="fill" className="text-fresh" />
                Kunci GPS Asli (Anti-Fake GPS)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border-2 border-line text-xs font-extrabold text-ink-soft">
                <ShieldCheck size={15} weight="fill" className="text-splash" />
                Area Rumah Otomatis Privat 🔒
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border-2 border-line text-xs font-extrabold text-ink-soft">
                <ToiletPaper size={15} weight="fill" className="text-choco" />
                Bonus Rating Gulungan Tisu
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Interactive Preview Card (Bisa Diklik Langsung!) */}
          <div className="lg:col-span-5">
            <div className="bg-paper border-2 border-line-strong rounded-xl p-5 [--lip-color:#D6C6AD] shadow-lip-lg flex flex-col gap-4 relative">
              {/* Top Mini Status Bar */}
              <div className="flex items-center justify-between border-b-2 border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-fresh inline-block animate-pulse" />
                  <span className="font-display font-extrabold text-sm text-ink">
                    LIVE SIMULASI PETA JEJAK
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-sunny/30 border border-sunny-shade text-[11px] font-extrabold text-choco">
                  👑 Raja SPBU
                </span>
              </div>

              {/* Kanvas Ilustrasi Peta Jejak Interaktif */}
              <div className="relative h-52 rounded-xl bg-sand border-2 border-line overflow-hidden p-3 flex flex-col justify-between">
                {/* Garis jalan dekoratif */}
                <div className="absolute inset-0 opacity-35 pointer-events-none">
                  <div className="w-full h-3 bg-paper rotate-12 translate-y-16 border-y border-line-strong" />
                  <div className="w-3 h-full bg-paper left-1/3 absolute top-0 border-x border-line-strong" />
                  <div className="w-full h-2.5 bg-paper -rotate-6 translate-y-36 border-y border-line-strong" />
                </div>

                {/* Baris Skor Mini di Atas Peta */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="bg-paper/95 border-2 border-line rounded-lg px-2.5 py-1 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                    <span>🚩 Titikmu:</span>
                    <span className="font-display text-base text-sunny-shade">
                      {demoCount}
                    </span>
                  </div>
                  <div className="bg-paper/95 border-2 border-line rounded-lg px-2.5 py-1 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                    <span>🏙️ Kota:</span>
                    <span className="font-display text-base text-splash">5</span>
                  </div>
                </div>

                {/* Pin-pin 💩 di atas Kanvas */}
                <div className="relative z-10 my-auto flex items-center justify-around px-2">
                  {/* Pin Teman 1 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-2 py-0.5 rounded-full bg-paper border border-line text-[10px] font-extrabold text-ink shadow-sm">
                      @rizky · SPBU
                    </div>
                    <div className="w-10 h-10 rounded-full bg-bubble border-[3px] border-paper [--lip-color:#E0609A] shadow-lip-sm flex items-center justify-center text-lg">
                      💩
                    </div>
                  </div>

                  {/* Maskot Si Modi Tengah (Interactive!) */}
                  <button
                    type="button"
                    onClick={handleDemoTap}
                    className="flex flex-col items-center group cursor-pointer focus:outline-none"
                    title="Klik untuk coba tancap pin!"
                  >
                    <div className="px-2.5 py-0.5 rounded-full bg-sunny border-2 border-sunny-shade text-[10px] font-extrabold text-ink mb-1 group-hover:scale-105 transition-transform">
                      {hasTappedDemo ? '😌 Lega! +1 Titik!' : '👆 Klik Coba Tancap!'}
                    </div>
                    <SiModiMascot
                      pose={demoPose}
                      size={66}
                      className="group-active:translate-y-1 transition-transform"
                    />
                  </button>

                  {/* Pin Teman 2 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-2 py-0.5 rounded-full bg-paper border border-line text-[10px] font-extrabold text-ink shadow-sm">
                      @sari · Indomaret
                    </div>
                    <div className="w-10 h-10 rounded-full bg-sunny border-[3px] border-paper [--lip-color:#E0A500] shadow-lip-sm flex items-center justify-center text-lg">
                      💩
                    </div>
                  </div>
                </div>

                {/* Legenda Bawah */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-extrabold bg-paper/95 border border-line rounded-lg px-2.5 py-1">
                  <span className="text-ink-soft">
                    📍 Terdeteksi: Jl. HR. Rasuna Said, Jaksel
                  </span>
                  <span className="text-fresh">✅ GPS Akurat</span>
                </div>
              </div>

              {/* Contoh Feed Teman + Reaksi Interaktif */}
              <div className="bg-cream border-2 border-line rounded-xl p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-bubble text-paper font-display font-extrabold text-xs flex items-center justify-center border-2 border-paper">
                      R
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-ink">
                        Rizky Pratama{' '}
                        <span className="text-ink-soft font-bold">
                          nancepin modol di
                        </span>{' '}
                        Rest Area KM 57A
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-splash/15 border border-splash text-[11px] font-display font-extrabold text-splash">
                    🧻 4.8
                  </span>
                </div>

                <p className="text-xs font-bold text-ink-soft italic">
                  “Penyelamat mudik! Airnya kenceng pol, toiletnya wangi.”
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDemoReactionCount((n) => n + 1)}
                      className="px-2.5 py-1 rounded-full bg-paper border border-line-strong text-xs font-extrabold hover:border-bubble active:scale-110 transition-transform"
                    >
                      💩 {demoReactionCount}
                    </button>
                    <span className="px-2.5 py-1 rounded-full bg-paper border border-line text-xs font-extrabold">
                      😂 5
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-paper border border-line text-xs font-extrabold">
                      🫡 3
                    </span>
                  </div>
                  <Link
                    href="/map"
                    className="text-[11px] font-extrabold text-splash hover:underline"
                  >
                    Buka Peta Penuh →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CARA MAIN: 3 LANGKAH RINGKAS & CHUNKY */}
        <section className="bg-paper border-2 border-line rounded-xl p-6 sm:p-8 [--lip-color:#D6C6AD] shadow-lip-md flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-line pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-splash">
                Cara Main Modoltracker
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
                Dipakai Pas Lagi Nongkrong di Kloset atau Habis Lega 😌
              </h2>
            </div>
            <span className="text-xs font-extrabold text-ink-soft bg-sand px-3 py-1.5 rounded-full border border-line w-fit">
              ⚡ Cuma butuh 5 detik!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-cream border-2 border-line rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-sunny border-2 border-sunny-shade font-display font-extrabold text-xl text-ink flex items-center justify-center [--lip-color:#E0A500] shadow-lip-sm">
                  1
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-fresh/15 border border-fresh text-[11px] font-extrabold text-fresh">
                  Auto-GPS
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-ink">
                🚩 Tancap Pin di Titikmu
              </h3>
              <p className="text-sm text-ink-soft font-bold leading-relaxed">
                Klik tombol <strong className="text-ink">MODOL!</strong>. Koordinat,
                nama jalan, dan kotamu otomatis terkunci dari GPS. Tinggal pilih
                kategori: Pom Bensin, Indomaret, Masjid, atau Rumah Teman!
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-cream border-2 border-line rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-bubble border-2 border-bubble-shade font-display font-extrabold text-xl text-paper flex items-center justify-center [--lip-color:#E0609A] shadow-lip-sm">
                  2
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-bubble/15 border border-bubble text-[11px] font-extrabold text-ink">
                  Social & Fun
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-ink">
                👥 Pamer Jejak & Adu Ranking
              </h3>
              <p className="text-sm text-ink-soft font-bold leading-relaxed">
                Add teman-temanmu! Lihat mereka sudah pernah modol di kota mana
                saja, kejar posisi #1 di Leaderboard bulanan, dan kirim reaksi{' '}
                <strong className="text-ink">💩 😂 🫡 🤢</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-cream border-2 border-line rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-splash border-2 border-splash-shade font-display font-extrabold text-xl text-paper flex items-center justify-center [--lip-color:#1593CF] shadow-lip-sm">
                  3
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-splash/15 border border-splash text-[11px] font-extrabold text-splash">
                  Bonus +10 XP
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-ink">
                🧻 Kasih Skor Gulungan Tisu
              </h3>
              <p className="text-sm text-ink-soft font-bold leading-relaxed">
                Sambil nunggu selesai, kasih rating singkat pake{' '}
                <strong className="text-ink">5 Gulungan Tisu</strong> (kebersihan,
                air kenceng, ada sabun/jet washer) biar temanmu tahu kondisi
                toiletnya!
              </p>
            </div>
          </div>
        </section>

        {/* BENTO GRID: KOLEKSI GELAR & KEAMANAN PRIVASI */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Kartu Kiri: Gelar & Badge Lucu */}
          <div className="md:col-span-7 bg-paper border-2 border-line rounded-xl p-6 [--lip-color:#D6C6AD] shadow-lip-md flex flex-col justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-sunny/30 border border-sunny-shade text-xs font-extrabold uppercase text-choco inline-flex items-center gap-1">
                <Crown size={14} weight="fill" />
                Koleksi Badge & Gelar Unik
              </span>
              <h2 className="font-display font-extrabold text-2xl text-ink mt-2">
                Dari “Penjelajah SPBU” Sampai “Modol Lintas Kota” 🏆
              </h2>
              <p className="text-sm text-ink-soft font-bold mt-1">
                Setiap kali kamu menandai tempat baru, kamu membuka gelar yang bisa
                dipajang di profilmu.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg bg-cream border-2 border-sunny-shade flex flex-col gap-1">
                <span className="text-xl">⛽</span>
                <p className="font-display font-extrabold text-sm text-ink">
                  Raja SPBU
                </p>
                <p className="text-[11px] font-bold text-ink-soft">
                  10 Pom Bensin
                </p>
              </div>
              <div className="p-3 rounded-lg bg-cream border-2 border-splash flex flex-col gap-1">
                <span className="text-xl">🏙️</span>
                <p className="font-display font-extrabold text-sm text-ink">
                  Lintas Kota
                </p>
                <p className="text-[11px] font-bold text-ink-soft">
                  5 Kota Berbeda
                </p>
              </div>
              <div className="p-3 rounded-lg bg-cream border-2 border-fresh flex flex-col gap-1 col-span-2 sm:col-span-1">
                <span className="text-xl">🦉</span>
                <p className="font-display font-extrabold text-sm text-ink">
                  Kalong Toilet
                </p>
                <p className="text-[11px] font-bold text-ink-soft">
                  Modol Jam 00–04
                </p>
              </div>
            </div>
          </div>

          {/* Kartu Kanan: Privasi Aman (Anti-Stalking) */}
          <div className="md:col-span-5 bg-choco text-paper border-2 border-choco-shade rounded-xl p-6 [--lip-color:#5C3A22] shadow-lip-md flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="w-11 h-11 rounded-xl bg-sunny text-ink border-2 border-sunny-shade flex items-center justify-center">
                <ShieldCheck size={26} weight="fill" />
              </div>
              <h2 className="font-display font-extrabold text-2xl mt-1">
                Seru-seruan Tanpa Takut Dilacak 🔒
              </h2>
              <p className="text-sm text-cream/90 font-bold leading-relaxed">
                Lokasi rumah sendiri otomatis disembunyikan dalam{' '}
                <strong className="text-sunny">Zona Privat 500m</strong> dan ada
                fitur jeda waktu (*delay posting*) supaya tidak ada yang bisa
                melacak posisi real-time kamu.
              </p>
            </div>

            <Link href="/map">
              <ModolButton variant="primary" fullWidth size="md">
                <MapPin size={18} weight="fill" />
                MULAI PETUALANGAN MODOLMU!
              </ModolButton>
            </Link>
          </div>
        </section>
      </main>

      {/* Chunky Footer */}
      <footer className="border-t-2 border-line bg-paper px-4 py-6 mt-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-extrabold text-ink-soft">
          <div className="flex items-center gap-2">
            <SiModiMascot pose="happy" size={26} />
            <span className="font-display text-base text-choco">
              modoltracker.web.id
            </span>
            <span>· Jejak modolmu, panduan toilet semua orang.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/map" className="hover:text-splash">
              Peta Jejak
            </Link>
            <Link href="/leaderboard" className="hover:text-splash">
              Leaderboard
            </Link>
            <Link href="/badges" className="hover:text-splash">
              Badge
            </Link>
            <Link href="/settings" className="hover:text-splash">
              Privasi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
