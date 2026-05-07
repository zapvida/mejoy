declare function require(id: string): any;

type GeneratedPrismaRuntime = typeof import('../../generated/prisma-client');

const runtimePrisma = require('../../generated/prisma-client') as GeneratedPrismaRuntime;

export const PrismaClient: GeneratedPrismaRuntime['PrismaClient'] = runtimePrisma.PrismaClient;

export const Prisma = runtimePrisma.Prisma;

export type PrismaClientInstance = import('../../generated/prisma-client').PrismaClient;
