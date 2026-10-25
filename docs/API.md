# Dokumentasi RPC & API — Modoltracker

Daftar fungsi PostgreSQL RPC (Remote Procedure Call) dan endpoint di Modoltracker:

## Supabase RPC Functions
1. `nearby_places(lat float8, lng float8, radius_m int, category_filter place_category default null, min_rating numeric default null, free_only boolean default false)`
   - Mengembalikan daftar toilet dalam radius `radius_m` meter dari titik `(lat, lng)` diurutkan dari yang terdekat beserta kolom `distance_m`.
2. `places_in_bbox(min_lng float8, min_lat float8, max_lng float8, max_lat float8)`
   - Mengembalikan daftar toilet di dalam area viewport peta (bounding box).
3. `user_stats(target_user_id uuid)`
   - Mengembalikan ringkasan statistik pengguna: `total_checkins`, `unique_places`, `unique_cities`, `favorite_category`, dan `review_count`.
4. `can_view_checkin(viewer_id uuid, target_checkin_id uuid)`
   - Fungsi keamanan RLS untuk memvalidasi apakah `viewer_id` berhak melihat check-in tertentu berdasarkan `visibility`, status pertemanan (`are_friends`), blokir (`is_blocked`), zona privat, dan `visible_at`.
