// Caminho do arquivo: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    // Adicionamos o subdomínio à lista
    allowedDevOrigins: ["tracke-me.vercel.app", "lvh.me", "negocioteste1.lvh.me"],
  },
};

module.exports = nextConfig;