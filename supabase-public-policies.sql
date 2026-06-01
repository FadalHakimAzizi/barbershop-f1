-- ============================================================
-- FI Barbershop — Public Read Policies
-- Jalankan di Supabase Dashboard → SQL Editor
-- ============================================================
--
-- Tujuan: mengizinkan pengunjung publik (belum login) membaca data
-- yang dibutuhkan oleh halaman beranda (landing page), yaitu:
--   • Rekomendasi Layanan  (hitung frekuensi dari tabel bookings)
--   • Statistik Hero        (jumlah pelanggan, layanan, rating)
--   • Testimoni             (nama pelanggan dari tabel profiles)
--
-- Tanpa policy ini, Row Level Security (RLS) memblokir query saat
-- halaman dibuka tanpa autentikasi, sehingga section tersebut kosong.
--
-- Script ini IDEMPOTEN — aman dijalankan berkali-kali (drop dulu
-- bila policy sudah ada, lalu buat ulang).
-- ============================================================

-- Bookings: baca publik untuk rekomendasi & statistik
DROP POLICY IF EXISTS "public_read_bookings" ON bookings;
CREATE POLICY "public_read_bookings" ON bookings FOR SELECT USING (true);

-- Profiles: baca publik untuk nama pelanggan di testimoni & jumlah pelanggan
DROP POLICY IF EXISTS "public_read_profiles" ON profiles;
CREATE POLICY "public_read_profiles" ON profiles FOR SELECT USING (true);

-- Catatan keamanan:
-- • Anon key Supabase memang dirancang untuk diekspos di sisi klien.
-- • Policy ini hanya memberi akses SELECT (baca), bukan tulis/ubah/hapus.
-- • Tabel services, reviews, dan blocked_slots sudah punya policy
--   "public read" dari migrasi sebelumnya (lihat supabase-migrations.sql).
