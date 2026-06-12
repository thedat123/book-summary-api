import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { IConceptRepository } from '@domain/concept/repositories/concept.repository.interface';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { ConceptListResponseDto } from '../dtos/concept-response.dto';

@Injectable()
export class GetConceptsUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.SOURCE_REPOSITORY)
    private readonly sourceRepository: ISourceRepository,

    @Inject(INJECTION_TOKENS.CONCEPT_REPOSITORY)
    private readonly conceptRepository: IConceptRepository,
  ) {}

  async execute(sourceId: string, userId: string): Promise<ConceptListResponseDto> {
    // TODO: source = sourceRepository.findById → throw NotFoundException if null
    // TODO: source.belongsToUser(userId) → throw ForbiddenException
    // TODO: concepts = conceptRepository.findBySourceIdOrderedByImportance(sourceId)
    // TODO: map Concept[] → ConceptListResponseDto
    throw new Error('Not implemented');
  }
}
