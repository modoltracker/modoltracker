import { FeatureGate } from '@/components/common/FeatureGate';

export default function NotificationsPage() {
  return (
    <FeatureGate
      flag="notifications"
      phase={2}
      featureName="Notifikasi In-App & Push"
      description="Notifikasi permintaan pertemanan, reaksi teman, dan pencapaian badge baru."
    >
      <div />
    </FeatureGate>
  );
}
