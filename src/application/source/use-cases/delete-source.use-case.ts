import { Injectable, Inject } from '@nestjs/common';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';

/**
 * DeleteSourceUseCase
 *
 * Responsibility: Delete a source after verifying ownership.
 * Dependencies:
 *   - ISourceRepository (token: INJECTION_TOKENS.SOURCE_REPOSITORY)
 *
 * Flow:
 *   1. sourceRepository.findById(sourceId) → throw NotFoundException if null
 *   2. source.belongsToUser(requestingUserId) → throw ForbiddenException if false
 *   3. sourceRepository.delete(sourceId)
 *
 * Test cases to write (see __tests__/delete-source.use-case.spec.ts):
 *   - deletes successfully when source exists and belongs to requesting user
 *   - throws NotFoundException when source does not exist (delete must NOT be called)
 *   - throws ForbiddenException when source belongs to a different user (delete must NOT be called)
 */
@Injectable()
export class DeleteSourceUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.SOURCE_REPOSITORY)
    private readonly sourceRepository: ISourceRepository,
  ) {}

  async execute(sourceId: string, requestingUserId: string): Promise<void> {
    const source = await this.sourceRepository.findById(sourceId);
    if (!source) {
      throw new Error(`Source ${sourceId} not found`);
    }
    if (!source.belongsToUser(requestingUserId)) {
      throw new Error(`Forbidden: User ${requestingUserId} does not own source ${sourceId}`);
    }
    await this.sourceRepository.delete(sourceId);
  }
}
