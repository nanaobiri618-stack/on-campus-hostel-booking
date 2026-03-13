import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const prismaClientSingleton = () => {
  // #region agent log
  fetch('http://127.0.0.1:7841/ingest/841e6ebf-1340-4009-89e5-bc61a524e4f8', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': 'a29563',
    },
    body: JSON.stringify({
      sessionId: 'a29563',
      runId: 'pre-fix',
      hypothesisId: 'H1',
      location: 'lib/prisma.ts:prismaClientSingleton',
      message: 'Checking DATABASE_URL visibility for Prisma',
      data: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlHostPort: process.env.DATABASE_URL
          ? process.env.DATABASE_URL.split('@')[1]?.split('/')[0] ?? null
          : null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

