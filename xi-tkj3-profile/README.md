# XI TKJ 3 Class Profile

Website profil kelas XI TKJ 3 — sebuah CV digital kelas sederhana, sekaligus
**laboratorium praktikum keamanan aplikasi web** untuk pembelajaran siswa SMK
jurusan Teknik Komputer dan Jaringan (TKJ).

## Tentang Project

Project ini dibangun dengan Next.js (App Router) dan MariaDB. Selain
menampilkan profil kelas dan siswa, project ini juga mencontohkan tiga
kerentanan keamanan web yang umum — **SQL Injection**, **Cross-Site
Scripting (XSS)**, dan **Path Traversal** — lengkap dengan versi rentan
(untuk dipelajari) dan versi yang sudah diperbaiki, berdampingan dalam kode
yang sama dan ditandai jelas dengan komentar.

> ⚠️ **Penting:** Bagian laboratorium (`ENABLE_VULNERABLE_LAB=true`) sengaja
> dibuat tidak aman untuk tujuan pembelajaran. **Jangan pernah** menjalankan
> mode ini di server yang dapat diakses publik/internet — gunakan hanya di
> localhost atau lingkungan sandbox yang terisolasi.

## Teknologi

* Next.js 14 (App Router) + React + TypeScript
* Tailwind CSS
* MariaDB (`mysql2`)
* Node.js

## Instalasi

```bash
git clone <URL_REPOSITORY_ANDA>
cd xi-tkj3-profile
npm install
```

## Environment

Salin file contoh environment, lalu sesuaikan isinya:

```bash
cp .env.example .env
```

Isi `.env`:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=isi_password_anda
DB_NAME=xi_tkj3_profile
ENABLE_VULNERABLE_LAB=true
```

## Database

1. Pastikan MariaDB sudah terinstal dan berjalan.
2. Buat database dan tabel dari schema:

```bash
mysql -u root -p < database/schema.sql
```

3. Isi data dummy (10 siswa):

```bash
npm run db:seed
```

## Menjalankan Project

```bash
npm run dev
```

Buka browser ke: `http://localhost:3000`

## Halaman yang Tersedia

| Route | Deskripsi |
|---|---|
| `/` | Homepage — profil kelas |
| `/students` | Daftar siswa + fitur pencarian |
| `/students/[id]` | Detail profil satu siswa |
| `/comments` | Guestbook / komentar |
| `/security-lab` | Materi & disclaimer praktikum keamanan |

## Security Lab

Project ini memiliki bagian laboratorium yang **sengaja dibuat tidak aman**
untuk pembelajaran, dikendalikan lewat variabel environment
`ENABLE_VULNERABLE_LAB`:

* `ENABLE_VULNERABLE_LAB=true` → versi vulnerable aktif (untuk demonstrasi di
  kelas/localhost).
* `ENABLE_VULNERABLE_LAB=false` → hanya versi secure/fixed yang aktif.

**Jangan pernah** memasang project ini sebagai aplikasi production/publik
tanpa mengatur `ENABLE_VULNERABLE_LAB=false`.

Detail lokasi kode, penyebab, dampak, dan cara pengujian tiap kerentanan ada
di [`docs/security-lab.md`](docs/security-lab.md), dan ringkasan edukatifnya
tampil di halaman `/security-lab`.

File yang memuat contoh kerentanan:

* `app/api/students/search/route.ts` — SQL Injection
* `app/comments/page.tsx` — XSS
* `app/api/files/route.ts` — Path Traversal

## Git & GitHub

```bash
git init
git add .
git commit -m "Initial project XI TKJ 3 profile"
git branch -M main
git remote add origin URL_REPOSITORY
git push -u origin main
```

Rekomendasi pola commit selanjutnya:

```
feat: add student profile page
feat: add student search
feat: add comments feature
lab: add SQL injection example
lab: add XSS example
lab: add path traversal example
fix: secure SQL queries
fix: sanitize user input
fix: secure file access
```

## Struktur Project

```
xi-tkj3-profile/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── students/page.tsx         # Daftar siswa + search
│   ├── students/[id]/page.tsx    # Profil siswa dinamis
│   ├── comments/page.tsx         # Guestbook (lab XSS)
│   ├── security-lab/page.tsx     # Materi security lab
│   └── api/
│       ├── students/route.ts
│       ├── students/search/route.ts  # lab SQL Injection
│       ├── comments/route.ts
│       └── files/route.ts            # lab Path Traversal
├── components/
├── lib/
│   ├── db.ts
│   └── types.ts
├── public/student-images/
├── database/
│   ├── schema.sql
│   └── seed.js
├── docs/security-lab.md
├── .env.example
└── README.md
```

## Checklist Pengujian

- [ ] Homepage terbuka dan menampilkan info kelas.
- [ ] `npm run db:seed` berhasil mengisi 10 siswa dummy.
- [ ] `/students` menampilkan seluruh siswa dari MariaDB.
- [ ] Fitur pencarian di `/students` berfungsi (contoh: `?search=budi`).
- [ ] `/students/[id]` menampilkan profil lengkap satu siswa.
- [ ] Komentar di `/comments` bisa dikirim dan tampil kembali.
- [ ] Foto siswa tampil (placeholder SVG bawaan atau foto asli yang diganti).
- [ ] Tampilan responsif di ukuran layar mobile.
- [ ] `/security-lab` menampilkan materi & disclaimer.
- [ ] Dengan `ENABLE_VULNERABLE_LAB=true`, kerentanan lab bisa didemonstrasikan di localhost.
- [ ] Dengan `ENABLE_VULNERABLE_LAB=false`, hanya versi secure yang aktif.
- [ ] File `.env` **tidak** ikut ter-commit ke Git (cek `.gitignore`).
