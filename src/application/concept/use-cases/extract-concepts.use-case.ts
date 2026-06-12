import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { IConceptRepository } from '@domain/concept/repositories/concept.repository.interface';
import { IAiProvider } from '@infrastructure/ai/ai-provider.interface';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { ConceptListResponseDto } from '../dtos/concept-response.dto';

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
    // TODO: source = sourceRepository.findById → throw NotFoundException if null
    // TODO: source.belongsToUser(userId) → throw ForbiddenException
    // TODO: source.isCompleted() → throw BadRequestException if not ready
    // TODO: call aiProvider.extractConcepts(source)
    // TODO: conceptRepository.deleteBySourceId + saveMany (atomic re-extraction)
    // TODO: map Concept[] → ConceptListResponseDto
    throw new Error('Not implemented');
  }
}
