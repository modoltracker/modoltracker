export interface ReverseGeocodeResult {
  placeSuggestedName: string | null;
  road: string | null;
  suburb: string | null;
  city: string;
  province: string;
  displayAddress: string;
}

/**
 * Mengambil nama tempat, jalan, kecamatan, dan kota secara gratis tanpa API Key & tanpa kartu kredit
 * menggunakan OpenStreetMap Nominatim Reverse Geocoding API.
 */
export async function reverseGeocodeGps(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1&accept-language=id`;

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Nominatim response not ok');
    }

    const data = await res.json();
    const addr = data.address || {};

    const city =
      addr.city ||
      addr.town ||
      addr.county ||
      addr.municipality ||
      addr.city_district ||
      'Jakarta';

    const province = addr.state || addr.region || 'Indonesia';
    const road = addr.road || addr.pedestrian || addr.neighbourhood || null;
    const suburb = addr.suburb || addr.village || addr.city_district || null;
    const poiName =
      data.name ||
      addr.amenity ||
      addr.shop ||
      addr.building ||
      (road ? `Area ${road}` : null);

    const parts = [road, suburb, city].filter(Boolean);

    return {
      placeSuggestedName: poiName,
      road,
      suburb,
      city,
      province,
      displayAddress: parts.length > 0 ? parts.join(', ') : `${city}, ${province}`,
    };
  } catch {
    return {
      placeSuggestedName: null,
      road: null,
      suburb: null,
      city: 'Jakarta',
      province: 'DKI Jakarta',
      displayAddress: `Titik GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    };
  }
}
