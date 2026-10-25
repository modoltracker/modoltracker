export interface RatingBreakdown {
  rating_cleanliness: number;
  rating_water: number;
  rating_privacy?: number | null;
  rating_smell?: number | null;
  rating_supplies?: number | null;
}

/**
 * Menghitung overall_rating sebagai rata-rata dari semua kategori yang diisi (dibulatkan 1 desimal).
 */
export function calculateOverallRating(ratings: RatingBreakdown): number {
  const values: number[] = [
    ratings.rating_cleanliness,
    ratings.rating_water,
  ];
  if (typeof ratings.rating_privacy === 'number') values.push(ratings.rating_privacy);
  if (typeof ratings.rating_smell === 'number') values.push(ratings.rating_smell);
  if (typeof ratings.rating_supplies === 'number') values.push(ratings.rating_supplies);

  const sum = values.reduce((acc, v) => acc + v, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/**
 * Menghitung jarak antara 2 titik koordinat dalam meter (Haversine formula).
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // meter
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Mengecek apakah koordinat masuk dalam Zona Privat pengguna.
 */
export function isInsidePrivateZone(
  lat: number,
  lng: number,
  zones: { lat: number; lng: number; radius_m: number }[]
): boolean {
  return zones.some(
    (z) => calculateDistanceMeters(lat, lng, z.lat, z.lng) <= z.radius_m
  );
}

/**
 * Membulatkan koordinat ke sekitar ~100m untuk privasi check-in rumah/pribadi.
 */
export function obfuscateCoordinates(lat: number, lng: number): { lat: number; lng: number } {
  return {
    lat: Math.round(lat * 1000) / 1000,
    lng: Math.round(lng * 1000) / 1000,
  };
}

export const MAX_CHECKIN_RADIUS_METERS = 150;
export const MAX_GPS_ACCURACY_METERS = 200;
export const MAX_TRAVEL_SPEED_KMH = 250;

export interface GpsVerificationResult {
  allowed: boolean;
  distanceMeters: number;
  reason?: string;
}

/**
 * Memvalidasi apakah pengguna benar-benar berada di lokasi toilet berdasarkan GPS asli,
 * akurasi sensor, dan deteksi teleportasi (impossible travel speed).
 */
export function verifyCheckinGps(params: {
  userLat: number;
  userLng: number;
  gpsAccuracyMeters?: number | null;
  placeLat: number;
  placeLng: number;
  maxRadiusMeters?: number;
  previousCheckin?: {
    lat: number;
    lng: number;
    createdAtIso: string;
  } | null;
}): GpsVerificationResult {
  const maxRadius = params.maxRadiusMeters ?? MAX_CHECKIN_RADIUS_METERS;
  const distanceMeters = calculateDistanceMeters(
    params.userLat,
    params.userLng,
    params.placeLat,
    params.placeLng
  );

  if (
    typeof params.gpsAccuracyMeters === 'number' &&
    params.gpsAccuracyMeters > MAX_GPS_ACCURACY_METERS
  ) {
    return {
      allowed: false,
      distanceMeters,
      reason: `Sinyal GPS kurang akurat (±${Math.round(params.gpsAccuracyMeters)}m). Pastikan GPS aktif di luar ruangan.`,
    };
  }

  if (distanceMeters > maxRadius) {
    return {
      allowed: false,
      distanceMeters,
      reason: `Kamu berada ${distanceMeters}m dari toilet ini. Check-in hanya bisa dilakukan dalam radius ${maxRadius}m dari lokasi.`,
    };
  }

  if (params.previousCheckin) {
    const prevDistMeters = calculateDistanceMeters(
      params.userLat,
      params.userLng,
      params.previousCheckin.lat,
      params.previousCheckin.lng
    );
    const elapsedHours =
      Math.abs(Date.now() - new Date(params.previousCheckin.createdAtIso).getTime()) /
      (1000 * 3600);

    // Jika perpindahan > 2 km dan kecepatannya mustahil (> 250 km/jam), tolak (indikasi Fake GPS)
    if (prevDistMeters > 2000 && elapsedHours > 0) {
      const speedKmh = prevDistMeters / 1000 / elapsedHours;
      if (speedKmh > MAX_TRAVEL_SPEED_KMH) {
        return {
          allowed: false,
          distanceMeters,
          reason:
            'Terdeteksi perpindahan lokasi tidak wajar (anti-spoofing). Tunggu beberapa saat dan gunakan GPS asli.',
        };
      }
    }
  }

  return {
    allowed: true,
    distanceMeters,
  };
}

