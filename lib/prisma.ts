// lib/prisma.ts
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

const CONNECTION_LIMIT = 20;

const prismaClientSingleton = () => {
  console.log('[PRISMA_INIT] Initializing new PrismaClient...');
  const dbUrlString = process.env.DATABASE_URL;

  if (!dbUrlString) {
    if (process.env.NODE_ENV === 'production') {
       console.warn('[PRISMA_INIT] WARNING: DATABASE_URL is missing in PRODUCTION/BUILD.');
    }
    // Return a dummy client for build-time safety
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

const PRISMA_VERSION = 'v4';
declare global {
  var prisma_v4: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Lazy-loaded prisma instance
let _prisma: PrismaClient | null = null;

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get: (target, prop, receiver) => {
    if (!_prisma) {
      if (process.env.NODE_ENV === 'production') {
        _prisma = prismaClientSingleton();
      } else {
        const globalWithPrisma = globalThis as any;
        if (!globalWithPrisma[`prisma_${PRISMA_VERSION}`]) {
          globalWithPrisma[`prisma_${PRISMA_VERSION}`] = prismaClientSingleton();
        }
        _prisma = globalWithPrisma[`prisma_${PRISMA_VERSION}`];
      }
    }
    return Reflect.get(_prisma!, prop, receiver);
  },
});
