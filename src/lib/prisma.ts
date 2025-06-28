// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declara uma variável global para armazenar a instância do prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Cria a instância do Prisma, reutilizando a instância global se ela existir
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;