import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAssessmentAttemptRepository } from '@domain/assessment/repositories/assessment-attempt.repository.interface';
import { AssessmentAttempt } from '@domain/assessment/entities/assessment-attempt.entity';
import { QuestionAttempt } from '@domain/assessment/entities/question-attempt.entity';

@Injectable()
export class AssessmentAttemptPrismaRepository implements IAssessmentAttemptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AssessmentAttempt | null> {
    // TODO
    throw new Error('Not implemented');
  }

  async findByUserId(userId: string): Promise<AssessmentAttempt[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async findByUserIdAndAssessmentId(userId: string, assessmentId: string): Promise<AssessmentAttempt[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async findLatestByUserIdAndAssessmentId(userId: string, assessmentId: string): Promise<AssessmentAttempt | null> {
    // TODO
    throw new Error('Not implemented');
  }

  async save(attempt: AssessmentAttempt): Promise<AssessmentAttempt> {
    // TODO
    throw new Error('Not implemented');
  }

  async submitAttempt(id: string, score: number, submittedAt: Date): Promise<AssessmentAttempt> {
    // TODO
    throw new Error('Not implemented');
  }

  async saveQuestionAttempts(questionAttempts: QuestionAttempt[]): Promise<QuestionAttempt[]> {
    // TODO
    throw new Error('Not implemented');
  }

  async findQuestionAttemptsByAttemptId(assessmentAttemptId: string): Promise<QuestionAttempt[]> {
    // TODO
    throw new Error('Not implemented');
  }
}
