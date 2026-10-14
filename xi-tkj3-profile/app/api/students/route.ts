// app/api/students/route.ts
// Endpoint untuk mengambil seluruh data siswa dari database.

import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { parseSkills } from "@/lib/types";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, nickname, attendance_number, class_name, expertise, skills, hobby, dream_job, description, photo FROM students ORDER BY attendance_number ASC"
    );

    // @ts-expect-error - rows dari mysql2 berupa array of RowDataPacket
    const students = rows.map((row) => ({
      ...row,
      skills: parseSkills(row.skills),
    }));

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Gagal mengambil data siswa:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data siswa dari database." },
      { status: 500 }
    );
  }
}
