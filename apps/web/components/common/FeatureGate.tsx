'use client';

import React from 'react';
import Link from 'next/link';
import { isFeatureEnabled, type FeatureKey } from '@modoltracker/core';
import { SiModiMascot } from './SiModiMascot';
import { ModolButton } from './ModolButton';
import { t } from '@/lib/i18n';

export function ComingSoonCard({
  featureName,
  phase,
  description,
}: {
  featureName: string;
  phase: number;
  description: string;
}) {
  return (
    <div className="max-w-md mx-auto my-8 bg-paper border-2 border-line rounded-xl p-6 text-center [--lip-color:#D6C6AD] shadow-lip-md flex flex-col items-center gap-4">
      <div className="px-3 py-1 rounded-full bg-sunny/20 border-2 border-sunny text-xs font-extrabold uppercase tracking-wider text-choco">
        🟡 Fase {phase} · Segera Hadir
      </div>
      <SiModiMascot pose="sleep" size={88} />
      <h1 className="font-display font-extrabold text-2xl text-ink">
        {featureName}
      </h1>
      <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
      <p className="text-xs text-ink-faint bg-sand px-3 py-2 rounded-md border border-line">
        {t('app.coming_soon_desc')}
      </p>
      <Link href="/map" className="w-full mt-2">
        <ModolButton variant="primary" fullWidth>
          Kembali ke Peta Toilet
        </ModolButton>
      </Link>
    </div>
  );
}

export function FeatureGate({
  flag,
  featureName,
  phase = 2,
  description = '',
  children,
}: {
  flag: FeatureKey;
  featureName: string;
  phase?: number;
  description?: string;
  children: React.ReactNode;
}) {
  if (!isFeatureEnabled(flag)) {
    return (
      <ComingSoonCard
        featureName={featureName}
        phase={phase}
        description={description}
      />
    );
  }
  return <>{children}</>;
}
