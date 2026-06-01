# ✂ FI Barbershop — Website Booking & Rekomendasi Layanan

Website pemesanan (booking) layanan barbershop berbasis **Next.js 16 (App Router)** dan **Supabase**, dilengkapi fitur **rekomendasi layanan otomatis** menggunakan metode *Transaction-Based Recommendation*, panel admin, ulasan pelanggan, dan konfirmasi email.

> **Tagline:** Sharp · Clean · Classic

---

## Daftar Isi

1. [Tentang Aplikasi](#1-tentang-aplikasi)
2. [Technology Stack](#2-technology-stack)
3. [Library yang Digunakan](#3-library-yang-digunakan)
4. [Arsitektur & Struktur Folder](#4-arsitektur--struktur-folder)
5. [Skema Database](#5-skema-database)
6. [API / Server Actions](#6-api--server-actions)
7. [Fitur Rekomendasi Layanan](#7-fitur-rekomendasi-layanan)
8. [Cara Setup Project](#8-cara-setup-project)
9. [Cara Menjalankan Aplikasi](#9-cara-menjalankan-aplikasi)
10. [Cara Testing Aplikasi](#10-cara-testing-aplikasi)

---

## 1. Tentang Aplikasi

FI Barbershop adalah aplikasi web yang memungkinkan pelanggan memesan layanan barbershop secara online tanpa perlu antri. Aplikasi memiliki dua peran pengguna utama:

| Peran | Hak Akses |
|-------|-----------|
| **Customer** | Melihat layanan, melakukan booking, membatalkan booking, memberi ulasan, mengubah profil, melihat riwayat real-time |
| **Admin** | Mengelola layanan (CRUD), mengubah status transaksi, memblokir tanggal/jam, melihat analitik & rekomendasi |

### Fitur Utama
- 🔐 **Autentikasi** berbasis email/password (Supabase Auth) dengan pemisahan peran admin/customer.
- 📅 **Booking multi-layanan** dengan validasi slot penuh, jam lewat, dan tanggal yang diblokir.
- ⭐ **Rekomendasi layanan otomatis** berdasarkan data transaksi (transaction-based).
- 📊 **Dashboard analitik admin** — total revenue, tren booking 7 hari, breakdown status, popularitas layanan.
- 💬 **Ulasan & rating** pelanggan (1–5 bintang) yang tampil di halaman testimoni.
- 🚫 **Blokir jadwal** oleh admin (per-jam atau seharian penuh dengan alasan).
- 📧 **Konfirmasi email** otomatis via Resend setelah booking.
- 🔄 **Status booking real-time** menggunakan Supabase Realtime.
- 🌗 **Tema gelap/terang** dengan persistensi berbasis cookie (anti-flicker saat SSR).

---

## 2. Technology Stack

| Lapisan | Teknologi |
|---------|-----------|
| **Framework** | Next.js 16.2 (App Router, Turbopack, React Server Components) |
| **Bahasa** | TypeScript 5 |
| **UI Runtime** | React 18 |
| **Backend / Database** | Supabase (PostgreSQL + Auth + Realtime + Row Level Security) |
| **Styling** | Tailwind CSS 3.4 + CSS Custom Properties (variabel tema) |
| **Email** | Resend API |
| **Deployment target** | Vercel (rekomendasi) |

### Pola Arsitektur
- **Server Components** sebagai default untuk pengambilan data (fetching langsung dari Supabase di server).
- **Client Components** (`'use client'`) hanya untuk komponen interaktif (modal, toggle, animasi).
- **Server Actions** (`'use server'`) sebagai pengganti REST API endpoint untuk mutasi data.
- **Middleware/Proxy** (`proxy.ts`) untuk proteksi route & refresh sesi auth.

---

## 3. Library yang Digunakan

### Dependencies
| Library | Versi | Fungsi |
|---------|-------|--------|
| `next` | ^16.2.6 | Framework utama (App Router) |
| `react` / `react-dom` | ^18 | Library UI |
| `@supabase/supabase-js` | ^2.49 | Client utama Supabase (query, auth, realtime) |
| `@supabase/ssr` | ^0.5 | Integrasi Supabase dengan SSR (manajemen cookie sesi) |
| `resend` | ^6.12 | Pengiriman email konfirmasi |
| `clsx` | ^2.1 | Penggabungan className kondisional |
| `tailwind-merge` | ^2.5 | Menggabungkan kelas Tailwind tanpa konflik |
| `lucide-react` | ^0.468 | Ikon SVG |

### Dev Dependencies
| Library | Fungsi |
|---------|--------|
| `typescript`, `@types/*` | Static typing |
| `tailwindcss`, `postcss`, `autoprefixer` | Pipeline CSS |
| `eslint`, `eslint-config-next` | Linting |

---

## 4. Arsitektur & Struktur Folder

```
barbershop-nextjs/
├── app/                          # App Router — halaman & server actions
│   ├── layout.tsx                # Root layout (baca cookie tema, set <html data-theme>)
│   ├── page.tsx                  # Landing page (hero, services, rekomendasi, testimoni)
│   ├── globals.css               # Variabel tema + animasi + utility responsif
│   │
│   ├── login/page.tsx            # Halaman login
│   ├── register/page.tsx         # Halaman registrasi
│   │
│   ├── actions/                  # ───── SERVER ACTIONS (pengganti REST API) ─────
│   │   ├── auth.ts               # login, register, logout, updateProfile
│   │   ├── bookings.ts           # createBooking, cancelBooking, getSlotOccupancy,
│   │   │                         #   getBlockedSlots, setBookingStatus
│   │   ├── services.ts           # saveService, deleteService (admin)
│   │   ├── blocks.ts             # addBlockedSlot, removeBlockedSlot (admin)
│   │   └── reviews.ts            # submitReview
│   │
│   ├── dashboard/                # ───── AREA CUSTOMER (terproteksi) ─────
│   │   ├── layout.tsx            # Shell navigasi customer
│   │   ├── page.tsx              # Ringkasan booking customer
│   │   ├── services/page.tsx     # Daftar layanan + tombol booking
│   │   ├── history/page.tsx      # Riwayat booking (real-time)
│   │   └── profile/page.tsx      # Edit profil (nama, telepon)
│   │
│   └── admin/                    # ───── AREA ADMIN (terproteksi) ─────
│       ├── layout.tsx            # Shell navigasi admin
│       ├── page.tsx              # Dashboard analitik & rekomendasi
│       ├── services/page.tsx     # CRUD layanan
│       ├── transactions/page.tsx # Kelola status transaksi
│       └── blocks/page.tsx       # Blokir tanggal/jam
│
├── components/                   # Komponen UI (reusable)
│   ├── landing/                  # Komponen landing page
│   │   ├── hero.tsx              # Hero + statistik
│   │   ├── hero-counter.tsx      # Animasi count-up statistik (data asli DB)
│   │   ├── services-data.tsx     # (Server) fetch + hitung layanan
│   │   ├── services-section.tsx  # (UI) grid layanan
│   │   ├── recommend-data.tsx    # (Server) hitung rekomendasi transaction-based
│   │   ├── recommend-section.tsx # (UI) tampilan rekomendasi
│   │   ├── testimonials.tsx      # (Server) ulasan real dari DB + fallback
│   │   ├── *-skeleton.tsx        # Skeleton loading
│   │   ├── navbar.tsx, about.tsx, contact.tsx, footer.tsx
│   │
│   ├── customer/                 # Komponen area customer
│   │   ├── booking-modal.tsx     # Modal booking multi-layanan
│   │   ├── booking-button.tsx
│   │   ├── cancel-booking-button.tsx
│   │   ├── history-client.tsx    # Riwayat + langganan Realtime
│   │   └── review-modal.tsx      # Modal beri rating/ulasan
│   │
│   ├── admin/                    # Komponen area admin
│   │   ├── services-client.tsx
│   │   ├── transactions-client.tsx
│   │   └── blocks-client.tsx
│   │
│   ├── service-card.tsx          # Kartu layanan (dipakai bersama)
│   ├── theme-toggle.tsx          # Toggle tema (set cookie + localStorage)
│   ├── scroll-reveal.tsx         # Animasi reveal saat scroll (IntersectionObserver)
│   ├── page-transition.tsx, scroll-progress.tsx, open-badge.tsx
│   ├── wa-button.tsx, mobile-cta.tsx, toast.tsx, logo.tsx, dash-shell.tsx
│
├── lib/                          # Utilitas & integrasi
│   ├── supabase/
│   │   ├── server.ts             # createClient() untuk Server Components/Actions
│   │   └── client.ts             # createClient() untuk Client Components (browser)
│   ├── email.ts                  # sendBookingConfirmation() via Resend
│   ├── constants.ts              # MAX_SLOT_CAPACITY = 2
│   └── utils.ts                  # formatRp(), cn(), statusTone()
│
├── types/index.ts                # Tipe TypeScript (Profile, Service, Booking, dll.)
├── proxy.ts                      # Middleware proteksi route + refresh sesi auth
│
├── supabase/
│   ├── schema.sql                # Skema awal (profiles, services, bookings + RLS)
│   └── seed.sql                  # Data contoh
├── supabase-migrations.sql       # Migrasi tambahan (blocked_slots, reviews, realtime, phone)
│
├── next.config.ts                # Konfigurasi (remote image patterns)
├── tailwind.config.ts
└── tsconfig.json
```

### Konvensi Penamaan File
- **kebab-case** untuk seluruh nama file komponen (`booking-modal.tsx`, `service-card.tsx`).
- Suffix **`-data`** = Server Component yang mengambil data (mis. `recommend-data.tsx`).
- Suffix **`-section`** = Komponen presentasi/UI murni (mis. `recommend-section.tsx`).
- Suffix **`-client`** = Client Component interaktif di area admin/customer.
- Suffix **`-skeleton`** = Placeholder loading untuk Suspense.
- Folder `actions/` = seluruh Server Action (mutasi data), dikelompokkan per domain.

---

## 5. Skema Database

Database menggunakan **PostgreSQL** (via Supabase) dengan **Row Level Security (RLS)** aktif di semua tabel.

### Tabel `profiles` — extends `auth.users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID (PK) | Referensi ke `auth.users` |
| `name` | TEXT | Nama pengguna |
| `role` | TEXT | `'admin'` \| `'customer'` (default `customer`) |
| `phone` | TEXT | Nomor telepon (opsional, dari migrasi) |
| `created_at` | TIMESTAMPTZ | |

> Trigger `handle_new_user()` otomatis membuat baris profil saat user mendaftar.

### Tabel `services` — daftar layanan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID (PK) | |
| `name` | TEXT | Nama layanan |
| `description` | TEXT | Deskripsi |
| `price` | INTEGER | Harga (Rupiah) |
| `duration` | INTEGER | Durasi (menit) |
| `tone` | INTEGER | Hue warna/penentu foto (default 210) |
| `created_at` | TIMESTAMPTZ | |

### Tabel `bookings` — transaksi pemesanan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID (PK) | |
| `customer_id` | UUID (FK → profiles) | Pemesan |
| `service_id` | UUID (FK → services) | Layanan dipesan |
| `date` | DATE | Tanggal booking |
| `time` | TEXT | Jam booking (mis. `'09:00'`) |
| `status` | TEXT | `menunggu` \| `dikonfirmasi` \| `selesai` \| `dibatalkan` |
| `created_at` | TIMESTAMPTZ | |

### Tabel `blocked_slots` — blokir jadwal (migrasi)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID (PK) | |
| `date` | DATE | Tanggal diblokir |
| `time` | TEXT \| NULL | `NULL` = seluruh hari diblokir |
| `reason` | TEXT | Alasan blokir |
| `created_at` | TIMESTAMPTZ | |

### Tabel `reviews` — ulasan & rating (migrasi)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID (PK) | |
| `booking_id` | UUID (FK → bookings, UNIQUE) | Satu ulasan per booking |
| `customer_id` | UUID (FK → profiles) | |
| `service_id` | UUID (FK → services) | |
| `rating` | INTEGER (1–5) | |
| `comment` | TEXT | |
| `created_at` | TIMESTAMPTZ | |

### Relasi
```
auth.users 1───1 profiles
profiles   1───N bookings   N───1 services
bookings   1───1 reviews    (review opsional, satu per booking)
profiles   1───N reviews
services   1───N reviews
```

### Ringkasan Kebijakan RLS
- `profiles`: user hanya baca/ubah profil sendiri (admin bisa baca semua).
- `services`: publik boleh baca; hanya admin boleh tulis.
- `bookings`: customer baca booking sendiri (admin baca semua); customer buat booking sendiri; admin ubah status.
- `blocked_slots` & `reviews`: publik boleh baca; tulis sesuai aturan (admin / pemilik).

---

## 6. API / Server Actions

Aplikasi **tidak menggunakan REST API endpoint terpisah**. Seluruh mutasi data dilakukan melalui **Next.js Server Actions** (fungsi `async` dengan direktif `'use server'`) yang dipanggil langsung dari komponen. Pendekatan ini menghilangkan kebutuhan layer API manual dan otomatis aman secara tipe (type-safe end-to-end).

### `app/actions/auth.ts`
| Fungsi | Parameter | Deskripsi |
|--------|-----------|-----------|
| `login(formData)` | email, password | Login & redirect sesuai peran |
| `register(formData)` | name, email, password | Daftar akun customer baru |
| `logout()` | — | Keluar & redirect ke beranda |
| `updateProfile(data)` | `{ name, phone }` | Perbarui profil pengguna |

### `app/actions/bookings.ts`
| Fungsi | Parameter | Deskripsi |
|--------|-----------|-----------|
| `createBooking(data)` | `{ serviceIds[], date, time }` | Buat booking + cek kapasitas slot + cek blokir + kirim email |
| `cancelBooking(id)` | `id` | Batalkan booking (hanya status `menunggu` & milik sendiri) |
| `getSlotOccupancy(date)` | `date` | Jumlah booking aktif per jam → `Record<time, count>` |
| `getBlockedSlots(date)` | `date` | Daftar jam/tanggal yang diblokir + alasan |
| `setBookingStatus(id, status)` | `id`, status | (Admin) ubah status transaksi |

### `app/actions/services.ts`
| Fungsi | Parameter | Deskripsi |
|--------|-----------|-----------|
| `saveService(formData)` | name, description, price, duration, tone, (id) | (Admin) tambah/ubah layanan |
| `deleteService(id)` | `id` | (Admin) hapus layanan |

### `app/actions/blocks.ts`
| Fungsi | Parameter | Deskripsi |
|--------|-----------|-----------|
| `addBlockedSlot(data)` | `{ date, time\|null, reason }` | (Admin) blokir slot |
| `removeBlockedSlot(id)` | `id` | (Admin) buka blokir |

### `app/actions/reviews.ts`
| Fungsi | Parameter | Deskripsi |
|--------|-----------|-----------|
| `submitReview(data)` | `{ bookingId, serviceId, rating, comment }` | Kirim ulasan (hanya booking `selesai` milik sendiri) |

> **Catatan keamanan:** Setiap action memverifikasi `supabase.auth.getUser()` dan kepemilikan data sebelum melakukan mutasi, sebagai lapisan kedua di atas RLS database.

---

## 7. Fitur Rekomendasi Layanan

Lihat dokumen akademik lengkap di [`docs/rekomendasi-layanan.md`](docs/rekomendasi-layanan.md).

**Ringkas:** Sistem menggunakan metode *Transaction-Based Recommendation* — menghitung frekuensi setiap layanan dipesan dari tabel `bookings` (mengecualikan status `dibatalkan`), mengurutkan secara menurun, dan menampilkan 3 layanan teratas sebagai "Rekomendasi Layanan / Paling Diminati". Logika ini berada di [`components/landing/recommend-data.tsx`](components/landing/recommend-data.tsx).

---

## 8. Cara Setup Project

### Prasyarat
- **Node.js** ≥ 18.18
- **npm** (atau pnpm/yarn)
- Akun **Supabase** (gratis) — [supabase.com](https://supabase.com)
- (Opsional) Akun **Resend** untuk email — [resend.com](https://resend.com)

### Langkah Setup

**1. Clone & install dependency**
```bash
git clone https://github.com/FadalHakimAzizi/barbershop-f1.git
cd barbershop-f1
npm install
```

**2. Buat project Supabase**
- Buat project baru di dashboard Supabase.
- Buka **SQL Editor**, jalankan isi file berikut secara berurutan:
  1. `supabase/schema.sql` (tabel inti + RLS + trigger)
  2. `supabase-migrations.sql` (blocked_slots, reviews, realtime, kolom phone)
  3. (Opsional) `supabase/seed.sql` (data layanan contoh)

**3. Konfigurasi environment variable**

Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
RESEND_API_KEY=re_xxxxx          # opsional — untuk email konfirmasi
```
> URL & anon key didapat dari **Supabase → Project Settings → API**.

**4. Buat akun admin pertama**
- Daftar lewat aplikasi (`/register`) → akun otomatis berperan `customer`.
- Di Supabase **Table Editor → profiles**, ubah kolom `role` akun tersebut menjadi `admin`.

---

## 9. Cara Menjalankan Aplikasi

```bash
# Mode development (dengan hot-reload, Turbopack)
npm run dev
# → buka http://localhost:3000

# Build untuk produksi
npm run build

# Menjalankan hasil build produksi
npm run start

# Linting
npm run lint
```

---

## 10. Cara Testing Aplikasi

Project ini belum menyertakan automated test suite. Pengujian dilakukan secara **manual (functional testing)** dengan skenario berikut:

### Skenario Uji Customer
1. **Registrasi & Login** — daftar akun baru, pastikan redirect ke `/dashboard`.
2. **Booking** — pilih ≥1 layanan, tanggal, dan jam; verifikasi:
   - Jam yang sudah lewat tidak bisa dipilih.
   - Slot penuh (≥ `MAX_SLOT_CAPACITY`) menampilkan label "PENUH".
   - Tanggal yang diblokir admin menampilkan alasan.
   - Total harga & durasi terjumlah benar untuk multi-layanan.
3. **Riwayat real-time** — buka `/dashboard/history`; saat admin mengubah status di tab lain, status berubah otomatis tanpa refresh.
4. **Batalkan booking** — hanya tersedia untuk status `menunggu`.
5. **Ulasan** — setelah status `selesai`, beri rating; verifikasi muncul di section testimoni beranda.
6. **Edit profil** — ubah nama & telepon di `/dashboard/profile`.

### Skenario Uji Admin
1. **CRUD layanan** — tambah/ubah/hapus layanan; verifikasi perubahan muncul di beranda.
2. **Kelola transaksi** — ubah status booking; verifikasi update di sisi customer.
3. **Blokir jadwal** — blokir tanggal/jam; verifikasi customer tidak bisa memesan slot tersebut.
4. **Analitik** — verifikasi kartu revenue, tren 7 hari, breakdown status, dan **rekomendasi layanan** sesuai data transaksi aktual.

### Pemeriksaan Tambahan
- **Linting:** `npm run lint` harus lolos tanpa error.
- **Type checking:** `npx tsc --noEmit` untuk memverifikasi tipe.
- **Build:** `npm run build` harus berhasil sebelum deployment.
- **Responsivitas:** uji di breakpoint mobile (≤640px) dan tablet (≤900px).
- **Tema:** toggle gelap/terang, pastikan tidak ada flicker saat reload.

---

## 11. Deployment ke Vercel

Aplikasi ini dideploy menggunakan **Vercel** (platform resmi untuk Next.js). Repositori berada di **`barbershop-f1`**.

### Langkah Deployment
1. **Push project ke GitHub** (repo: `FadalHakimAzizi/barbershop-f1`).
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → **Import** repositori `barbershop-f1`.
3. Vercel otomatis mendeteksi framework **Next.js** (tidak perlu konfigurasi build manual).
4. **Tambahkan Environment Variables** di menu *Project Settings → Environment Variables*:
   | Key | Sumber |
   |-----|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
   | `RESEND_API_KEY` | Resend Dashboard (opsional, untuk email) |
5. Klik **Deploy**. Vercel akan menjalankan `npm run build` dan menerbitkan aplikasi.
6. Setiap `git push` ke branch utama akan memicu **deployment otomatis** (CI/CD).

> **Penting:** File `.env.local` **tidak ikut ter-commit** (sudah masuk `.gitignore`) demi keamanan. Seluruh kredensial harus dimasukkan melalui menu Environment Variables di Vercel.

---

## Lisensi

Project ini dibuat untuk keperluan akademik/penelitian.
