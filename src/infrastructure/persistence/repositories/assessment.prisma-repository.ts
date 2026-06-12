import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IAssessmentRepository,
  UpdateAssessmentData,
} from '@domain/assessment/repositories/assessment.repository.interface';
import { Assessment } from '@domain/assessment/entities/assessment.entity';

@Injectable()
export class AssessmentPrismaRepository implements IAssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Assessment | null> {
    // TODO
    throw new Error('Not implemented');
  }

  async findBySourceId(sourceId: string): Promise<Assessment[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async save(assessment: Assessment): Promise<Assessment> {
    // TODO
    throw new Error('Not implemented');
  }

  async update(id: string, partial: UpdateAssessmentData): Promise<Assessment> {
    // TODO
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    // TODO
    throw new Error('Not implemented');
  }

  async existsById(id: string): Promise<boolean> {
    // TODO
    throw new Error('Not implemented');
  }

  private toDomain(record: any): Assessment {
    // TODO
    throw new Error('Not implemented');
  }
}
