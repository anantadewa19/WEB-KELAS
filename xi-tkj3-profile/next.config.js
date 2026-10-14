/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Diaktifkan agar foto placeholder .svg di /public/student-images dapat dirender.
    // Jika mengganti dengan foto asli (.jpg/.png), pengaturan ini boleh dihapus.
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
