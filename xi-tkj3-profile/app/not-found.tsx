import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-5 py-24 text-center">
      <p className="font-mono text-node-accent text-sm mb-2">404</p>
      <h1 className="font-display text-2xl font-semibold mb-4">Halaman tidak ditemukan</h1>
      <p className="text-node-muted mb-6">Siswa atau halaman yang Anda cari tidak tersedia.</p>
      <Link href="/students" className="text-node-accent hover:underline">
        ← Kembali ke Daftar Siswa
      </Link>
    </div>
  );
}
