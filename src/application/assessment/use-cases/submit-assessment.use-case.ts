import { Injectable, Inject } from '@nestjs/common';
import { IAssessmentRepository } from '@domain/assessment/repositories/assessment.repository.interface';
import { ILearnerConceptMasteryRepository } from '@domain/mastery/repositories/learner-concept-mastery.repository.interface';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { SubmitAssessmentDto } from '../dtos/submit-assessment.dto';
import { AssessmentResponseDto } from '../dtos/assessment-response.dto';

@Injectable()
export class SubmitAssessmentUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.ASSESSMENT_REPOSITORY)
    private readonly assessmentRepository: IAssessmentRepository,

    @Inject(INJECTION_TOKENS.LEARNER_CONCEPT_MASTERY_REPOSITORY)
    private readonly masteryRepository: ILearnerConceptMasteryRepository,
  ) {}

  async execute(dto: SubmitAssessmentDto, userId: string): Promise<AssessmentResponseDto> {
    // TODO: load assessment → verify ownership and in-progress status
    // TODO: score the assessment answers via question.isOptionCorrect
    // TODO: save assessment attempt with final score
    // TODO: upsert mastery scores per concept via masteryRepository.upsertMany
    // TODO: map AssessmentAttempt → AssessmentResponseDto
    throw new Error('Not implemented');
  }
}
