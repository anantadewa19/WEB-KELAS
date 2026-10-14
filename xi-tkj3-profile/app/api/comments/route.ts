// app/api/comments/route.ts
//
// Endpoint guestbook/komentar. Fitur ini dipakai sebagai bahan praktikum XSS
// (Cross-Site Scripting): apa yang terjadi saat input pengguna disimpan lalu
// ditampilkan kembali ke pengguna lain tanpa penanganan yang benar.
//
// Penyimpanan ke database di sini SUDAH aman (parameterized query).
// Sumber risiko XSS yang sesungguhnya bukan di sini, melainkan di SISI
// TAMPILAN (lihat app/comments/page.tsx) -- yaitu BAGAIMANA data ini
// dirender kembali ke browser.

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, message, created_at FROM comments ORDER BY created_at DESC LIMIT 50"
    );
    return NextResponse.json({ comments: rows });
  } catch (error) {
    console.error("Gagal mengambil komentar:", error);
    return NextResponse.json({ error: "Gagal mengambil komentar." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // Validasi input dasar di sisi server (jangan hanya percaya validasi di client!)
    if (!name || !message) {
      return NextResponse.json(
        { error: "Nama dan pesan wajib diisi." },
        { status: 400 }
      );
    }
    if (name.length > 100 || message.length > 500) {
      return NextResponse.json(
        { error: "Nama atau pesan terlalu panjang." },
        { status: 400 }
      );
    }

    // Parameterized query -- data disimpan apa adanya, tidak diubah bentuknya.
    // Sanitasi terhadap HTML/script dilakukan saat MENAMPILKAN data (output
    // encoding), bukan saat menyimpan, karena data mentah tetap berguna
    // untuk keperluan lain (misalnya laporan/audit).
    await pool.execute(
      "INSERT INTO comments (name, message) VALUES (?, ?)",
      [name, message]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan komentar:", error);
    return NextResponse.json({ error: "Gagal menyimpan komentar." }, { status: 500 });
  }
}
