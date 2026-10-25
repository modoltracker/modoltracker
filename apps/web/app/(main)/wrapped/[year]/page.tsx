import { FeatureGate } from '@/components/common/FeatureGate';

export default function WrappedPage() {
  return (
    <FeatureGate
      flag="wrapped"
      phase={3}
      featureName="🎁 Modol Wrapped Tahunan"
      description="Rekap akhir tahun ala Spotify Wrapped: total check-in, kota terbanyak, dan persona toiletmu yang siap dibagikan ke IG Story!"
    >
      <div />
    </FeatureGate>
  );
}
