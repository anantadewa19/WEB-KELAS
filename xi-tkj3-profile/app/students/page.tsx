import StudentCard from "@/components/StudentCard";
import SearchBar from "@/components/SearchBar";
import pool from "@/lib/db";
import { parseSkills, type Student } from "@/lib/types";

// Halaman ini mengambil data langsung dari database (Server Component),
// dan menerima parameter pencarian lewat query string: /students?search=budi
async function getStudents(search?: string): Promise<Student[]> {
  const likePattern = `%${search ?? ""}%`;

  // Query di sini SUDAH memakai parameterized query (aman dari SQL Injection).
  // Contoh versi vulnerable-nya bisa dilihat di app/api/students/search/route.ts
  const [rows] = await pool.query(
    `SELECT id, full_name, nickname, attendance_number, class_name, expertise, skills, hobby, dream_job, description, photo
     FROM students
     WHERE full_name LIKE ? OR nickname LIKE ?
     ORDER BY attendance_number ASC`,
    [likePattern, likePattern]
  );

  // @ts-expect-error - rows dari mysql2 berupa array of RowDataPacket
  return rows.map((row) => ({ ...row, skills: parseSkills(row.skills) }));
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams.search?.trim() || "";
  let students: Student[] = [];
  let dbError = false;

  try {
    students = await getStudents(search);
  } catch (error) {
    console.error("Gagal mengambil data siswa:", error);
    dbError = true;
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl font-bold mb-2">Daftar Siswa</h1>
      <p className="text-node-muted mb-6">Seluruh siswa kelas XI TKJ 3.</p>

      <SearchBar />

      {dbError && (
        <p className="mt-6 text-node-warn text-sm">
          Tidak dapat terhubung ke database. Pastikan MariaDB sudah berjalan dan file
          .env sudah dikonfigurasi.
        </p>
      )}

      {!dbError && search && (
        <p className="mt-6 text-sm text-node-muted">
          Menampilkan <span className="text-node-accent">{students.length}</span> hasil untuk
          "<span className="text-node-text">{search}</span>"
        </p>
      )}

      {!dbError && students.length === 0 && (
        <p className="mt-10 text-node-muted">
          {search ? "Siswa tidak ditemukan." : "Belum ada data siswa. Jalankan `npm run db:seed`."}
        </p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
