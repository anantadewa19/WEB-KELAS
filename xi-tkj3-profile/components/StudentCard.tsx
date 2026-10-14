import Link from "next/link";
import Image from "next/image";
import type { Student } from "@/lib/types";

export default function StudentCard({ student }: { student: Student }) {
  return (
    <div className="group rounded-lg border border-node-line bg-node-panel p-5 flex flex-col gap-3 hover:border-node-accent/60 transition-colors">
      <div className="h-40 w-full rounded-md overflow-hidden bg-node-bg relative">
        <Image
          src={`/student-images/${student.photo || "default-male.svg"}`}
          alt={`Foto ${student.full_name}`}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="font-display font-semibold text-lg">{student.full_name}</h3>
        <p className="text-sm text-node-muted">{student.expertise}</p>
      </div>
      <Link
        href={`/students/${student.id}`}
        className="mt-auto inline-flex items-center justify-center rounded-md border border-node-accent text-node-accent text-sm font-medium py-2 hover:bg-node-accent hover:text-node-bg transition-colors"
      >
        Lihat Profil
      </Link>
    </div>
  );
}
