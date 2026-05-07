import { PrismaClient } from '@/lib/prisma-client';

const g = global as any;

export const prisma = g.prisma ?? new PrismaClient({ 
  log: process.env.NODE_ENV === 'development' ? ['error','warn'] : ['error'] 
});

if (process.env.NODE_ENV !== 'production') g.prisma = prisma;

export function getPrisma() { 
  return prisma; 
}

export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
  }
}
