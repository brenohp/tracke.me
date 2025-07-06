// Caminho do arquivo: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    // Adicionamos o subdomínio à lista
    allowedDevOrigins: ["lvh.me", "negocioteste1.lvh.me"],
  },
};

module.exports = nextConfig;