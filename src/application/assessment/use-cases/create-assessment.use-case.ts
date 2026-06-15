import { Injectable, Inject } from "@nestjs/common";
import { IAssessmentRepository } from "@domain/assessment/repositories/assessment.repository.interface";
import { INJECTION_TOKENS } from "@infrastructure/di/injection-tokens";
import { CreateAssessmentDto } from "../dtos/create-assessment.dto";
import { AssessmentResponseDto } from "../dtos/assessment-response.dto";
import { Assessment } from "@domain/assessment/entities/assessment.entity";
import { AssessmentStatus } from "@domain/assessment/value-objects/assessment-status.vo";

@Injectable()
export class CreateAssessmentUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.ASSESSMENT_REPOSITORY)
    private readonly assessmentRepository: IAssessmentRepository,
  ) {}

  async execute(dto: CreateAssessmentDto, userId: string): Promise<AssessmentResponseDto> {
    const saved = await this.assessmentRepository.save(
      new Assessment(crypto.randomUUID(), dto.sourceId, dto.title ?? null, new Date(), AssessmentStatus.PENDING),
    );

    return Object.assign(new AssessmentResponseDto(), {
      id: saved.id,
      userId,
      sourceId: saved.sourceId,
      title: saved.displayTitle(),
      createdAt: saved.createdAt,
      status: saved.status,
    });
  }
}

