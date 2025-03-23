const { execSync } = require('child_process');

// This script ensures Prisma Client is generated during Vercel builds
// It helps avoid issues with cached dependencies

try {
  console.log('Running prisma generate for Vercel deployment...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma Client generated successfully');
} catch (error) {
  console.error('Error generating Prisma Client:', error);
  process.exit(1);
} 