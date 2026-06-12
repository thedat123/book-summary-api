import { Injectable, Inject } from '@nestjs/common';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { SourceResponseDto } from '../dtos/source-response.dto';

/**
 * GetSourceUseCase
 *
 * Responsibility: Retrieve a single source by ID, enforcing ownership.
 * Dependencies:
 *   - ISourceRepository (token: INJECTION_TOKENS.SOURCE_REPOSITORY)
 *
 * Flow:
 *   1. sourceRepository.findById(sourceId) → throw NotFoundException if null
 *   2. source.belongsToUser(requestingUserId) → throw ForbiddenException if false
 *   3. return this.toDto(source)
 *
 * Test cases to write (see __tests__/get-source.use-case.spec.ts):
 *   - returns a DTO when source exists and belongs to the requesting user
 *   - throws NotFoundException when source does not exist
 *   - throws ForbiddenException when source belongs to a different user
 *   - DTO does not expose internal entity methods (isCompleted, belongsToUser)
 */
@Injectable()
export class GetSourceUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.SOURCE_REPOSITORY)
    private readonly sourceRepository: ISourceRepository,
  ) {}

  async execute(sourceId: string, requestingUserId: string): Promise<SourceResponseDto> {
    // TODO: find source by id, throw NotFoundException if null
    // TODO: check source.belongsToUser(requestingUserId), throw ForbiddenException if false
    // TODO: return this.toDto(source)
    throw new Error('Not implemented');
  }

  private toDto(source: any): SourceResponseDto {
    // TODO: return { id, ownerId, title, sourceType, sourceUrl, status, aiSnapshot, createdAt }
    throw new Error('Not implemented');
  }
}
