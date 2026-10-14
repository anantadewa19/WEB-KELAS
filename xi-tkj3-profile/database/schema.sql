-- database/schema.sql
-- Jalankan dengan:
--   mysql -u root -p < database/schema.sql
-- atau setelah database dibuat:
--   mysql -u root -p xi_tkj3_profile < database/schema.sql

CREATE DATABASE IF NOT EXISTS xi_tkj3_profile
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE xi_tkj3_profile;

-- Tabel utama data siswa
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  nickname VARCHAR(50),
  attendance_number INT,
  class_name VARCHAR(30) DEFAULT 'XI TKJ 3',
  expertise VARCHAR(150),
  skills TEXT COMMENT 'Disimpan sebagai JSON array string, contoh: ["Mikrotik","Linux"]',
  hobby VARCHAR(255),
  dream_job VARCHAR(150),
  description TEXT,
  photo VARCHAR(255) COMMENT 'Nama file foto di /public/student-images/',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk fitur guestbook / komentar (bahan praktikum XSS)
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk mempercepat pencarian nama siswa
CREATE INDEX idx_students_full_name ON students (full_name);
CREATE INDEX idx_students_nickname ON students (nickname);
