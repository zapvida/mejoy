const fs = require('fs');
const path = require('path');

function ensurePrismaLink() {
  let packageDir;

  try {
    packageDir = path.dirname(require.resolve('@prisma/client/package.json'));
  } catch (error) {
    console.warn('[link-prisma-client] @prisma/client not found, skipping link');
    return;
  }

  const prismaDir = path.join(packageDir, '.prisma');
  const targetPath = path.resolve(packageDir, '..', '..', '.prisma');
  const relativeTarget = '../../.prisma';

  try {
    const stat = fs.lstatSync(prismaDir);
    if (stat.isSymbolicLink()) {
      return;
    }
  } catch (error) {
    // Missing path is expected on pnpm installs.
  }

  if (!fs.existsSync(targetPath)) {
    console.warn(`[link-prisma-client] target not found, skipping link: ${targetPath}`);
    return;
  }

  try {
    fs.symlinkSync(relativeTarget, prismaDir, process.platform === 'win32' ? 'junction' : 'dir');
    console.log(`[link-prisma-client] linked ${prismaDir} -> ${relativeTarget}`);
  } catch (error) {
    console.warn('[link-prisma-client] unable to create Prisma symlink:', error.message);
  }
}

ensurePrismaLink();
