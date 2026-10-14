// lib/db.ts
// Koneksi ke database MariaDB menggunakan connection pool.
// Semua kredensial diambil dari environment variable (.env), TIDAK di-hardcode.

import mysql from "mysql2/promise";

// Pool dibuat sekali dan dipakai berulang (lebih efisien daripada membuka
// koneksi baru setiap ada request).
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
