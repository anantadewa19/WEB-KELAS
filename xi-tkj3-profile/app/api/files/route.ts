// app/api/files/route.ts
//
// Endpoint untuk mengambil file foto siswa dari direktori khusus, misalnya:
//   /api/files?name=default-male.svg
//
// File ini SENGAJA memuat DUA implementasi berdampingan untuk praktikum:
//   1) VULNERABLE  -> nama file dari pengguna dipakai langsung tanpa validasi
//   2) SECURE      -> validasi ketat + pembatasan direktori
//
// Dikendalikan oleh ENABLE_VULNERABLE_LAB di .env (lihat catatan yang sama
// di app/api/students/search/route.ts).

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const VULNERABLE_LAB_ENABLED = process.env.ENABLE_VULNERABLE_LAB === "true";

// Direktori yang DIIZINKAN untuk diakses. Semua path harus berada di dalam folder ini.
const BASE_DIR = path.join(process.cwd(), "public", "student-images");

// Ekstensi file yang diizinkan (whitelist).
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".svg", ".webp"];

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name") ?? "";

  if (!name) {
    return NextResponse.json({ error: "Parameter 'name' wajib diisi." }, { status: 400 });
  }

  try {
    let targetPath: string;

    if (VULNERABLE_LAB_ENABLED) {
      // SECURITY LAB: Path Traversal example
      // -----------------------------------------------------------------
      // KESALAHAN: nama file dari pengguna (`name`) langsung digabungkan ke
      // path direktori tanpa validasi apa pun. Karena string path seperti
      // "../../" tidak difilter, pengguna bisa "keluar" dari direktori
      // /public/student-images menuju direktori lain di server -- misalnya
      // membaca file konfigurasi seperti .env yang berada di root project.
      // Ini disebut Path Traversal / Directory Traversal.
      //
      // HANYA untuk didemonstrasikan di localhost/lab tertutup, dan file
      // yang dicoba dibaca sebatas file di dalam project sendiri (tidak ada
      // fitur untuk menyerang sistem/mesin lain).
      targetPath = path.join(BASE_DIR, name);
    } else {
      // SECURE VERSION
      // -----------------------------------------------------------------
      // PERBAIKAN, berlapis (defense in depth):
      // 1. Ambil HANYA nama file dasarnya dengan path.basename(), sehingga
      //    komponen path seperti "../" ikut dibuang.
      // 2. Whitelist ekstensi file yang diperbolehkan.
      // 3. Setelah digabung ke BASE_DIR, hitung ulang path absolut yang
      //    "sudah diselesaikan" (resolved path) dan pastikan path tersebut
      //    tetap berada di dalam BASE_DIR. Ini mencegah trik path traversal
      //    yang lebih rumit (contoh: karakter unicode/percent-encoding yang
      //    setelah dinormalisasi ternyata tetap keluar direktori).
      const safeName = path.basename(name);
      const ext = path.extname(safeName).toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { error: "Tipe file tidak diizinkan." },
          { status: 400 }
        );
      }

      const resolvedPath = path.resolve(BASE_DIR, safeName);
      const resolvedBase = path.resolve(BASE_DIR);

      if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
        return NextResponse.json(
          { error: "Akses file di luar direktori yang diizinkan ditolak." },
          { status: 403 }
        );
      }

      targetPath = resolvedPath;
    }

    const fileBuffer = await fs.readFile(targetPath);
    const ext = path.extname(targetPath).toLowerCase();
    const contentType =
      ext === ".svg"
        ? "image/svg+xml"
        : ext === ".png"
        ? "image/png"
        : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";

    return new NextResponse(fileBuffer, {
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 404 });
  }
}
