// app/api/students/search/route.ts
//
// Endpoint pencarian siswa berdasarkan nama lengkap / nama panggilan.
// File ini SENGAJA memuat DUA implementasi berdampingan untuk praktikum:
//   1) VULNERABLE  -> menggabungkan input user langsung ke string SQL (BAHAYA)
//   2) SECURE      -> menggunakan parameterized query / prepared statement (AMAN)
//
// Versi yang aktif dikendalikan oleh ENABLE_VULNERABLE_LAB di .env, supaya
// guru bisa mendemonstrasikan keduanya di lingkungan lokal secara terkontrol.
// JANGAN PERNAH set ENABLE_VULNERABLE_LAB=true di server yang bisa diakses publik.

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { parseSkills } from "@/lib/types";

const VULNERABLE_LAB_ENABLED = process.env.ENABLE_VULNERABLE_LAB === "true";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  try {
    let rows;

    if (VULNERABLE_LAB_ENABLED) {
      // SECURITY LAB: SQL Injection example
      // -----------------------------------------------------------------
      // KESALAHAN: nilai `q` dari pengguna digabungkan langsung ke dalam
      // string query SQL menggunakan template string. Karena tidak ada
      // pemisahan antara "kode SQL" dan "data", pengguna bisa memasukkan
      // potongan SQL tambahan lewat parameter `q` dan mengubah makna query
      // (misalnya menambahkan kondisi "OR 1=1" atau memanfaatkan komentar
      // SQL) sehingga bisa membaca data yang seharusnya tidak ditampilkan.
      //
      // Ini HANYA untuk didemonstrasikan di localhost/lab tertutup. Jangan
      // jalankan versi ini pada database berisi data asli/produksi.
      const unsafeQuery = `SELECT id, full_name, nickname, attendance_number, class_name, expertise, skills, hobby, dream_job, description, photo
                           FROM students
                           WHERE full_name LIKE '%${q}%' OR nickname LIKE '%${q}%'`;
      const [result] = await pool.query(unsafeQuery);
      rows = result;
    } else {
      // SECURE VERSION
      // -----------------------------------------------------------------
      // PERBAIKAN: gunakan parameterized query (tanda `?`). Driver database
      // akan mengirim nilai `q` secara terpisah dari struktur query, sehingga
      // apa pun isi `q`, ia selalu diperlakukan sebagai DATA, bukan sebagai
      // bagian dari perintah SQL. Ini menutup celah SQL Injection.
      const likePattern = `%${q}%`;
      const [result] = await pool.query(
        `SELECT id, full_name, nickname, attendance_number, class_name, expertise, skills, hobby, dream_job, description, photo
         FROM students
         WHERE full_name LIKE ? OR nickname LIKE ?`,
        [likePattern, likePattern]
      );
      rows = result;
    }

    // @ts-expect-error - rows dari mysql2 berupa array of RowDataPacket
    const students = rows.map((row) => ({
      ...row,
      skills: parseSkills(row.skills),
    }));

    return NextResponse.json({
      query: q,
      total: students.length,
      mode: VULNERABLE_LAB_ENABLED ? "vulnerable-lab" : "secure",
      students,
    });
  } catch (error) {
    console.error("Gagal melakukan pencarian siswa:", error);
    return NextResponse.json(
      { error: "Gagal melakukan pencarian." },
      { status: 500 }
    );
  }
}
