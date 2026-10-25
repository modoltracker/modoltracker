import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database, PlaceCategory } from '@modoltracker/db-types';
import { calculateDistanceMeters } from '@modoltracker/core';

export type PlaceRow = Database['public']['Tables']['places']['Row'];
export type CheckinRow = Database['public']['Tables']['checkins']['Row'];
export type ReviewRow = Database['public']['Tables']['reviews']['Row'];

export const INITIAL_DEMO_PLACES: PlaceRow[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    name: 'SPBU Pertamina 31.12902 Kuningan',
    slug: 'spbu-pertamina-31-12902-kuningan',
    category: 'gas_station',
    lat: -6.2245,
    lng: 106.8294,
    address: 'Jl. HR. Rasuna Said Kav. X-2, Kuningan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    status: 'verified',
    source: 'osm',
    osm_id: 'osm-101',
    has_squat: true,
    has_sitting: true,
    has_jet_washer: true,
    has_bucket: true,
    has_tissue: true,
    has_soap: true,
    has_sink: true,
    is_accessible: true,
    has_baby_change: false,
    has_shower: true,
    has_prayer_room: true,
    gender_separated: true,
    fee_type: 'free',
    fee_amount: 0,
    is_24h: true,
    opening_hours: null,
    avg_rating: 4.6,
    avg_cleanliness: 4.7,
    avg_water: 4.8,
    review_count: 42,
    checkin_count: 128,
    claimed_by: null,
    is_verified_clean: true,
    created_by: null,
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-25T10:00:00Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    name: 'Masjid Agung Al-Azhar Kebayoran',
    slug: 'masjid-agung-al-azhar-kebayoran',
    category: 'mosque',
    lat: -6.2351,
    lng: 106.7992,
    address: 'Jl. Sisingamangaraja No.1, Selong, Kebayoran Baru',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    status: 'verified',
    source: 'osm',
    osm_id: 'osm-102',
    has_squat: true,
    has_sitting: true,
    has_jet_washer: true,
    has_bucket: true,
    has_tissue: false,
    has_soap: true,
    has_sink: true,
    is_accessible: true,
    has_baby_change: false,
    has_shower: true,
    has_prayer_room: true,
    gender_separated: true,
    fee_type: 'donation',
    fee_amount: 2000,
    is_24h: true,
    opening_hours: null,
    avg_rating: 4.8,
    avg_cleanliness: 4.9,
    avg_water: 5.0,
    review_count: 67,
    checkin_count: 215,
    claimed_by: null,
    is_verified_clean: true,
    created_by: null,
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-25T10:00:00Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111103',
    name: 'Grand Indonesia East Mall Lt. 2',
    slug: 'grand-indonesia-east-mall-lt-2',
    category: 'mall',
    lat: -6.1952,
    lng: 106.8213,
    address: 'Jl. M.H. Thamrin No.1, Menteng',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    status: 'verified',
    source: 'user',
    osm_id: null,
    has_squat: false,
    has_sitting: true,
    has_jet_washer: true,
    has_bucket: false,
    has_tissue: true,
    has_soap: true,
    has_sink: true,
    is_accessible: true,
    has_baby_change: true,
    has_shower: false,
    has_prayer_room: true,
    gender_separated: true,
    fee_type: 'free',
    fee_amount: 0,
    is_24h: false,
    opening_hours: null,
    avg_rating: 4.9,
    avg_cleanliness: 5.0,
    avg_water: 4.9,
    review_count: 94,
    checkin_count: 310,
    claimed_by: null,
    is_verified_clean: true,
    created_by: null,
    created_at: '2026-10-02T08:00:00Z',
    updated_at: '2026-10-25T10:00:00Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111104',
    name: 'Indomaret Point Stasiun Gambir',
    slug: 'indomaret-point-stasiun-gambir',
    category: 'minimarket',
    lat: -6.1767,
    lng: 106.8306,
    address: 'Jl. Medan Merdeka Timur No.1',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    status: 'verified',
    source: 'user',
    osm_id: null,
    has_squat: true,
    has_sitting: false,
    has_jet_washer: false,
    has_bucket: true,
    has_tissue: false,
    has_soap: true,
    has_sink: true,
    is_accessible: false,
    has_baby_change: false,
    has_shower: false,
    has_prayer_room: false,
    gender_separated: false,
    fee_type: 'paid',
    fee_amount: 2000,
    is_24h: true,
    opening_hours: null,
    avg_rating: 3.4,
    avg_cleanliness: 3.2,
    avg_water: 3.8,
    review_count: 19,
    checkin_count: 54,
    claimed_by: null,
    is_verified_clean: false,
    created_by: null,
    created_at: '2026-10-03T08:00:00Z',
    updated_at: '2026-10-25T10:00:00Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111105',
    name: 'Rest Area KM 57A Tol Jakarta-Cikampek',
    slug: 'rest-area-km-57a-cikampek',
    category: 'rest_area',
    lat: -6.3641,
    lng: 107.3389,
    address: 'Tol Jakarta-Cikampek KM 57, Karawang Timur',
    city: 'Karawang',
    province: 'Jawa Barat',
    status: 'verified',
    source: 'osm',
    osm_id: 'osm-105',
    has_squat: true,
    has_sitting: true,
    has_jet_washer: true,
    has_bucket: true,
    has_tissue: true,
    has_soap: true,
    has_sink: true,
    is_accessible: true,
    has_baby_change: true,
    has_shower: true,
    has_prayer_room: true,
    gender_separated: true,
    fee_type: 'free',
    fee_amount: 0,
    is_24h: true,
    opening_hours: null,
    avg_rating: 4.5,
    avg_cleanliness: 4.4,
    avg_water: 4.7,
    review_count: 156,
    checkin_count: 520,
    claimed_by: null,
    is_verified_clean: true,
    created_by: null,
    created_at: '2026-10-04T08:00:00Z',
    updated_at: '2026-10-25T10:00:00Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111106',
    name: 'Toilet Umum Terminal Blok M',
    slug: 'toilet-umum-terminal-blok-m',
    category: 'public_toilet',
    lat: -6.2442,
    lng: 106.8007,
    address: 'Melawai, Kebayoran Baru',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    status: 'verified',
    source: 'user',
    osm_id: null,
    has_squat: true,
    has_sitting: false,
    has_jet_washer: false,
    has_bucket: true,
    has_tissue: false,
    has_soap: false,
    has_sink: true,
    is_accessible: false,
    has_baby_change: false,
    has_shower: false,
    has_prayer_room: false,
    gender_separated: true,
    fee_type: 'paid',
    fee_amount: 2000,
    is_24h: false,
    opening_hours: null,
    avg_rating: 2.4,
    avg_cleanliness: 2.2,
    avg_water: 2.8,
    review_count: 12,
    checkin_count: 39,
    claimed_by: null,
    is_verified_clean: false,
    created_by: null,
    created_at: '2026-10-05T08:00:00Z',
    updated_at: '2026-10-25T10:00:00Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111107',
    name: 'SPBU Shell MT Haryono Cawang',
    slug: 'spbu-shell-mt-haryono-cawang',
    category: 'gas_station',
    lat: -6.2432,
    lng: 106.8588,
    address: 'Jl. MT Haryono Kav. 28, Cawang',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    status: 'verified',
    source: 'user',
    osm_id: null,
    has_squat: false,
    has_sitting: true,
    has_jet_washer: true,
    has_bucket: false,
    has_tissue: true,
    has_soap: true,
    has_sink: true,
    is_accessible: true,
    has_baby_change: false,
    has_shower: false,
    has_prayer_room: true,
    gender_separated: true,
    fee_type: 'free',
    fee_amount: 0,
    is_24h: true,
    opening_hours: null,
    avg_rating: 4.7,
    avg_cleanliness: 4.8,
    avg_water: 4.9,
    review_count: 38,
    checkin_count: 112,
    claimed_by: null,
    is_verified_clean: true,
    created_by: null,
    created_at: '2026-10-06T08:00:00Z',
    updated_at: '2026-10-25T10:00:00Z',
  },
];

