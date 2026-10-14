import Link from "next/link";

// Navbar sederhana. "status dot" hijau meniru lampu indikator perangkat jaringan aktif.
export default function Navbar() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/students", label: "Daftar Siswa" },
    { href: "/comments", label: "Guestbook" },
    { href: "/security-lab", label: "Security Lab" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-node-line bg-node-bg/90 backdrop-blur">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-node-accent" />
          XI TKJ 3
        </Link>
        <ul className="flex items-center gap-6 text-sm text-node-muted">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-node-text transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
