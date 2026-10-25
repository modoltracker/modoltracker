import { FeatureGate } from '@/components/common/FeatureGate';

export default function FeedPage() {
  return (
    <FeatureGate
      flag="feed"
      phase={2}
      featureName="Feed Aktivitas Teman & Reaksi 💩"
      description="Lihat di mana saja temanmu habis modol (dengan jeda anti-tracking) dan kirim reaksi emoji 3D!"
    >
      <div />
    </FeatureGate>
  );
}
