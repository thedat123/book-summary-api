import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ILearnerConceptMasteryRepository,
  UpsertMasteryInput,
} from '@domain/mastery/repositories/learner-concept-mastery.repository.interface';
import { LearnerConceptMastery } from '@domain/mastery/entities/learner-concept-mastery.entity';

/**
 * LearnerConceptMasteryPrismaRepository — Infrastructure Implementation
 *
 * Responsibility: Persist and retrieve mastery scores per (userId, conceptId) pair.
 *
 * Prisma composite unique key: userId_conceptId
 *
 * upsert() pattern:
 *   prisma.learnerConceptMastery.upsert({
 *     where: { userId_conceptId: { userId, conceptId } },
 *     create: { userId, conceptId, masteryScore, updatedAt: new Date() },
 *     update: { masteryScore, updatedAt: new Date() },
 *   })
 *
 * upsertMany() — delegate each item to upsert() via Promise.all
 *
 * findByUserIdAndSourceId() — requires joining through concept:
 *   where: { userId, concept: { sourceId } }
 *
 * toDomain() note:
 *   - Prisma returns Decimal for masteryScore → cast with Number()
 *   - updatedAt ?? null for nullable handling
 */
@Injectable()
export class LearnerConceptMasteryPrismaRepository implements ILearnerConceptMasteryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserIdAndConceptId(userId: string, conceptId: string): Promise<LearnerConceptMastery | null> {
    // TODO: prisma.learnerConceptMastery.findUnique({ where: { userId_conceptId: { userId, conceptId } } })
    // TODO: return record ? this.toDomain(record) : null
    throw new Error('Not implemented');
  }

  async findByUserId(userId: string): Promise<LearnerConceptMastery[]> {
    // TODO: prisma.learnerConceptMastery.findMany({ where: { userId } })
    // TODO: return records.map(r => this.toDomain(r))
    throw new Error('Not implemented');
  }

  async findByConceptId(conceptId: string): Promise<LearnerConceptMastery[]> {
    // TODO: prisma.learnerConceptMastery.findMany({ where: { conceptId } })
    throw new Error('Not implemented');
  }

  async findByUserIdAndSourceId(userId: string, sourceId: string): Promise<LearnerConceptMastery[]> {
    // TODO: prisma.learnerConceptMastery.findMany({ where: { userId, concept: { sourceId } } })
    // Note: this works because Prisma allows filtering through relations
    throw new Error('Not implemented');
  }

  async upsert(userId: string, conceptId: string, masteryScore: number): Promise<LearnerConceptMastery> {
    // TODO: prisma upsert with composite key — see class-level docs for exact shape
    throw new Error('Not implemented');
  }

  async upsertMany(inputs: UpsertMasteryInput[]): Promise<LearnerConceptMastery[]> {
    // TODO: Promise.all(inputs.map(i => this.upsert(i.userId, i.conceptId, i.masteryScore)))
    throw new Error('Not implemented');
  }

  private toDomain(record: any): LearnerConceptMastery {
    // TODO: new LearnerConceptMastery(
    //   record.userId,
    //   record.conceptId,
    //   record.masteryScore !== null ? Number(record.masteryScore) : null,
    //   record.updatedAt ?? null,
    // )
    throw new Error('Not implemented');
  }
}
