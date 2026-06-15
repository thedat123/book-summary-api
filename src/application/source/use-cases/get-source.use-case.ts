import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    const source = await this.sourceRepository.findById(sourceId);
    if (!source) {
      // 404 instead of 403 to avoid leaking whether a source exists at all
      throw new NotFoundException(`Source ${sourceId} not found`);
    }
    if (!source.belongsToUser(requestingUserId)) {
      // Use ForbiddenException rather than UnauthorizedException —
      // the user IS authenticated, they just don't own this resource
      throw new ForbiddenException(`User does not own source ${sourceId}`);
    }

    return this.toDto(source);
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
