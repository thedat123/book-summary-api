import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { IConceptRepository } from '@domain/concept/repositories/concept.repository.interface';
import { IAiProvider } from '@infrastructure/ai/ai-provider.interface';
import { Concept } from '@domain/concept/entities/concept.entity';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { ConceptListResponseDto, ConceptResponseDto } from '../dtos/concept-response.dto';

/**
 * ExtractConceptsUseCase
 *
 * Calls the AI provider to extract key concepts from a completed source, then
 * atomically replaces any previously extracted concepts for that source.
 *
 * "Atomic" here means delete-then-insert at the application layer (two calls).
 * Full DB-level atomicity requires wrapping these in a transaction at the
 * infrastructure layer — the repository should ideally offer a
 * replaceBySourceId(sourceId, concepts) transactional method if consistency
 * under concurrent re-extraction is required.
 *
 * Pre-conditions:
 *   - Source must exist and belong to userId
 *   - Source must be COMPLETED (AI snapshot available) — PROCESSING or FAILED
 *     sources do not have extractable content yet
 */
@Injectable()
export class ExtractConceptsUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.SOURCE_REPOSITORY)
    private readonly sourceRepository: ISourceRepository,

    @Inject(INJECTION_TOKENS.CONCEPT_REPOSITORY)
    private readonly conceptRepository: IConceptRepository,

    @Inject(INJECTION_TOKENS.AI_PROVIDER)
    private readonly aiProvider: IAiProvider,
  ) {}

  async execute(sourceId: string, userId: string): Promise<ConceptListResponseDto> {
    // ── 1. Load and validate source ───────────────────────────────────────────
    const source = await this.sourceRepository.findById(sourceId);
    if (!source) {
      throw new NotFoundException(`Source ${sourceId} not found`);
    }

    if (!source.belongsToUser(userId)) {
      throw new ForbiddenException(`User does not own source ${sourceId}`);
    }

    if (!source.isCompleted()) {
      // Source is still PROCESSING or FAILED — no content to extract from yet
      throw new BadRequestException(
        `Source ${sourceId} is not ready for concept extraction (status: ${source.status})`,
      );
    }

    // ── 2. Extract concepts via AI ────────────────────────────────────────────
    // aiProvider.extractConcepts expects a text string. We use the AI-generated
    // summary from the snapshot as the extraction input — it's the most
    // structured and noise-free representation of the source content.
    // If aiSnapshot is null despite COMPLETED status, fall back to the title.
    const extractionText = source.aiSnapshot?.summary ?? source.title;
    const aiConcepts = await this.aiProvider.extractConcepts(extractionText);

    // ── 3. Atomically replace existing concepts ───────────────────────────────
    // Delete first, then insert. If saveMany fails, concepts for this source
    // will be empty until the next extraction — acceptable tradeoff vs. having
    // stale data. Use a transactional repository method if stricter consistency
    // is needed.
    await this.conceptRepository.deleteBySourceId(sourceId);

    const newConcepts: Concept[] = aiConcepts.map((c) =>
      new Concept(
        randomUUID(),
        sourceId,
        c.name,
        c.definition, // ConceptResult.definition maps to Concept.description
        null,         // importanceScore: not provided by AI in this flow; could
                      // be derived from pageNumber proximity or model confidence
        new Date(),
      ),
    );

    const saved = await this.conceptRepository.saveMany(newConcepts);

    // ── 4. Map to response DTO ────────────────────────────────────────────────
    return {
      items: saved.map((concept, index) => this.toDto(concept, aiConcepts[index])),
      total: saved.length,
    };
  }

  /**
   * Maps a persisted Concept entity back to the DTO, re-attaching the
   * ephemeral fields (examples, pageNumber) from the original AI result
   * since they are not stored on the entity.
   */
  private toDto(concept: Concept, aiSource?: { examples: string[]; pageNumber: number | null }): ConceptResponseDto {
    return {
      id: concept.id,
      bookId: concept.sourceId,
      name: concept.name,
      definition: concept.description,
      examples: aiSource?.examples ?? [],
      pageNumber: aiSource?.pageNumber ?? null,
      createdAt: concept.createdAt!,
    };
  }
}
