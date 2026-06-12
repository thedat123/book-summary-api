import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IConceptRepository } from '@domain/concept/repositories/concept.repository.interface';
import { Concept } from '@domain/concept/entities/concept.entity';

@Injectable()
export class ConceptPrismaRepository implements IConceptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Concept | null> {
    // TODO
    throw new Error('Not implemented');
  }

  async findBySourceId(sourceId: string): Promise<Concept[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async findBySourceIdOrderedByImportance(sourceId: string): Promise<Concept[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async save(concept: Concept): Promise<Concept> {
    // TODO
    throw new Error('Not implemented');
  }

  async saveMany(concepts: Concept[]): Promise<Concept[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async deleteBySourceId(sourceId: string): Promise<void> {
    // TODO
    throw new Error('Not implemented');
  }

  async countBySourceId(sourceId: string): Promise<number> {
    // TODO
    throw new Error('Not implemented');
  }

  async existsById(id: string): Promise<boolean> {
    // TODO
    throw new Error('Not implemented');
  }

  private toDomain(record: any): Concept {
    // TODO
    throw new Error('Not implemented');
  }
}
