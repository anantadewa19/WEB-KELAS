"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// Komponen client karena butuh interaksi (state input + navigasi saat submit).
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    // encodeURIComponent penting agar karakter khusus tidak merusak URL.
    router.push(trimmed ? `/students?search=${encodeURIComponent(trimmed)}` : "/students");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari nama siswa..."
        className="flex-1 rounded-md border border-node-line bg-node-panel px-4 py-2 text-sm placeholder:text-node-muted focus:outline-none focus:border-node-accent"
      />
      <button
        type="submit"
        className="rounded-md bg-node-accent text-node-bg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Search
      </button>
    </form>
  );
}