let cachedSupabase: SupabaseClient<Database> | null = null;

export function getSupabaseClient(url?: string, anonKey?: string): SupabaseClient<Database> | null {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const supabaseUrl = url ?? env?.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = anonKey ?? env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  if (!cachedSupabase) {
    cachedSupabase = createClient<Database>(supabaseUrl, supabaseKey);
  }
  return cachedSupabase;
}

export interface PlaceFilterOptions {
  category?: PlaceCategory | 'all';
  freeOnly?: boolean;
  open24hOnly?: boolean;
  minRating?: number;
  searchQuery?: string;
  userLat?: number;
  userLng?: number;
}

export async function fetchPlaces(filters?: PlaceFilterOptions): Promise<(PlaceRow & { distance_m?: number })[]> {
  let list: PlaceRow[] = [...INITIAL_DEMO_PLACES];

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('places')
        .select('*')
        .neq('status', 'removed')
        .limit(200);
      if (!error && data && data.length > 0) {
        list = data as PlaceRow[];
      }
    } catch {
      // Fallback ke INITIAL_DEMO_PLACES jika tabel belum dimigrasi
    }
  }

  return filterAndSortPlaces(list, filters);
}

export function filterAndSortPlaces(
  places: PlaceRow[],
  filters?: PlaceFilterOptions
): (PlaceRow & { distance_m?: number })[] {
  let result = places.map((p) => {
    const distance_m =
      filters?.userLat !== undefined && filters?.userLng !== undefined
        ? calculateDistanceMeters(filters.userLat, filters.userLng, p.lat, p.lng)
        : undefined;
    return { ...p, distance_m };
  });

  if (filters?.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters?.freeOnly) {
    result = result.filter((p) => p.fee_type === 'free');
  }
  if (filters?.open24hOnly) {
    result = result.filter((p) => p.is_24h === true);
  }
  if (filters?.minRating) {
    result = result.filter((p) => (p.avg_rating ?? 0) >= filters.minRating!);
  }
  if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q))
    );
  }

  if (filters?.userLat !== undefined && filters?.userLng !== undefined) {
    result.sort((a, b) => (a.distance_m ?? 999999) - (b.distance_m ?? 999999));
  }

  return result;
}
