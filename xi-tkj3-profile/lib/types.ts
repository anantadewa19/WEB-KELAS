// lib/types.ts
// Tipe data siswa yang dipakai bersama di komponen dan API routes.

export interface Student {
  id: number;
  full_name: string;
  nickname: string | null;
  attendance_number: number | null;
  class_name: string;
  expertise: string | null;
  skills: string[]; // sudah di-parse dari kolom TEXT/JSON di database
  hobby: string | null;
  dream_job: string | null;
  description: string | null;
  photo: string | null;
}

export interface Comment {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

// Helper untuk mengubah kolom `skills` (disimpan sebagai TEXT berisi JSON string)
// menjadi array string yang aman dipakai di komponen React.
export function parseSkills(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
