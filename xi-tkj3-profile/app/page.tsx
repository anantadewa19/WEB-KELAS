import Link from "next/link";
import Image from "next/image";
import SkillBadge from "@/components/SkillBadge";
import pool from "@/lib/db";

const CLASS_SKILLS = [
  "Network Administration",
  "Linux",
  "Mikrotik",
  "Cisco",
  "Web Development",
  "Server Administration",
  "Cyber Security",
];

async function getStudentCount(): Promise<number> {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as total FROM students");
    // @ts-expect-error - hasil query mysql2 berbentuk array baris
    return rows[0]?.total ?? 0;
  } catch {
    return 0; // database belum disiapkan; homepage tetap tampil
  }
}

export default async function HomePage() {
  const studentCount = await getStudentCount();

  return (
    <div>
      {/* HERO */}
      <section className="bg-network-grid border-b border-node-line">
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-col items-center text-center gap-4">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-node-accent border border-node-line rounded-full px-3 py-1 bg-node-panel">
            <span className="h-1.5 w-1.5 rounded-full bg-node-accent" />
            SMK — Teknik Komputer dan Jaringan
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">XI TKJ 3</h1>
          <p className="text-node-accent font-medium">Student Profile & Class Portfolio</p>
          <p className="max-w-xl text-node-muted">
            Mengenal lebih dekat siswa-siswa XI TKJ 3, keahlian, minat, dan potensi mereka.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="rounded-md border border-node-line bg-node-panel px-4 py-2">
              <span className="text-node-accent font-mono">{studentCount}</span> Siswa
            </div>
            <div className="rounded-md border border-node-line bg-node-panel px-4 py-2">
              Jurusan: <span className="text-node-accent">TKJ</span>
            </div>
          </div>
          <Link
            href="/students"
            className="mt-6 rounded-md bg-node-accent text-node-bg px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Lihat Daftar Siswa
          </Link>
        </div>
      </section>

      {/* FOTO KELAS */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="rounded-lg overflow-hidden border border-node-line relative h-64 sm:h-80 bg-node-panel">
          <Image
            src="/student-images/class-photo.svg"
            alt="Foto Kelas XI TKJ 3"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* TENTANG KELAS */}
      <section className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-2xl font-semibold mb-4">Tentang Kelas</h2>
          <p className="text-node-muted leading-relaxed">
            XI TKJ 3 adalah kelas jurusan Teknik Komputer dan Jaringan yang mempelajari
            perancangan, pemasangan, dan pemeliharaan jaringan komputer, administrasi
            server, hingga dasar-dasar keamanan siber. Website ini dibuat sebagai media
            perkenalan sekaligus portofolio digital kelas.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold mb-4">Skill Utama Kelas</h2>
          <div className="flex flex-wrap gap-2">
            {CLASS_SKILLS.map((skill) => (
              <SkillBadge key={skill} label={skill} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
