# Aturan untuk AI Agent: Modoltracker

Aturan ini WAJIB diikuti oleh setiap AI agent / developer yang mengerjakan proyek ini.

## Dokumen Acuan (baca sebelum menulis kode)
1. `PROJECT_BLUEPRINT.md`: fitur, arsitektur, database, roadmap, urutan kerja.
2. `DESIGN_SYSTEM.md`: semua hal terkait UI/UX. Untuk urusan desain, dokumen ini lebih tinggi daripada blueprint.

## Aturan Inti
- Kerjakan sesuai fase. Fitur bertanda 🟡 hanya disiapkan (placeholder + feature flag OFF), jangan diimplementasikan kecuali diminta.
- TypeScript strict. Perubahan database hanya lewat migration baru. Setiap tabel wajib RLS.
- Teks UI tidak boleh di-hardcode; gunakan file i18n (`messages/id.json`).
- Keputusan yang menyimpang dari blueprint dicatat di `docs/DECISIONS.md`.

## Aturan UI (ringkas; detail di DESIGN_SYSTEM.md)
- Gaya: playful & cerah ala Duolingo. Tombol 3D dengan "bibir" bawah, border tebal 2px, tanpa bayangan blur.
- Hanya gunakan design token (warna, font Baloo 2 + Nunito, radius, spacing) dari DESIGN_SYSTEM.md.
- Ikon: Phosphor Icons saja (weight `bold`, aktif `fill`). Emoji 3D: Fluent Emoji.
- DILARANG: gradien ungu/biru, glassmorphism, `shadow-lg/xl`, font Inter/Roboto untuk heading, ikon Lucide default, layout landing template, copy generik ("seamless", "revolutionize", "unlock").
- Setiap layar wajib punya empty, loading, dan error state serta micro-interaction pada aksi utama.
- Jalankan "Checklist Review UI" (DESIGN_SYSTEM.md bagian 12) sebelum menyatakan UI selesai.
