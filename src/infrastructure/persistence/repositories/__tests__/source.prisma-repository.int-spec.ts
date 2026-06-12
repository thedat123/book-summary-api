/**
 * Integration tests for SourcePrismaRepository
 *
 * Prerequisites:
 *   - TEST_DATABASE_URL env var must point to a real PostgreSQL test database
 *   - Run `prisma migrate deploy` against that DB before executing these tests
 *
 * Run with:
 *   pnpm test:integration
 *   (maps to: jest --config jest.integration.config.js)
 */
import { SourcePrismaRepository } from '../source.prisma-repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Source } from '@domain/source/entities/source.entity';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

const TEST_OWNER_ID = '00000000-0000-0000-0000-000000000002';

const makeSourceEntity = (overrides: Partial<{ title: string; status: SourceStatus }> = {}): Source =>
  new Source(
    crypto.randomUUID(),
    TEST_OWNER_ID,
    overrides.title ?? 'Integration Test Source',
    SourceType.PDF,
    null,
    overrides.status ?? SourceStatus.PROCESSING,
    null,
    new Date(),
  );

describe('SourcePrismaRepository (integration)', () => {
  let prismaService: PrismaService;
  let repository: SourcePrismaRepository;
  let createdSourceIds: string[] = [];

  beforeAll(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect();

    // Seed the test user required by the FK constraint on sources.ownerId
    await prismaService.$executeRaw`
      INSERT INTO users (id, email, name)
      VALUES (${TEST_OWNER_ID}::uuid, 'source-integration-test@example.com', 'Source Integration Test User')
      ON CONFLICT (id) DO NOTHING
    `;

    repository = new SourcePrismaRepository(prismaService);
  });

  afterAll(async () => {
    if (createdSourceIds.length > 0) {
      await prismaService.source.deleteMany({ where: { id: { in: createdSourceIds } } });
    }
    await prismaService.$disconnect();
  });

  describe('save()', () => {
    // TODO: persists a Source entity and returns it with the same id
    // TODO: returned value is an instance of Source (toDomain mapping works)
    // TODO: status is PROCESSING after save
  });

  describe('findById()', () => {
    // TODO: retrieves a persisted source by id
    // TODO: returns null for a non-existent id
  });

  describe('findByOwnerId()', () => {
    // TODO: returns only sources belonging to the specified owner
    // TODO: respects limit and offset options (pagination)
  });

  describe('updateStatus()', () => {
    // TODO: updates the status of an existing source
  });

  describe('delete()', () => {
    // TODO: removes the source from the database (findById returns null after delete)
  });

  describe('countByOwnerId()', () => {
    // TODO: returns the correct count of sources for an owner
    // TODO: count increases by 1 after saving a new source
  });

  describe('existsById()', () => {
    // TODO: returns true for an existing source
    // TODO: returns false for a non-existent source
  });

  describe('toDomain mapping', () => {
    // TODO: maps Prisma record back to a proper Source domain entity (instanceof Source)
    // TODO: ownerId and sourceType are correctly mapped from the DB record
  });
});
