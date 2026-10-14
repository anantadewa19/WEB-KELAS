interface Topic {
  title: string;
  definition: string;
  causes: string[];
  impact: string[];
  prevention: string[];
  labFile: string;
}

const topics: Topic[] = [
  {
    title: "SQL Injection",
    definition:
      "Teknik serangan di mana pengguna menyisipkan potongan perintah SQL lewat input aplikasi (misalnya kolom pencarian), sehingga mengubah makna query yang dijalankan database.",
    causes: [
      "Input pengguna digabung langsung ke string query SQL (concatenation).",
      "Tidak ada pemisahan antara 'kode SQL' dan 'data' dari pengguna.",
    ],
    impact: [
      "Data yang seharusnya rahasia bisa terbaca oleh pihak tidak berwenang.",
      "Data bisa diubah atau dihapus tanpa izin.",
      "Dalam kasus tertentu, penyerang bisa mengambil alih kendali database.",
    ],
    prevention: [
      "Gunakan parameterized query / prepared statement (tanda '?').",
      "Validasi dan batasi jenis input yang diterima.",
      "Terapkan prinsip least privilege pada akun database.",
    ],
    labFile: "app/api/students/search/route.ts",
  },
  {
    title: "Cross-Site Scripting (XSS)",
    definition:
      "Kerentanan yang memungkinkan penyerang menyisipkan skrip (biasanya JavaScript) ke halaman web, yang kemudian dijalankan di browser pengguna lain yang membuka halaman tersebut.",
    causes: [
      "Input pengguna (misalnya komentar) ditampilkan kembali sebagai HTML mentah tanpa sanitasi.",
      "Penggunaan dangerouslySetInnerHTML pada data yang tidak dipercaya.",
    ],
    impact: [
      "Pencurian sesi/cookie pengguna lain.",
      "Tampilan halaman dapat dimanipulasi (deface) atau dialihkan ke situs berbahaya.",
      "Penyebaran skrip berbahaya ke semua pengunjung halaman (Stored XSS).",
    ],
    prevention: [
      "Manfaatkan output encoding otomatis dari React (render sebagai teks biasa, bukan HTML).",
      "Jika memang butuh HTML dari pengguna, sanitasi dengan library seperti DOMPurify.",
      "Hindari dangerouslySetInnerHTML untuk data yang tidak dipercaya.",
    ],
    labFile: "app/comments/page.tsx",
  },
  {
    title: "Path Traversal",
    definition:
      "Kerentanan yang memungkinkan pengguna mengakses file di luar direktori yang seharusnya, dengan memanipulasi nama atau path file yang diminta (misalnya menggunakan '../').",
    causes: [
      "Nama file dari pengguna digabung langsung ke path direktori tanpa validasi.",
      "Tidak ada pembatasan direktori (sandboxing) maupun whitelist ekstensi file.",
    ],
    impact: [
      "File sensitif di server (misalnya file konfigurasi) berpotensi terbaca.",
      "Kebocoran informasi struktur direktori server.",
    ],
    prevention: [
      "Gunakan path.basename() untuk membuang komponen path seperti '../'.",
      "Terapkan whitelist ekstensi file yang diizinkan.",
      "Setelah path digabung, pastikan hasil akhirnya (resolved path) tetap berada di dalam direktori yang diizinkan.",
    ],
    labFile: "app/api/files/route.ts",
  },
];

export default function SecurityLabPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl font-bold mb-2">Security Lab</h1>
      <p className="text-node-muted mb-8">
        Materi singkat praktikum keamanan aplikasi web yang dipakai di project ini.
      </p>

      <div className="rounded-md border border-node-warn/50 bg-node-warn/10 p-4 text-sm text-node-warn mb-10">
        <strong>Disclaimer:</strong> Semua pengujian keamanan pada project ini hanya
        boleh dilakukan pada aplikasi laboratorium sendiri, localhost, atau sistem
        yang telah memberikan izin. Jangan pernah mencoba teknik-teknik ini pada
        sistem milik pihak lain tanpa izin tertulis.
      </div>

      <div className="flex flex-col gap-10">
        {topics.map((topic) => (
          <section
            key={topic.title}
            className="rounded-lg border border-node-line bg-node-panel p-6"
          >
            <h2 className="font-display text-xl font-semibold text-node-accent mb-2">
              {topic.title}
            </h2>
            <p className="text-node-text mb-4">{topic.definition}</p>

            <h3 className="text-sm font-semibold text-node-muted mt-4 mb-1">Penyebab</h3>
            <ul className="list-disc list-inside text-sm text-node-text space-y-1">
              {topic.causes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold text-node-muted mt-4 mb-1">Dampak</h3>
            <ul className="list-disc list-inside text-sm text-node-text space-y-1">
              {topic.impact.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold text-node-muted mt-4 mb-1">Pencegahan</h3>
            <ul className="list-disc list-inside text-sm text-node-text space-y-1">
              {topic.prevention.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>

            <p className="text-xs text-node-muted mt-4 font-mono">
              Lihat implementasi lab &amp; secure version di:{" "}
              <span className="text-node-accent">{topic.labFile}</span>
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
