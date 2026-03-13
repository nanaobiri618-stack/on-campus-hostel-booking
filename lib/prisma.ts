import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb({
    host: 'localhost',
    user: 'root',
    password: 'Kwesiobiri@8',
    database: 'oncampus_db',
    port: 3306,
    connectionLimit: 10,
    insertIdAsNumber: true,
  });

  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;