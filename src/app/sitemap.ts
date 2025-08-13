// Caminho: src/app/sitemap.ts

import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

// Esta função gera o ficheiro sitemap.xml em tempo de build
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://clienda.app';

  // 1. Páginas Estáticas e de Marketing (Core do Site)
  const staticRoutes = [
    { url: `${APP_URL}/`, changeFrequency: 'monthly' as const, priority: 1.0 },
    { url: `${APP_URL}/#features`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${APP_URL}/#pricing`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${APP_URL}/#contact`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${APP_URL}/updates`, changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  // 2. Páginas de Autenticação e Fluxo de Conversão
  const authRoutes = [
    { url: `${APP_URL}/login`, changeFrequency: 'yearly' as const, priority: 0.6 },
    { url: `${APP_URL}/forgot-password`, changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${APP_URL}/reset-password`, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${APP_URL}/checkout`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${APP_URL}/checkout/success`, changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  /*
  // 3. (Futuro) Páginas Dinâmicas do Blog
  // Descomente esta seção quando tiver um blog.
  // Esta parte buscaria todos os posts do seu banco de dados.
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const blogUrls = posts.map(post => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  */

  const allUrls = [
    ...staticRoutes,
    ...authRoutes,
    // ...blogUrls, // Adicionar quando o blog existir
  ];

  // Adiciona a data da última modificação a todas as URLs que não a têm
  return allUrls.map(route => ({
    ...route,
    lastModified: new Date(),
  }));
}