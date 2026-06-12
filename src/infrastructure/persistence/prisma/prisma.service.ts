import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService — Infrastructure
 *
 * Responsibility: Manage the Prisma client lifecycle (connect on startup,
 *   disconnect on shutdown). All repository implementations inject this service.
 * Why it exists: Prisma does not auto-connect — explicit lifecycle hooks are
 *   required for graceful startup/shutdown in NestJS.
 * Scalability: Add query logging, soft-delete middleware, or audit-trail
 *   middleware via prisma.$use() here without touching repositories.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
