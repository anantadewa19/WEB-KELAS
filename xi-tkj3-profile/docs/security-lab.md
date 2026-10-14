# Dokumentasi Praktikum Keamanan Aplikasi Web

> Semua pengujian pada dokumen ini hanya dilakukan pada aplikasi laboratorium
> milik sendiri, di localhost, atau sistem yang telah memberikan izin
> tertulis. Dokumen ini **tidak** berisi skrip serangan otomatis maupun
> instruksi untuk menyerang sistem pihak lain.

---

## 1. SQL Injection

### 1. Lokasi Kerentanan
`app/api/students/search/route.ts`, fungsi `GET`, blok yang ditandai
`// SECURITY LAB: SQL Injection example`.

### 2. Penyebab
Nilai pencarian (`q`) yang berasal dari input pengguna digabungkan langsung
ke dalam string query SQL menggunakan template string, alih-alih dikirim
sebagai parameter terpisah. Akibatnya, database tidak bisa membedakan mana
bagian yang merupakan "perintah SQL" dan mana yang merupakan "data" dari
pengguna.

### 3. Dampak
Karena bagian query bisa dimanipulasi, siswa perlu memahami bahwa risiko yang
mungkin timbul antara lain: kondisi pencarian dapat diubah menjadi selalu
bernilai benar (membuat seluruh data ikut tampil), atau struktur query bisa
diarahkan untuk membaca kolom lain di luar yang seharusnya ditampilkan.

### 4. Pengujian
Di lingkungan lab lokal, siswa dapat mengamati query final yang terbentuk
(misalnya lewat `console.log`) saat memasukkan karakter khusus SQL seperti
tanda kutip satu (`'`) pada kolom pencarian, lalu membandingkan bagaimana
query itu berubah bentuk dibanding versi parameterized. Fokus pengujian di
sini adalah **memahami cara kerja celahnya**, bukan mengembangkan alat
serangan.

### 5. Perbaikan
Gunakan parameterized query / prepared statement, sehingga nilai input
selalu diperlakukan sebagai data:

```ts
// SECURE VERSION
const likePattern = `%${q}%`;
const [rows] = await pool.query(
  `SELECT * FROM students WHERE full_name LIKE ? OR nickname LIKE ?`,
  [likePattern, likePattern]
);
```

Tambahan praktik baik: validasi panjang/format input, dan berikan hak akses
database seminimal mungkin (least privilege) untuk akun yang dipakai aplikasi.

### 6. Kesimpulan
Jangan pernah membangun query SQL dengan menggabungkan string input pengguna
secara langsung. Selalu pisahkan struktur query (kode) dari nilai (data)
lewat parameterized query.

---

## 2. Cross-Site Scripting (XSS)

### 1. Lokasi Kerentanan
`app/comments/page.tsx`, blok yang ditandai `// SECURITY LAB: XSS example`.

### 2. Penyebab
Pesan komentar (input pengguna) dirender langsung sebagai HTML mentah
menggunakan `dangerouslySetInnerHTML`, tanpa validasi maupun sanitasi.
Sumber input: form komentar di halaman `/comments`. Titik output: daftar
komentar yang ditampilkan ke semua pengunjung halaman tersebut.

### 3. Dampak
Karena isi komentar ditampilkan sebagai HTML aktif, konten yang bersifat
aktif (seperti tag `<script>` atau atribut event handler) berpotensi ikut
dijalankan oleh browser setiap orang yang membuka halaman komentar tersebut
(dikenal sebagai Stored XSS). Ini bisa berdampak pada pencurian sesi
pengguna, perubahan tampilan halaman, atau pengalihan ke halaman lain.

### 4. Pengujian
Di lab lokal, siswa dapat mengirim komentar berisi tag HTML sederhana
(misalnya tag `<b>` untuk tebal) dan membandingkan apakah tag tersebut
"aktif" (dijalankan browser) pada versi vulnerable, dibanding tampil sebagai
teks biasa pada versi secure. Perbandingan ini cukup untuk memahami konsep
tanpa perlu payload yang bersifat merusak.

### 5. Perbaikan
Tampilkan pesan sebagai teks biasa lewat JSX (React otomatis melakukan
output encoding):

```tsx
// SECURE VERSION
<p className="whitespace-pre-wrap break-words">{comment.message}</p>
```

Jika suatu saat memang perlu menampilkan HTML terbatas dari pengguna (misalnya
hasil rich text editor), sanitasi dulu dengan library seperti
`isomorphic-dompurify` sebelum dirender:

```tsx
import DOMPurify from "isomorphic-dompurify";

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.message) }} />
```

### 6. Kesimpulan
Perlindungan bawaan React (output encoding otomatis pada `{ }`) sudah cukup
untuk kebanyakan kasus teks biasa. Gunakan `dangerouslySetInnerHTML` hanya
jika benar-benar diperlukan, dan selalu sanitasi data yang tidak dipercaya
sebelum merendernya sebagai HTML.

---

## 3. Path Traversal

### 1. Lokasi Kerentanan
`app/api/files/route.ts`, fungsi `GET`, blok yang ditandai
`// SECURITY LAB: Path Traversal example`.

### 2. Penyebab
Nama file dari parameter `name` digabungkan langsung ke path direktori
(`path.join(BASE_DIR, name)`) tanpa validasi. Karena komponen path seperti
`../` tidak difilter, permintaan file bisa "keluar" dari direktori
`/public/student-images` yang seharusnya menjadi batas akses.

### 3. Dampak
Server berpotensi membuka file di luar direktori yang dimaksudkan, termasuk
file konfigurasi sensitif di dalam project (misalnya `.env`) jika lokasinya
dapat ditebak/diarahkan lewat parameter `name`. Ini bisa berujung pada
kebocoran informasi konfigurasi atau data lain di server.

### 4. Pengujian
Di lab lokal, siswa dapat membandingkan hasil permintaan file dengan nama
biasa (misalnya file foto yang memang ada) versus nama yang menyertakan
komponen `../`, lalu mengamati bagaimana versi vulnerable vs secure
merespons permintaan tersebut (ditolak atau tidak). Pengujian dilakukan
sepenuhnya terhadap direktori/file milik project sendiri di localhost.

### 5. Perbaikan
Terapkan pertahanan berlapis:

```ts
// SECURE VERSION
const safeName = path.basename(name);           // buang komponen path seperti ../
const ext = path.extname(safeName).toLowerCase();

if (!ALLOWED_EXTENSIONS.includes(ext)) {
  return NextResponse.json({ error: "Tipe file tidak diizinkan." }, { status: 400 });
}

const resolvedPath = path.resolve(BASE_DIR, safeName);
const resolvedBase = path.resolve(BASE_DIR);

if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
  return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
}
```

Elemen kuncinya: `path.basename()` untuk membuang path traversal, whitelist
ekstensi file, dan verifikasi ulang bahwa path akhir tetap berada di dalam
direktori yang diizinkan.

### 6. Kesimpulan
Jangan pernah mempercayai nama/path file dari input pengguna secara mentah.
Selalu batasi akses file pada direktori tertentu (sandboxing) dan verifikasi
ulang path akhir setelah digabungkan.
