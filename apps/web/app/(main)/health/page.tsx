import { FeatureGate } from '@/components/common/FeatureGate';

export default function HealthLogPage() {
  return (
    <FeatureGate
      flag="health_log"
      phase={3}
      featureName="🩺 Health Log & Bristol Scale (100% Privat)"
      description="Catatan kesehatan pencernaan pribadi yang dikunci penuh dengan RLS dan tidak pernah dibagikan ke siapa pun."
    >
      <div />
    </FeatureGate>
  );
}
