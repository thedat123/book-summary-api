import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ISourceRepository,
  FindSourcesOptions,
  UpdateSourceData,
} from '@domain/source/repositories/source.repository.interface';
import { Source, AiSnapshot } from '@domain/source/entities/source.entity';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

/**
 * SourcePrismaRepository — Infrastructure Implementation
 *
 * Responsibility: Map between Prisma records and Source domain entities.
 * Dependency: PrismaService (constructor injection)
 *
 * toDomain() mapping notes:
 *   - cast record.sourceType → SourceType enum
 *   - cast record.status    → SourceStatus enum
 *   - cast record.aiSnapshot → AiSnapshot | null (stored as JSON in Prisma)
 *   - use ?? null for nullable fields (sourceUrl, createdAt)
 *
 * save() note:
 *   - aiSnapshot must be cast (source.aiSnapshot ?? undefined) as unknown as object
 *     because Prisma expects InputJsonValue, not the domain type
 *
 * update() note:
 *   - Build the data object conditionally — only include fields present in `partial`
 *     to avoid accidentally nulling fields not included in the update
 *
 * Integration tests: see __tests__/source.prisma-repository.int-spec.ts
 */
@Injectable()
export class SourcePrismaRepository implements ISourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Source | null> {
    // TODO: prisma.source.findUnique({ where: { id } })
    // TODO: return record ? this.toDomain(record) : null
    throw new Error('Not implemented');
  }

  async findByOwnerId(ownerId: string, options?: FindSourcesOptions): Promise<Source[]> {
    // TODO: prisma.source.findMany with where: { ownerId, optional status filter }
    // TODO: take: options?.limit, skip: options?.offset, orderBy: { createdAt: 'desc' }
    // TODO: return records.map(r => this.toDomain(r))
    throw new Error('Not implemented');
  }

  async findByOwnerIdAndStatus(ownerId: string, status: SourceStatus): Promise<Source[]> {
    // TODO: prisma.source.findMany({ where: { ownerId, status }, orderBy: { createdAt: 'desc' } })
    throw new Error('Not implemented');
  }

  async save(source: Source): Promise<Source> {
    // TODO: prisma.source.create({ data: { id, ownerId, title, sourceType, sourceUrl, status, aiSnapshot (cast), createdAt } })
    throw new Error('Not implemented');
  }

  async updateStatus(id: string, status: SourceStatus): Promise<Source> {
    // TODO: prisma.source.update({ where: { id }, data: { status } })
    throw new Error('Not implemented');
  }

  async update(id: string, partial: UpdateSourceData): Promise<Source> {
    // TODO: build data object — spread each field from partial only if !== undefined
    // TODO: prisma.source.update({ where: { id }, data })
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    // TODO: prisma.source.delete({ where: { id } })
    throw new Error('Not implemented');
  }

  async existsById(id: string): Promise<boolean> {
    // TODO: prisma.source.count({ where: { id } }) → count > 0
    throw new Error('Not implemented');
  }

  async countByOwnerId(ownerId: string): Promise<number> {
    // TODO: prisma.source.count({ where: { ownerId } })
    throw new Error('Not implemented');
  }

  private toDomain(record: any): Source {
    // TODO: return new Source(record.id, record.ownerId, record.title, record.sourceType as SourceType,
    //          record.sourceUrl ?? null, record.status as SourceStatus,
    //          record.aiSnapshot as AiSnapshot | null, record.createdAt ?? null)
    throw new Error('Not implemented');
  }
}
