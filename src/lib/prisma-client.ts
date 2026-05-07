declare function require(id: string): any;

type GeneratedPrismaRuntime = typeof import('../../generated/prisma-client');

const runtimePrisma = require('@prisma/client') as GeneratedPrismaRuntime;

export const PrismaClient: GeneratedPrismaRuntime['PrismaClient'] = runtimePrisma.PrismaClient;

export type PrismaClientInstance = import('../../generated/prisma-client').PrismaClient;
