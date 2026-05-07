const fs = require('fs');
const path = require('path');

function syncPrismaGeneratedClient() {
  let packageDir;

  try {
    packageDir = path.dirname(require.resolve('@prisma/client/package.json'));
  } catch (error) {
    console.warn('[sync-prisma-generated] @prisma/client not found, skipping sync');
    return;
  }

  const sourceDir = path.resolve(packageDir, '..', '..', '.prisma', 'client');
  const targetDir = path.resolve(process.cwd(), 'generated/prisma-client');

  if (!fs.existsSync(sourceDir)) {
    console.warn(`[sync-prisma-generated] source not found: ${sourceDir}`);
    return;
  }

  fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log(`[sync-prisma-generated] copied ${sourceDir} -> ${targetDir}`);
}

syncPrismaGeneratedClient();
