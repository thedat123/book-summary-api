import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';

/**
 * PrismaModule — Global Infrastructure Module
 *
 * Responsibility: Provide PrismaService as a singleton across all feature modules.
 * Why @Global: All repository implementations need PrismaService. Marking it global
 *   avoids importing PrismaModule in every feature module.
 * Scalability: Add database health checks or read replicas here when needed.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
