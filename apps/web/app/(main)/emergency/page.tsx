import { FeatureGate } from '@/components/common/FeatureGate';

export default function EmergencyModePage() {
  return (
    <FeatureGate
      flag="emergency_mode"
      phase={3}
      featureName="🚨 Mode Darurat 1-Tombol"
      description="Kebelet parah? Satu tombol langsung memilihkan toilet terdekat yang buka dan paling bersih tanpa perlu scroll."
    >
      <div />
    </FeatureGate>
  );
}
