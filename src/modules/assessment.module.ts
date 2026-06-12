import { Module } from '@nestjs/common';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { AssessmentPrismaRepository } from '@infrastructure/persistence/repositories/assessment.prisma-repository';
import { LearnerConceptMasteryPrismaRepository } from '@infrastructure/persistence/repositories/learner-concept-mastery.prisma-repository';
import { CreateAssessmentUseCase } from '@application/assessment/use-cases/create-assessment.use-case';
import { SubmitAssessmentUseCase } from '@application/assessment/use-cases/submit-assessment.use-case';
import { AssessmentController } from '@presentation/assessment/assessment.controller';

@Module({
  controllers: [AssessmentController],
  providers: [
    CreateAssessmentUseCase,
    SubmitAssessmentUseCase,
    { provide: INJECTION_TOKENS.ASSESSMENT_REPOSITORY, useClass: AssessmentPrismaRepository },
    { provide: INJECTION_TOKENS.LEARNER_CONCEPT_MASTERY_REPOSITORY, useClass: LearnerConceptMasteryPrismaRepository },
  ],
})
export class AssessmentModule {}
