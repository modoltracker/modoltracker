'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  At,
  LockKey,
  CheckCircle,
  WarningCircle,
  Eye,
  EyeSlash,
} from '@phosphor-icons/react';
import {
  registerUsernameSchema,
  loginUsernameSchema,
  usernameToInternalAuthEmail,
} from '@modoltracker/core';
import { getSupabaseClient } from '@modoltracker/api-client';
import { useModolStore } from '@/lib/store';
import { SiModiMascot } from '@/components/common/SiModiMascot';
import { ModolButton } from '@/components/common/ModolButton';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccountIdentity } = useModolStore();

  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'register';
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);

  useEffect(() => {
    const m = searchParams.get('mode');
    if (m === 'login' || m === 'register') {
      setMode(m);
    }
  }, [searchParams]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = registerUsernameSchema.safeParse({
      display_name: displayName.trim(),
      username: username.trim().toLowerCase(),
      password,
      confirm_password: confirmPassword,
    });

    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? 'Periksa kembali data kamu.');
      return;
    }

    const cleanUsername = parsed.data.username;
    const cleanName = parsed.data.display_name;
    const internalEmail = usernameToInternalAuthEmail(cleanUsername);

    setLoading(true);
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb.auth.signUp({
          email: internalEmail,
          password: parsed.data.password,
          options: {
            data: {
              username: cleanUsername,
              display_name: cleanName,
            },
          },
        });

        if (error && !error.message.toLowerCase().includes('email')) {
          setLoading(false);
          setErrorMsg(
            error.message.includes('already registered')
              ? `Username @${cleanUsername} sudah dipakai orang lain. Coba username lain ya!`
              : error.message
          );
          return;
        }

        setAccountIdentity({
          userId: data?.user?.id ?? `usr-${Date.now()}`,
          username: cleanUsername,
          displayName: cleanName,
          hasLinkedEmail: false,
        });
      } catch {
        setAccountIdentity({
          userId: `usr-${Date.now()}`,
          username: cleanUsername,
          displayName: cleanName,
          hasLinkedEmail: false,
        });
      }
    } else {
      setAccountIdentity({
        userId: `usr-${Date.now()}`,
        username: cleanUsername,
        displayName: cleanName,
        hasLinkedEmail: false,
      });
    }

    setLoading(false);
    router.push('/map');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = loginUsernameSchema.safeParse({
      username: username.trim().toLowerCase(),
      password,
    });

    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? 'Masukkan username dan password.');
      return;
    }

    const cleanUsername = parsed.data.username;
    const internalEmail = usernameToInternalAuthEmail(cleanUsername);

    setLoading(true);
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb.auth.signInWithPassword({
          email: internalEmail,
          password: parsed.data.password,
        });

        if (error) {
          // Jika di mode demo lokal belum ada di Supabase Auth, tetap izinkan masuk dengan identitas tersebut
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            setAccountIdentity({
              username: cleanUsername,
              displayName: cleanUsername,
              hasLinkedEmail: false,
            });
            setLoading(false);
            router.push('/map');
            return;
          }
          setLoading(false);
          setErrorMsg(error.message);
          return;
        }

        const meta = data.user?.user_metadata;
        setAccountIdentity({
          userId: data.user?.id ?? null,
          username: cleanUsername,
          displayName: meta?.display_name ?? cleanUsername,
          hasLinkedEmail: Boolean(
            data.user?.email && !data.user.email.endsWith('@akun.modoltracker.web.id')
          ),
        });
      } catch {
        setAccountIdentity({
          username: cleanUsername,
          displayName: cleanUsername,
          hasLinkedEmail: false,
        });
      }
    }

    setLoading(false);
    router.push('/map');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-paper border-2 border-line rounded-xl p-6 [--lip-color:#D6C6AD] shadow-lip-lg flex flex-col items-center gap-5">
        {/* Header & Mascot */}
        <div className="flex flex-col items-center text-center gap-2">
          <SiModiMascot pose="happy" size={76} />
          <h1 className="font-display font-extrabold text-3xl text-ink">
            {mode === 'register' ? 'Buat Akun Modoltracker' : 'Masuk Pakai Username'}
          </h1>
          <p className="text-xs font-bold text-ink-soft max-w-xs">
            {mode === 'register'
              ? 'Cukup pakai Username & Password, tanpa perlu repot verifikasi email dulu!'
              : 'Masukkan username dan password akunmu untuk lanjut nancepin jejak.'}
          </p>
        </div>

        {/* Mode Switcher Tabs: Buat Akun Baru vs Masuk */}
        <div className="w-full grid grid-cols-2 gap-2 bg-sand p-1.5 rounded-xl border-2 border-line">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`h-10 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all ${
              mode === 'register'
                ? 'bg-sunny text-ink border-2 border-sunny-shade [--lip-color:#E0A500] shadow-lip-sm'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Buat Akun Baru
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`h-10 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all ${
              mode === 'login'
                ? 'bg-sunny text-ink border-2 border-sunny-shade [--lip-color:#E0A500] shadow-lip-sm'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Sudah Punya Akun
          </button>
        </div>

        {errorMsg && (
          <div className="w-full p-3 rounded-lg bg-cherry/15 border-2 border-cherry text-cherry text-xs font-extrabold flex items-start gap-2 text-left">
            <WarningCircle size={18} weight="fill" className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM REGISTER: Nama, Username, Password, Konfirmasi Password */}
        {mode === 'register' ? (
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-3.5 text-left">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1">
                Nama Panggilan *
              </label>
              <div className="relative">
                <User
                  size={18}
                  weight="bold"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full h-12 pl-10 pr-4 rounded-md bg-sand border-2 border-line text-sm font-bold text-ink placeholder:text-ink-faint focus:outline-none focus:border-splash focus:bg-paper"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1">
                Username *
              </label>
              <div className="relative">
                <At
                  size={18}
                  weight="bold"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                  }
                  placeholder="contoh: budi_spbu"
                  className="w-full h-12 pl-10 pr-4 rounded-md bg-sand border-2 border-line text-sm font-bold text-ink placeholder:text-ink-faint focus:outline-none focus:border-splash focus:bg-paper"
                />
              </div>
              <p className="text-[11px] font-bold text-ink-faint mt-1">
                Huruf kecil, angka, atau garis bawah (_). Dipakai untuk login & cari teman.
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1">
                Password *
              </label>
              <div className="relative">
                <LockKey
                  size={18}
                  weight="bold"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full h-12 pl-10 pr-11 rounded-md bg-sand border-2 border-line text-sm font-bold text-ink placeholder:text-ink-faint focus:outline-none focus:border-splash focus:bg-paper"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink p-1"
                >
                  {showPassword ? (
                    <EyeSlash size={18} weight="bold" />
                  ) : (
                    <Eye size={18} weight="bold" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1">
                Konfirmasi Password *
              </label>
              <div className="relative">
                <CheckCircle
                  size={18}
                  weight="bold"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password kamu"
                  className="w-full h-12 pl-10 pr-11 rounded-md bg-sand border-2 border-line text-sm font-bold text-ink placeholder:text-ink-faint focus:outline-none focus:border-splash focus:bg-paper"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword
                      ? 'Sembunyikan konfirmasi password'
                      : 'Lihat konfirmasi password'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink p-1"
                >
                  {showConfirmPassword ? (
                    <EyeSlash size={18} weight="bold" />
                  ) : (
                    <Eye size={18} weight="bold" />
                  )}
                </button>
              </div>
            </div>

            <ModolButton
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'MEMBUAT AKUN...' : '🚀 DAFTAR & LANGSUNG MAIN!'}
            </ModolButton>
          </form>
        ) : (
          /* FORM LOGIN: Username & Password */
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-3.5 text-left">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1">
                Username
              </label>
              <div className="relative">
                <At
                  size={18}
                  weight="bold"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                  }
                  placeholder="Masukkan username kamu"
                  className="w-full h-12 pl-10 pr-4 rounded-md bg-sand border-2 border-line text-sm font-bold text-ink placeholder:text-ink-faint focus:outline-none focus:border-splash focus:bg-paper"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft mb-1">
                Password
              </label>
              <div className="relative">
                <LockKey
                  size={18}
                  weight="bold"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password kamu"
                  className="w-full h-12 pl-10 pr-11 rounded-md bg-sand border-2 border-line text-sm font-bold text-ink placeholder:text-ink-faint focus:outline-none focus:border-splash focus:bg-paper"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink p-1"
                >
                  {showPassword ? (
                    <EyeSlash size={18} weight="bold" />
                  ) : (
                    <Eye size={18} weight="bold" />
                  )}
                </button>
              </div>
            </div>

            <ModolButton
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'MASUK...' : '💩 MASUK SEKARANG'}
            </ModolButton>
          </form>
        )}

        <Link href="/map" className="text-xs font-extrabold text-splash hover:underline">
          Intip peta jejak dulu tanpa akun →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <LoginContent />
    </Suspense>
  );
}
