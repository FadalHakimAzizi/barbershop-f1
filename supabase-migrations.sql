-- ============================================================
-- Jalankan SQL ini di Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Tabel blocked_slots (admin blokir tanggal/jam)
CREATE TABLE IF NOT EXISTS blocked_slots (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  date       DATE        NOT NULL,
  time       TEXT,          -- NULL = seluruh hari diblokir
  reason     TEXT        NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on blocked_slots" ON blocked_slots
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));
CREATE POLICY "Public read blocked_slots" ON blocked_slots
  FOR SELECT USING (true);

-- 2. Tabel reviews (rating & ulasan customer)
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID    REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID    REFERENCES profiles(id),
  service_id  UUID    REFERENCES services(id),
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT    DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id)   -- satu review per booking
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customer insert own review" ON reviews
  FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Public read reviews" ON reviews
  FOR SELECT USING (true);

-- 3. Aktifkan Realtime untuk tabel bookings
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- 4. (Opsional) Tambah kolom phone ke profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
