import { notFound } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import pool from "@/lib/db";
import { parseSkills, type Student } from "@/lib/types";

async function getStudentById(id: string): Promise<Student | null> {
  // `id` divalidasi sebagai angka sebelum dipakai di query, sekaligus
  // query tetap memakai parameterized query (?) sebagai praktik standar.
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return null;

  const [rows] = await pool.query(
    `SELECT id, full_name, nickname, attendance_number, class_name, expertise, skills, hobby, dream_job, description, photo
     FROM students WHERE id = ?`,
    [numericId]
  );

  // @ts-expect-error - rows dari mysql2 berupa array of RowDataPacket
  const row = rows[0];
  if (!row) return null;

  return { ...row, skills: parseSkills(row.skills) };
}

export default async function StudentProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const student = await getStudentById(params.id);

  if (!student) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <ProfileCard student={student} />
    </div>
  );
}
