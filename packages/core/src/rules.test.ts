import { describe, it, expect } from 'vitest';
import {
  calculateOverallRating,
  calculateDistanceMeters,
  isInsidePrivateZone,
  verifyCheckinGps,
} from './rules';

describe('Modoltracker Core Rules', () => {
  it('calculates overall rating accurately from mandatory and optional fields', () => {
    expect(calculateOverallRating({ rating_cleanliness: 5, rating_water: 4 })).toBe(4.5);
    expect(
      calculateOverallRating({
        rating_cleanliness: 5,
        rating_water: 5,
        rating_privacy: 4,
        rating_smell: 4,
        rating_supplies: 5,
      })
    ).toBe(4.6);
  });

  it('detects private zone proximity properly', () => {
    const homeZone = [{ lat: -6.2, lng: 106.8, radius_m: 500 }];
    expect(isInsidePrivateZone(-6.2005, 106.8005, homeZone)).toBe(true);
    expect(isInsidePrivateZone(-6.25, 106.85, homeZone)).toBe(false);
  });

  it('calculates distance in meters', () => {
    const d = calculateDistanceMeters(-6.2, 106.8, -6.201, 106.8);
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(125);
  });

  it('blocks check-in when user GPS is outside 150m radius or spoofing travel speed', () => {
    // Dalam radius (< 150m) -> diizinkan
    const ok = verifyCheckinGps({
      userLat: -6.2245,
      userLng: 106.8294,
      gpsAccuracyMeters: 15,
      placeLat: -6.2248,
      placeLng: 106.8295,
    });
    expect(ok.allowed).toBe(true);

    // Di luar radius (> 150m) -> ditolak
    const tooFar = verifyCheckinGps({
      userLat: -6.2245,
      userLng: 106.8294,
      gpsAccuracyMeters: 15,
      placeLat: -6.2351,
      placeLng: 106.7992,
    });
    expect(tooFar.allowed).toBe(false);

    // Teleportasi (Fake GPS) dari tempat jauh 1 menit lalu -> ditolak
    const spoofed = verifyCheckinGps({
      userLat: -6.2245,
      userLng: 106.8294,
      gpsAccuracyMeters: 10,
      placeLat: -6.2245,
      placeLng: 106.8294,
      previousCheckin: {
        lat: -6.9175, // Bandung
        lng: 107.6191,
        createdAtIso: new Date(Date.now() - 60 * 1000).toISOString(),
      },
    });
    expect(spoofed.allowed).toBe(false);
  });
});
