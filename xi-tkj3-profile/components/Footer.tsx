export default function Footer() {
  return (
    <footer className="border-t border-node-line py-8 mt-16">
      <div className="max-w-6xl mx-auto px-5 text-sm text-node-muted flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} XI TKJ 3 — Teknik Komputer dan Jaringan</p>
        <p>Dibangun dengan Next.js untuk pembelajaran, bukan untuk produksi publik.</p>
      </div>
    </footer>
  );
}
