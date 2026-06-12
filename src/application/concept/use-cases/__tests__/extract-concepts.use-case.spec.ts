import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ExtractConceptsUseCase } from '../extract-concepts.use-case';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { IConceptRepository } from '@domain/concept/repositories/concept.repository.interface';
import { IAiProvider } from '@infrastructure/ai/ai-provider.interface';
import { Source } from '@domain/source/entities/source.entity';
import { Concept } from '@domain/concept/entities/concept.entity';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

const makeSource = (ownerId = 'user-1', status = SourceStatus.COMPLETED) =>
  new Source('src-1', ownerId, 'Clean Code', SourceType.PDF, null, status, null, new Date());

const makeConcept = (id: string) =>
  new Concept(id, 'src-1', `Concept ${id}`, 'A description', 0.8, new Date());

const aiConcepts = [
  { name: 'Clean Code', definition: 'Readable code', examples: ['Good naming'], pageNumber: 1 },
  { name: 'Refactoring', definition: 'Improving code structure', examples: ['Extract method'], pageNumber: 5 },
];

describe('ExtractConceptsUseCase', () => {
  let useCase: ExtractConceptsUseCase;
  let sourceRepository: jest.Mocked<ISourceRepository>;
  let conceptRepository: jest.Mocked<IConceptRepository>;
  let aiProvider: jest.Mocked<IAiProvider>;

  beforeEach(() => {
    sourceRepository = {
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      findByOwnerIdAndStatus: jest.fn(),
      save: jest.fn(),
      updateStatus: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
      countByOwnerId: jest.fn(),
    };
    conceptRepository = {
      findById: jest.fn(),
      findBySourceId: jest.fn(),
      findBySourceIdOrderedByImportance: jest.fn(),
      save: jest.fn(),
      saveMany: jest.fn(),
      deleteBySourceId: jest.fn(),
      countBySourceId: jest.fn(),
      existsById: jest.fn(),
    };
    aiProvider = {
      generateSummary: jest.fn(),
      generateQuiz: jest.fn(),
      extractConcepts: jest.fn(),
      extractTextFromPdf: jest.fn(),
    };
    useCase = new ExtractConceptsUseCase(
      sourceRepository as any,
      conceptRepository as any,
      aiProvider as any,
    );
  });

  it('extracts concepts from AI and atomically replaces existing ones', async () => {
    sourceRepository.findById.mockResolvedValue(makeSource('user-1'));
    aiProvider.extractConcepts.mockResolvedValue(aiConcepts);
    conceptRepository.deleteBySourceId.mockResolvedValue(undefined);
    conceptRepository.saveMany.mockImplementation(async (cs) => cs);

    const result = await useCase.execute('src-1', 'user-1');

    expect(aiProvider.extractConcepts).toHaveBeenCalledTimes(1);
    expect(conceptRepository.deleteBySourceId).toHaveBeenCalledWith('src-1');
    expect(conceptRepository.saveMany).toHaveBeenCalledTimes(1);
    expect(result.items).toHaveLength(2);
  });

  it('throws NotFoundException when source does not exist', async () => {
    sourceRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing', 'user-1')).rejects.toThrow(NotFoundException);
    expect(aiProvider.extractConcepts).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when source belongs to a different user', async () => {
    sourceRepository.findById.mockResolvedValue(makeSource('user-owner'));

    await expect(useCase.execute('src-1', 'user-intruder')).rejects.toThrow(ForbiddenException);
  });

  it('throws BadRequestException when source is not completed', async () => {
    sourceRepository.findById.mockResolvedValue(makeSource('user-1', SourceStatus.PROCESSING));

    await expect(useCase.execute('src-1', 'user-1')).rejects.toThrow(BadRequestException);
    expect(aiProvider.extractConcepts).not.toHaveBeenCalled();
  });
});
