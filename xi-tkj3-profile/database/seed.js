// database/seed.js
// Script sederhana untuk mengisi tabel `students` dengan 10 data dummy.
// Jalankan dengan: npm run db:seed
// (pastikan file .env sudah diisi dan database + tabel sudah dibuat dari schema.sql)

require("dotenv").config();
const mysql = require("mysql2/promise");

const students = [
  {
    full_name: "Ahmad Ramadhan",
    nickname: "Ahmad",
    attendance_number: 1,
    expertise: "Network Administration",
    skills: ["Mikrotik", "Cisco", "Troubleshooting Jaringan"],
    hobby: "Merakit PC, Futsal",
    dream_job: "Network Engineer",
    description: "Suka mengulik konfigurasi router dan switch sejak kelas X.",
    photo: "default-male.svg",
  },
  {
    full_name: "Budi Santoso",
    nickname: "Budi",
    attendance_number: 2,
    expertise: "Network & System Administration",
    skills: ["Linux", "Windows Server", "Mikrotik"],
    hobby: "Gaming, Membaca dokumentasi teknis",
    dream_job: "System Administrator",
    description: "Senang mengelola server dan otomatisasi tugas dengan skrip sederhana.",
    photo: "default-male.svg",
  },
  {
    full_name: "Citra Lestari",
    nickname: "Citra",
    attendance_number: 3,
    expertise: "Web Development",
    skills: ["HTML", "CSS", "JavaScript", "Next.js"],
    hobby: "Desain grafis, Menulis blog",
    dream_job: "Front-End Developer",
    description: "Tertarik membuat tampilan website yang rapi dan mudah digunakan.",
    photo: "default-female.svg",
  },
  {
    full_name: "Dimas Pratama",
    nickname: "Dimas",
    attendance_number: 4,
    expertise: "Cyber Security",
    skills: ["Linux", "Wireshark", "Troubleshooting Jaringan"],
    hobby: "CTF (Capture The Flag), Mendaki",
    dream_job: "Security Analyst",
    description: "Aktif belajar konsep keamanan jaringan lewat lab lokal dan CTF pemula.",
    photo: "default-male.svg",
  },
  {
    full_name: "Eka Putri",
    nickname: "Eka",
    attendance_number: 5,
    expertise: "Server Administration",
    skills: ["Windows Server", "Linux", "Cisco"],
    hobby: "Fotografi, Organisasi OSIS",
    dream_job: "IT Support Specialist",
    description: "Berpengalaman membantu teman-teman kelas troubleshooting perangkat.",
    photo: "default-female.svg",
  },
  {
    full_name: "Fajar Maulana",
    nickname: "Fajar",
    attendance_number: 6,
    expertise: "Network Administration",
    skills: ["Mikrotik", "Cisco", "Linux"],
    hobby: "Robotik, Sepak bola",
    dream_job: "Network Consultant",
    description: "Aktif di ekstrakurikuler robotik dan suka merancang topologi jaringan.",
    photo: "default-male.svg",
  },
  {
    full_name: "Gina Amelia",
    nickname: "Gina",
    attendance_number: 7,
    expertise: "Web Development",
    skills: ["JavaScript", "Next.js", "HTML", "CSS"],
    hobby: "Menulis cerita, Coding project kecil",
    dream_job: "Full-Stack Developer",
    description: "Sedang membangun beberapa project web sederhana di waktu luang.",
    photo: "default-female.svg",
  },
  {
    full_name: "Hendra Saputra",
    nickname: "Hendra",
    attendance_number: 8,
    expertise: "Network & System Administration",
    skills: ["Mikrotik", "Windows Server", "Troubleshooting Jaringan"],
    hobby: "Otomotif, Elektronika",
    dream_job: "Network Engineer",
    description: "Hobi membongkar-pasang perangkat elektronik dan jaringan rumahan.",
    photo: "default-male.svg",
  },
  {
    full_name: "Intan Permata",
    nickname: "Intan",
    attendance_number: 9,
    expertise: "Cyber Security",
    skills: ["Linux", "Cisco", "Wireshark"],
    hobby: "Membaca, Diskusi teknologi",
    dream_job: "Penetration Tester",
    description: "Tertarik mendalami keamanan siber secara etis dan bertanggung jawab.",
    photo: "default-female.svg",
  },
  {
    full_name: "Joko Prasetyo",
    nickname: "Joko",
    attendance_number: 10,
    expertise: "Server Administration",
    skills: ["Linux", "Windows Server", "Mikrotik"],
    hobby: "Bermain musik, Server pribadi",
    dream_job: "Cloud Engineer",
    description: "Mengelola server Minecraft pribadi sebagai latihan administrasi server.",
    photo: "default-male.svg",
  },
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("Menghapus data lama di tabel students...");
  await connection.execute("DELETE FROM students");

  console.log("Memasukkan 10 data siswa dummy...");
  for (const s of students) {
    await connection.execute(
      `INSERT INTO students
        (full_name, nickname, attendance_number, class_name, expertise, skills, hobby, dream_job, description, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.full_name,
        s.nickname,
        s.attendance_number,
        "XI TKJ 3",
        s.expertise,
        JSON.stringify(s.skills),
        s.hobby,
        s.dream_job,
        s.description,
        s.photo,
      ]
    );
  }

  console.log("Selesai! 10 siswa dummy berhasil dimasukkan.");
  await connection.end();
}

main().catch((err) => {
  console.error("Gagal melakukan seeding:", err);
  process.exit(1);
});
