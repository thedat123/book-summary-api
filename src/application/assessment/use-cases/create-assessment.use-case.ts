import { Injectable, Inject } from '@nestjs/common';
import { IAssessmentRepository } from '@domain/assessment/repositories/assessment.repository.interface';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { CreateAssessmentDto } from '../dtos/create-assessment.dto';
import { AssessmentResponseDto } from '../dtos/assessment-response.dto';

@Injectable()
export class CreateAssessmentUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.ASSESSMENT_REPOSITORY)
    private readonly assessmentRepository: IAssessmentRepository,
  ) {}

  async execute(dto: CreateAssessmentDto, userId: string): Promise<AssessmentResponseDto> {
    // TODO: create Assessment entity with status=PENDING
    // TODO: persist via assessmentRepository.save
    // TODO: map Assessment → AssessmentResponseDto
    throw new Error('Not implemented');
  }
}
