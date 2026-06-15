import { Injectable, Inject } from '@nestjs/common';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { ListSourcesDto } from '../dtos/create-source.dto';
import { PaginatedSourcesResponseDto, SourceResponseDto } from '../dtos/source-response.dto';
import { Source } from '@domain/source/entities/source.entity';

/**
 * ListSourcesUseCase
 *
 * Responsibility: Return a paginated list of sources owned by the requesting user.
 * Dependencies:
 *   - ISourceRepository (token: INJECTION_TOKENS.SOURCE_REPOSITORY)
 *
 * Flow:
 *   1. Resolve defaults: limit = dto.limit ?? 20, offset = dto.offset ?? 0
 *   2. Run in parallel: findByOwnerId(ownerId, { limit, offset }) and countByOwnerId(ownerId)
 *   3. Return { items: sources.map(toDto), total, limit, offset }
 *
 * Test cases to write (see __tests__/list-sources.use-case.spec.ts):
 *   - returns paginated sources with correct total count
 *   - uses default limit=20 and offset=0 when not provided
 *   - returns empty items array when no sources exist
 *   - maps source entities to DTOs without internal methods
 */
@Injectable()
export class ListSourcesUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.SOURCE_REPOSITORY)
    private readonly sourceRepository: ISourceRepository,
  ) {}

  async execute(ownerId: string, dto: ListSourcesDto): Promise<PaginatedSourcesResponseDto> {
    const limit = dto.limit ?? 20;
    const offset = dto.offset ?? 0;
    const [sources, total] = await Promise.all([
      this.sourceRepository.findByOwnerId(ownerId, { limit, offset }),
      this.sourceRepository.countByOwnerId(ownerId),
    ]);
    return {
      items: sources.map(s => this.toDto(s)),
      total,
      limit,
      offset,
    };
  }

  private toDto(source: Source): SourceResponseDto {
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
