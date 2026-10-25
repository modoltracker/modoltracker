import { FeatureGate } from '@/components/common/FeatureGate';

export default function TripModePage() {
  return (
    <FeatureGate
      flag="trip_mode"
      phase={3}
      featureName="🚗 Mode Mudik / Road Trip"
      description="Masukkan rute perjalanan mudikmu dan temukan daftar toilet rest area & SPBU terbaik di sepanjang jalur."
    >
      <div />
    </FeatureGate>
  );
}
