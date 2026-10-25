import { FeatureGate } from '@/components/common/FeatureGate';

export default function ChallengesPage() {
  return (
    <FeatureGate
      flag="challenges"
      phase={3}
      featureName="Challenge Antar Teman"
      description="Buat tantangan seru seperti 'Siapa paling banyak modol di SPBU berbeda bulan ini?'."
    >
      <div />
    </FeatureGate>
  );
}
