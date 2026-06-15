import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Dev seed user — matches GUEST_USER_ID in current-user.decorator.ts.
 * This user satisfies the FK constraint on sources.owner_id, assessments, etc.
 * while auth is not yet implemented.
 *
 * Safe to run multiple times (upsert). Does not touch production data.
 */
const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const user = await prisma.user.upsert({
    where: { id: DEV_USER_ID },
    update: {},
    create: {
      id: DEV_USER_ID,
      email: 'dev@local.test',
      name: 'Dev User',
    },
  });

  console.log(`✓ Dev user seeded: ${user.email} (${user.id})`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
