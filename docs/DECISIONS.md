# Architectural Decision Records (ADR) — Modoltracker

Dokumen ini mencatat keputusan arsitektur penting atau perubahan terhadap `PROJECT_BLUEPRINT.md`.

## ADR-001: Hybrid Supabase + Local Demo Fallback untuk Development
- **Tanggal**: 2026-10-26
- **Konteks**: Proyek menggunakan Supabase Cloud (`nnpsruaxjqgqsrqeutlh.supabase.co`). Selama pengembangan awal sebelum seluruh migration SQL dieksekusi di dashboard Supabase atau ketika bekerja offline, aplikasi tetap harus dapat dirender dan diuji secara penuh.
- **Keputusan**: `packages/api-client` menggunakan Supabase client utama untuk query ke database, disertai fallback data seed lokal (Jabodetabek & Jalur Mudik) apabila tabel di remote Supabase belum di-migrate atau kosong.
## ADR-002: Pivot Prioritas Utama ke "Fun & Social Modol Tracker" (Nomor 1: Jejak & Teman, Nomor 2: Info Toilet)
- **Tanggal**: 2026-10-26
- **Konteks**: Pengguna menggunakan aplikasi saat sedang atau sesudah BAB (modol) untuk menandai lokasi ("nancepin bendera"), mengoleksi capaian jumlah tempat/kota, serta berbagi dan saling ledek dengan teman. Pengguna sudah tahu lokasi SPBU/minimarket di dunia nyata tanpa harus mencari di aplikasi terlebih dahulu.
- **Keputusan**:
  1. **Layar utama (`/map`)** berfokus pada **Peta Jejak Modol (Jejakku & Jejak Teman)** beserta papan skor capaian, bukan direktori pencarian fasilitas yang rumit.
  2. **Alur Check-in ("💩 Modol di sini!")** langsung mengunci koordinat GPS perangkat saat itu juga dan membiarkan pengguna menamai tempat tersebut secara bebas (otomatis membuat/menautkan tempat) + opsional memberi ulasan singkat kondisi toiletnya.
  3. **Fitur Sosial & Gamifikasi** (`feed`, `reactions`, `badges`, `leaderboard`) dinaikkan ke **Fase 1 (aktif sejak MVP)**.
- **Konsekuensi**: Tidak ada lagi masalah *cold-start* (peta kosong justru menjadi kanvas yang seru untuk diisi bersama teman), alur check-in jauh lebih cepat (< 5 detik), dan daya tarik viral antar teman langsung berjalan sejak hari pertama.

