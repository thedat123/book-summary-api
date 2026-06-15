import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IQuestionRepository } from '@domain/assessment/repositories/question.repository.interface';
import { Question } from '@domain/assessment/entities/question.entity';

@Injectable()
export class QuestionPrismaRepository implements IQuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    // TODO
    throw new Error('Not implemented');
  }

  async findByAssessmentId(assessmentId: string): Promise<Question[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async findByConceptId(conceptId: string): Promise<Question[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async saveMany(questions: Question[]): Promise<Question[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async deleteByAssessmentId(assessmentId: string): Promise<void> {
    // TODO
    throw new Error('Not implemented');
  }

  async countByAssessmentId(assessmentId: string): Promise<number> {
    // TODO
    throw new Error('Not implemented');
  }
}
