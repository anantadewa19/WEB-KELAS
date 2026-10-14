"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !message.trim()) {
      setError("Nama dan pesan tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal mengirim komentar.");
      }

      setName("");
      setMessage("");
      router.refresh(); // muat ulang data komentar dari server component
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama"
        maxLength={100}
        className="rounded-md border border-node-line bg-node-panel px-4 py-2 text-sm placeholder:text-node-muted focus:outline-none focus:border-node-accent"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tulis pesan atau kesan untuk kelas XI TKJ 3..."
        rows={3}
        maxLength={500}
        className="rounded-md border border-node-line bg-node-panel px-4 py-2 text-sm placeholder:text-node-muted focus:outline-none focus:border-node-accent resize-none"
      />
      {error && <p className="text-sm text-node-warn">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-md bg-node-accent text-node-bg px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}
