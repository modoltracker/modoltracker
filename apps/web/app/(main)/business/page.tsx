import { FeatureGate } from '@/components/common/FeatureGate';

export default function BusinessPortalPage() {
  return (
    <FeatureGate
      flag="business_claims"
      phase={4}
      featureName="🏪 Klaim Lokasi & Badge Bersih Terverifikasi"
      description="Dashboard khusus pengelola SPBU, rest area, kafe, dan mall untuk membalas ulasan serta mendapatkan sertifikasi toilet bersih."
    >
      <div />
    </FeatureGate>
  );
}
