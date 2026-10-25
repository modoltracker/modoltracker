export function calculateEmergencyScore(params: {
  avgRating: number | null;
  isOpen: boolean;
  distanceMeters: number;
}): number {
  const rating = params.avgRating ?? 3.5;
  const openFactor = params.isOpen ? 1.0 : 0.2;
  const safeDistance = Math.max(params.distanceMeters, 20);
  return (rating * openFactor * 1000) / safeDistance;
}
