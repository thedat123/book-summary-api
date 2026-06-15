import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { IConceptRepository } from '@domain/concept/repositories/concept.repository.interface';
import { Concept } from '@domain/concept/entities/concept.entity';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { ConceptListResponseDto, ConceptResponseDto } from '../dtos/concept-response.dto';

/**
 * GetConceptsUseCase
 *
 * Retrieves all concepts for a source, ordered by importance score descending.
 * Enforces ownership — only the source owner can read its concepts.
 *
 * Returns an empty list when no concepts have been extracted yet (not an error).
 */
@Injectable()
export class GetConceptsUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.SOURCE_REPOSITORY)
    private readonly sourceRepository: ISourceRepository,

    @Inject(INJECTION_TOKENS.CONCEPT_REPOSITORY)
    private readonly conceptRepository: IConceptRepository,
  ) {}

  async execute(sourceId: string, userId: string): Promise<ConceptListResponseDto> {
    // ── 1. Verify source exists ───────────────────────────────────────────────
    const source = await this.sourceRepository.findById(sourceId);
    if (!source) {
      // Return 404 rather than 403 to avoid leaking existence of resources
      throw new NotFoundException(`Source ${sourceId} not found`);
    }

    // ── 2. Enforce ownership ──────────────────────────────────────────────────
    if (!source.belongsToUser(userId)) {
      throw new ForbiddenException(`User does not own source ${sourceId}`);
    }

    // ── 3. Load concepts ordered by importance ────────────────────────────────
    // Returns [] when no extraction has run yet — callers should treat this
    // as a prompt to trigger ExtractConceptsUseCase rather than an error.
    const concepts = await this.conceptRepository.findBySourceIdOrderedByImportance(sourceId);

    // ── 4. Map to response DTO ────────────────────────────────────────────────
    return {
      items: concepts.map(this.toDto),
      total: concepts.length,
    };
  }

  /**
   * Maps a Concept entity to the public-facing DTO.
   *
   * Note: ConceptResponseDto.examples and .pageNumber have no corresponding
   * fields on the Concept entity (those fields exist only on ConceptResult
   * from the AI provider and are not persisted). They default to [] / null here.
   * If persistence of examples is needed, add them to the Concept entity and
   * Prisma schema.
   */
  private toDto(concept: Concept): ConceptResponseDto {
    return {
      id: concept.id,
      bookId: concept.sourceId, // bookId is the public alias for sourceId
      name: concept.name,
      definition: concept.description,
      examples: [],
      pageNumber: null,
      createdAt: concept.createdAt!,
    };
  }
}
