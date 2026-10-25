export const FEATURE_FLAGS = {
  // Diaktifkan di Fase 1 sesuai ADR-002 (Fun & Social Tracker First)
  feed:            { phase: 1, default: true,  desc: 'Feed aktivitas teman' },
  reactions:       { phase: 1, default: true,  desc: 'Reaksi emoji pada check-in' },
  comments:        { phase: 2, default: false, desc: 'Komentar pada check-in' },
  badges:          { phase: 1, default: true,  desc: 'Badge & achievement' },
  leaderboard:     { phase: 1, default: true,  desc: 'Leaderboard teman' },
  share_card:      { phase: 2, default: false, desc: 'Gambar share ke sosmed' },
  invites:         { phase: 2, default: false, desc: 'Invite link & QR' },
  notifications:   { phase: 2, default: false, desc: 'Notifikasi in-app & push' },
  photos:          { phase: 2, default: false, desc: 'Upload foto toilet' },
  live_status:     { phase: 2, default: false, desc: 'Status real-time toilet' },
  // Fase 3
  emergency_mode:  { phase: 3, default: false, desc: 'Tombol darurat' },
  trip_mode:       { phase: 3, default: false, desc: 'Mode Mudik / Road Trip' },
  offline_mode:    { phase: 3, default: false, desc: 'Cache area offline' },
  challenges:      { phase: 3, default: false, desc: 'Challenge antar teman' },
  wrapped:         { phase: 3, default: false, desc: 'Modol Wrapped tahunan' },
  toilet_of_month: { phase: 3, default: false, desc: 'Toilet of the Month' },
  health_log:      { phase: 3, default: false, desc: 'Bristol scale log (privat)' },
  // Fase 4
  business_claims: { phase: 4, default: false, desc: 'Klaim lokasi bisnis' },
  review_replies:  { phase: 4, default: false, desc: 'Balasan pemilik' },
  premium:         { phase: 4, default: false, desc: 'Langganan premium' },
  ads:             { phase: 4, default: false, desc: 'Iklan lokal' },
} as const;

export type FeatureKey = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(
  key: FeatureKey,
  overrides?: Partial<Record<FeatureKey, boolean>>
): boolean {
  if (overrides && typeof overrides[key] === 'boolean') {
    return overrides[key]!;
  }
  return FEATURE_FLAGS[key].default;
}
