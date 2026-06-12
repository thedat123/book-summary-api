import { Injectable, Inject } from '@nestjs/common';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { CreateSourceDto } from '../dtos/create-source.dto';
import { SourceResponseDto } from '../dtos/source-response.dto';
import { randomUUID } from 'crypto';
import { Source } from '@domain/source/entities/source.entity';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';

/**
 * CreateSourceUseCase
 *
 * Responsibility: Build a new Source entity and persist it with PROCESSING status.
 * Dependencies:
 *   - ISourceRepository (token: INJECTION_TOKENS.SOURCE_REPOSITORY)
 *
 * Flow:
 *   1. Build Source entity with randomUUID id, given ownerId, dto fields,
 *      SourceStatus.PROCESSING, null aiSnapshot, createdAt = new Date()
 *   2. sourceRepository.save(source)
 *   3. Map saved entity → SourceResponseDto via toDto()
 *
 * Edge cases:
 *   - dto.sourceUrl is optional → default to null
 *   - aiSnapshot always starts as null (set later by AI pipeline)
 *
 * Test cases to write (see __tests__/create-source.use-case.spec.ts):
 *   - saves a new Source and returns a DTO with PROCESSING status
 *   - assigns the requesting userId as ownerId
 *   - passes dto.title and dto.sourceType to the saved entity
 *   - returns null sourceUrl when not provided in dto
 *   - DTO does not expose internal entity methods (isCompleted, belongsToUser)
 */
@Injectable()
export class CreateSourceUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.SOURCE_REPOSITORY)
    private readonly sourceRepository: ISourceRepository,
  ) {}

  async execute(dto: CreateSourceDto, ownerId: string): Promise<SourceResponseDto> {
    const source = new Source(
      randomUUID(),
      ownerId,
      dto.title,
      dto.sourceType,
      dto.sourceUrl ?? null,
      SourceStatus.PROCESSING,
      null,
      new Date(),
    )
    const saved = await this.sourceRepository.save(source);
    return this.toDto(saved);
  }

  private toDto(source: any): SourceResponseDto {
    return {
      id: source.id,
      ownerId: source.ownerId,
      title: source.title,
      sourceType: source.sourceType,
      sourceUrl: source.sourceUrl,
      status: source.status,
      aiSnapshot: source.aiSnapshot,
      createdAt: source.createdAt,
    };
  }
}
