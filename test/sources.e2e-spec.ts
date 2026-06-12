/**
 * E2E tests for the Sources API.
 *
 * Prerequisites:
 *   - TEST_DATABASE_URL must point to a running PostgreSQL test database
 *   - Run `prisma migrate deploy` against that DB before executing
 *
 * Run with:
 *   pnpm test:e2e
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Sources (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /sources', () => {
    it('creates a new source and returns 201 with PROCESSING status', async () => {
      const res = await request(app.getHttpServer())
        .post('/sources')
        .send({ title: 'Clean Code', sourceType: 'PDF' })
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe('Clean Code');
      expect(res.body.status).toBe('PROCESSING');
      expect(res.body.ownerId).toBe('stub-user-id');
    });

    it('returns 400 when title is missing', async () => {
      await request(app.getHttpServer())
        .post('/sources')
        .send({ sourceType: 'PDF' })
        .expect(400);
    });

    it('returns 400 when sourceType is invalid', async () => {
      await request(app.getHttpServer())
        .post('/sources')
        .send({ title: 'Test', sourceType: 'INVALID' })
        .expect(400);
    });
  });

  describe('GET /sources', () => {
    it('returns a paginated list of sources', async () => {
      const res = await request(app.getHttpServer())
        .get('/sources')
        .expect(200);

      expect(res.body.items).toBeDefined();
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(typeof res.body.total).toBe('number');
      expect(res.body.limit).toBe(20);
      expect(res.body.offset).toBe(0);
    });
  });

  describe('GET /sources/:id', () => {
    it('returns 404 for a non-existent source', async () => {
      await request(app.getHttpServer())
        .get('/sources/00000000-0000-0000-0000-000000000099')
        .expect(404);
    });

    it('returns the source when it exists and belongs to the stub user', async () => {
      const created = await request(app.getHttpServer())
        .post('/sources')
        .send({ title: 'E2E Test Source', sourceType: 'WEB' })
        .expect(201);

      const res = await request(app.getHttpServer())
        .get(`/sources/${created.body.id}`)
        .expect(200);

      expect(res.body.id).toBe(created.body.id);
      expect(res.body.title).toBe('E2E Test Source');
    });
  });

  describe('DELETE /sources/:id', () => {
    it('deletes an existing source and returns 204', async () => {
      const created = await request(app.getHttpServer())
        .post('/sources')
        .send({ title: 'Source To Delete', sourceType: 'API' })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/sources/${created.body.id}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/sources/${created.body.id}`)
        .expect(404);
    });

    it('returns 404 when trying to delete a non-existent source', async () => {
      await request(app.getHttpServer())
        .delete('/sources/00000000-0000-0000-0000-000000000099')
        .expect(404);
    });
  });
});
