import CommentForm from "@/components/CommentForm";
import pool from "@/lib/db";
// Catatan: jika suatu saat butuh me-render HTML terbatas dari pengguna
// (bukan sekadar teks biasa seperti di halaman ini), gunakan library
// sanitasi seperti `isomorphic-dompurify` sebelum dangerouslySetInnerHTML.
// Lihat docs/security-lab.md bagian XSS untuk contoh lengkapnya.

interface CommentRow {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

const VULNERABLE_LAB_ENABLED = process.env.ENABLE_VULNERABLE_LAB === "true";

async function getComments(): Promise<CommentRow[]> {
  const [rows] = await pool.query(
    "SELECT id, name, message, created_at FROM comments ORDER BY created_at DESC LIMIT 50"
  );
  return rows as CommentRow[];
}

export default async function CommentsPage() {
  let comments: CommentRow[] = [];
  let dbError = false;

  try {
    comments = await getComments();
  } catch (error) {
    console.error("Gagal mengambil komentar:", error);
    dbError = true;
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl font-bold mb-2">Guestbook</h1>
      <p className="text-node-muted mb-8">
        Tinggalkan pesan atau kesan untuk kelas XI TKJ 3.
      </p>

      <CommentForm />

      <div className="connector-line my-10" />

      {dbError && (
        <p className="text-node-warn text-sm">Tidak dapat memuat komentar dari database.</p>
      )}

      <ul className="flex flex-col gap-4">
        {comments.map((comment) => (
          <li key={comment.id} className="rounded-md border border-node-line bg-node-panel p-4">
            <p className="text-sm font-medium text-node-accent mb-1">{comment.name}</p>

            {VULNERABLE_LAB_ENABLED ? (
              // SECURITY LAB: XSS example
              // -----------------------------------------------------------
              // KESALAHAN: pesan komentar (input pengguna) dirender langsung
              // sebagai HTML mentah menggunakan dangerouslySetInnerHTML, tanpa
              // sanitasi apa pun. Jika seorang pengguna mengirim pesan berisi
              // tag <script> atau atribut event handler (mis. onerror pada
              // <img>), kode tersebut akan IKUT DIEKSEKUSI di browser
              // pengguna lain yang membuka halaman ini. Inilah XSS
              // (Stored XSS) -- kode "menempel" di database dan menyerang
              // setiap orang yang melihat halaman.
              //
              // HANYA untuk didemonstrasikan di localhost/lab tertutup.
              <div
                className="text-sm text-node-text"
                dangerouslySetInnerHTML={{ __html: comment.message }}
              />
            ) : (
              // SECURE VERSION
              // -----------------------------------------------------------
              // PERBAIKAN #1 (paling direkomendasikan untuk teks biasa):
              // tampilkan sebagai teks biasa lewat JSX `{comment.message}`.
              // React otomatis melakukan output encoding, sehingga karakter
              // seperti "<" dan ">" ditampilkan sebagai teks, bukan
              // dieksekusi sebagai tag HTML.
              //
              // PERBAIKAN #2 (jika suatu saat memang perlu HTML terbatas,
              // misalnya bold/italic dari editor teks kaya): sanitasi dulu
              // dengan library seperti DOMPurify sebelum dirender, contoh:
              //   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.message) }}
              // Baris di bawah ini sengaja memakai Perbaikan #1 karena
              // guestbook ini hanya butuh teks biasa.
              <p className="text-sm text-node-text whitespace-pre-wrap break-words">
                {comment.message}
              </p>
            )}

            <p className="text-xs text-node-muted mt-2">
              {new Date(comment.created_at).toLocaleString("id-ID")}
            </p>
          </li>
        ))}
      </ul>

      {!dbError && comments.length === 0 && (
        <p className="text-node-muted text-sm">Belum ada komentar. Jadilah yang pertama!</p>
      )}
    </div>
  );
}
