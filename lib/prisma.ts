// lib/prisma.ts
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

const CONNECTION_LIMIT = 20;

const prismaClientSingleton = () => {
  console.log('[PRISMA_INIT] Initializing new PrismaClient...');
  const dbUrlString = process.env.DATABASE_URL;

  if (!dbUrlString) {
    console.warn('[PRISMA_INIT] WARNING: DATABASE_URL is missing! Returning a client that will fail at runtime.');
    // Return a client with a dummy URL to avoid immediate failure during Next.js build
    return new PrismaClient(); 
  }

  console.log('[PRISMA_INIT] DATABASE_URL found.');
  const dbUrl = new URL(dbUrlString);
  const isLocal = dbUrl.hostname === 'localhost' || dbUrl.hostname === '127.0.0.1';

  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.slice(1),
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
    connectionLimit: CONNECTION_LIMIT,
    allowPublicKeyRetrieval: true,
  } as any);

  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
};

declare global {
  var prisma_v3: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma: PrismaClient = (() => {
  if (process.env.NODE_ENV === 'production') {
    return prismaClientSingleton();
  }

  // Use a versioned identifier to force a fresh client if needed
  const PRISMA_VERSION = 'v3';
  const globalWithPrisma = globalThis as any;
  
  if (!globalWithPrisma[`prisma_${PRISMA_VERSION}`]) {
    globalWithPrisma[`prisma_${PRISMA_VERSION}`] = prismaClientSingleton();
  }
  
  return globalWithPrisma[`prisma_${PRISMA_VERSION}`];
})();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma_v3 = prisma;
}
