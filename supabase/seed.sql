-- ============================================================
-- FI Barbershop — Seed Data
-- Jalankan SETELAH schema.sql
-- Buat akun admin & demo customer via Supabase Dashboard:
--   Authentication > Users > Add User
--   admin@fi.com / admin123  -> set role = 'admin' di profiles
--   rizky@mail.com / 12345
-- ============================================================

-- Seed services
insert into public.services (name, description, price, duration, tone) values
  ('Classic Haircut',   'Potongan klasik dengan finishing rapi dan keramas ringan.', 65000,  45, 210),
  ('Skin Fade',         'Fade bersih dari kulit menuju atas, presisi tinggi.',       85000,  60,  35),
  ('Beard Grooming',    'Cukur & rapikan jenggot dengan handuk hangat.',             50000,  30, 150),
  ('Hair + Beard Combo','Paket lengkap rambut & jenggot dalam satu sesi.',          120000,  75, 280),
  ('Royal Shave',       'Cukur tradisional pisau lurus dengan handuk panas.',        70000,  40,  12),
  ('Kids Haircut',      'Potong rambut khusus anak di bawah 12 tahun.',             45000,  30,  95),
  ('Hair Coloring',     'Pewarnaan rambut profesional sesuai gaya kamu.',           150000,  90, 320),
  ('Hair Wash & Style', 'Keramas menyegarkan plus styling cepat.',                  40000,  25, 245)
on conflict do nothing;

-- NOTE: Seed bookings perlu customer_id & service_id yang valid.
-- Tambahkan manual setelah buat akun atau gunakan script berikut
-- dengan mengganti UUID yang sesuai:
--
-- insert into public.bookings (customer_id, service_id, date, time, status) values
--   ('<customer-uuid>', (select id from services where name='Skin Fade'), '2026-05-02', '10:00', 'selesai'),
--   ('<customer-uuid>', (select id from services where name='Classic Haircut'), '2026-05-04', '09:30', 'selesai');
