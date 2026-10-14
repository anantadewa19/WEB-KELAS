import Image from "next/image";
import Link from "next/link";
import SkillBadge from "@/components/SkillBadge";
import type { Student } from "@/lib/types";

export default function ProfileCard({ student }: { student: Student }) {
  return (
    <div className="max-w-2xl mx-auto rounded-lg border border-node-line bg-node-panel p-8">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="h-32 w-32 rounded-full overflow-hidden bg-node-bg relative shrink-0 mx-auto sm:mx-0">
          <Image
            src={`/student-images/${student.photo || "default-male.svg"}`}
            alt={`Foto ${student.full_name}`}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-display text-2xl font-bold">{student.full_name}</h1>
          <p className="text-node-muted">"{student.nickname}"</p>
          <p className="text-sm text-node-accent mt-1">{student.expertise}</p>
        </div>
      </div>

      <div className="connector-line my-6" />

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-node-muted">Kelas</dt>
          <dd>{student.class_name}</dd>
        </div>
        <div>
          <dt className="text-node-muted">No. Absen</dt>
          <dd>{student.attendance_number ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-node-muted">Cita-cita</dt>
          <dd>{student.dream_job || "-"}</dd>
        </div>
        <div>
          <dt className="text-node-muted">Hobi</dt>
          <dd>{student.hobby || "-"}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <h2 className="text-sm text-node-muted mb-2">Skill</h2>
        <div className="flex flex-wrap gap-2">
          {student.skills.map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      </div>

      {student.description && (
        <div className="mt-6">
          <h2 className="text-sm text-node-muted mb-2">Tentang</h2>
          {/* React secara otomatis meng-escape teks di sini (aman dari XSS)
              karena kita menampilkan string biasa, BUKAN dangerouslySetInnerHTML. */}
          <p className="text-node-text leading-relaxed">{student.description}</p>
        </div>
      )}

      <Link
        href="/students"
        className="inline-block mt-8 text-sm text-node-accent hover:underline"
      >
        ← Kembali ke Daftar Siswa
      </Link>
    </div>
  );
}
