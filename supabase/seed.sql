-- =============================================================================
-- MODOLTRACKER: SEED DATA (BADGES, FEATURE FLAGS & CONTOH TOILET INDONESIA)
-- =============================================================================

insert into badges (code, name, description, icon, tier, criteria) values
  ('first_drop', 'Pertama Kali 💩', 'Catat check-in modol pertamamu', 'poo', 1, '{"type":"total_checkins","count":1}'),
  ('spbu_explorer', 'Penjelajah SPBU ⛽', 'Modol di 10 SPBU berbeda', 'gaspump', 2, '{"type":"distinct_places","category":"gas_station","count":10}'),
  ('city_hopper', 'Modol Lintas Kota 🏙️', 'Modol di 5 kota berbeda', 'city', 2, '{"type":"distinct_cities","count":5}'),
  ('nusantara', 'Modol Nusantara 🇮🇩', 'Modol di 10 provinsi', 'flag', 3, '{"type":"distinct_provinces","count":10}'),
  ('night_owl', 'Kalong Toilet 🦉', '5 check-in jam 00:00–04:00', 'owl', 2, '{"type":"night_checkins","count":5}'),
  ('reviewer', 'Kritikus Toilet 📝', 'Menulis 20 ulasan toilet', 'memo', 2, '{"type":"reviews","count":20}'),
  ('pioneer', 'Pionir 🚩', 'Menambahkan 5 tempat baru yang terverifikasi', 'pioneer', 3, '{"type":"verified_places_added","count":5}'),
  ('mudik_warrior', 'Pejuang Mudik 🚗', 'Check-in di 5 rest area dalam 1 hari', 'car', 3, '{"type":"rest_area_day","count":5}')
on conflict (code) do nothing;

insert into places (
  id, name, slug, category, lat, lng, address, city, province, status, source,
  has_squat, has_sitting, has_jet_washer, has_bucket, has_tissue, has_soap, has_sink,
  is_accessible, has_baby_change, has_shower, has_prayer_room, gender_separated,
  fee_type, fee_amount, is_24h, avg_rating, avg_cleanliness, avg_water, review_count, checkin_count, is_verified_clean
) values
  (
    '11111111-1111-4111-8111-111111111101',
    'SPBU Pertamina 31.12902 Kuningan',
    'spbu-pertamina-31-12902-kuningan',
    'gas_station', -6.2245, 106.8294, 'Jl. HR. Rasuna Said Kav. X-2, Kuningan', 'Jakarta Selatan', 'DKI Jakarta', 'verified', 'osm',
    true, true, true, true, true, true, true, true, false, true, true, true,
    'free', 0, true, 4.6, 4.7, 4.8, 42, 128, true
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'Masjid Agung Al-Azhar Kebayoran',
    'masjid-agung-al-azhar-kebayoran',
    'mosque', -6.2351, 106.7992, 'Jl. Sisingamangaraja No.1, Selong', 'Jakarta Selatan', 'DKI Jakarta', 'verified', 'osm',
    true, true, true, true, false, true, true, true, false, true, true, true,
    'donation', 2000, true, 4.8, 4.9, 5.0, 67, 215, true
  ),
  (
    '11111111-1111-4111-8111-111111111103',
    'Grand Indonesia East Mall Lt. 2',
    'grand-indonesia-east-mall-lt-2',
    'mall', -6.1952, 106.8213, 'Jl. M.H. Thamrin No.1, Menteng', 'Jakarta Pusat', 'DKI Jakarta', 'verified', 'user',
    false, true, true, false, true, true, true, true, true, false, true, true,
    'free', 0, false, 4.9, 5.0, 4.9, 94, 310, true
  ),
  (
    '11111111-1111-4111-8111-111111111104',
    'Indomaret Point Stasiun Gambir',
    'indomaret-point-stasiun-gambir',
    'minimarket', -6.1767, 106.8306, 'Jl. Medan Merdeka Timur No.1', 'Jakarta Pusat', 'DKI Jakarta', 'verified', 'user',
    true, false, false, true, false, true, true, false, false, false, false, false,
    'paid', 2000, true, 3.4, 3.2, 3.8, 19, 54, false
  ),
  (
    '11111111-1111-4111-8111-111111111105',
    'Rest Area KM 57A Tol Jakarta-Cikampek',
    'rest-area-km-57a-cikampek',
    'rest_area', -6.3641, 107.3389, 'Tol Jakarta-Cikampek KM 57, Karawang', 'Karawang', 'Jawa Barat', 'verified', 'osm',
    true, true, true, true, true, true, true, true, true, true, true, true,
    'free', 0, true, 4.5, 4.4, 4.7, 156, 520, true
  ),
  (
    '11111111-1111-4111-8111-111111111106',
    'Toilet Umum Terminal Blok M',
    'toilet-umum-terminal-blok-m',
    'public_toilet', -6.2442, 106.8007, 'Melawai, Kebayoran Baru', 'Jakarta Selatan', 'DKI Jakarta', 'verified', 'user',
    true, false, false, true, false, false, true, false, false, false, false, true,
    'paid', 2000, false, 2.4, 2.2, 2.8, 12, 39, false
  )
on conflict (id) do nothing;
