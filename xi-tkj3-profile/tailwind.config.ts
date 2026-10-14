import type { Config } from "tailwindcss";

// Tema warna terinspirasi dari dunia jaringan komputer:
// biru gelap seperti terminal/server room + hijau "status aktif" pada perangkat jaringan
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        node: {
          bg: "#0D1321",      // latar utama, seperti layar terminal gelap
          panel: "#141B2E",   // panel/kartu
          line: "#1F2A44",    // garis pembatas
          accent: "#3DDC97",  // hijau LED aktif (status indicator perangkat jaringan)
          accent2: "#5B8CFF", // biru konektor/kabel jaringan
          warn: "#F2A65A",    // oranye peringatan (dipakai di security lab)
          text: "#E7ECF5",
          muted: "#8B97AE",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(#1F2A44 1px, transparent 1px), linear-gradient(90deg, #1F2A44 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
    },
  },
  plugins: [],
};
export default config;
