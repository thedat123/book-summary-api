import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetConceptsUseCase } from '../get-concepts.use-case';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { IConceptRepository } from '@domain/concept/repositories/concept.repository.interface';
import { Source } from '@domain/source/entities/source.entity';
import { Concept } from '@domain/concept/entities/concept.entity';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

const makeSource = (ownerId = 'user-1', status = SourceStatus.COMPLETED) =>
  new Source('src-1', ownerId, 'Clean Code', SourceType.PDF, null, status, null, new Date());

const makeConcept = (id: string) =>
  new Concept(id, 'src-1', `Concept ${id}`, 'A description', 0.8, new Date());

describe('GetConceptsUseCase', () => {
  let useCase: GetConceptsUseCase;
  let sourceRepository: jest.Mocked<ISourceRepository>;
  let conceptRepository: jest.Mocked<IConceptRepository>;

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
    useCase = new GetConceptsUseCase(sourceRepository as any, conceptRepository as any);
  });

  it('returns concepts ordered by importance for a valid source', async () => {
    sourceRepository.findById.mockResolvedValue(makeSource('user-1'));
    const concepts = [makeConcept('c-1'), makeConcept('c-2')];
    conceptRepository.findBySourceIdOrderedByImportance.mockResolvedValue(concepts);

    const result = await useCase.execute('src-1', 'user-1');

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it('throws NotFoundException when source does not exist', async () => {
    sourceRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing', 'user-1')).rejects.toThrow(NotFoundException);
    expect(conceptRepository.findBySourceIdOrderedByImportance).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when source belongs to a different user', async () => {
    sourceRepository.findById.mockResolvedValue(makeSource('user-owner'));

    await expect(useCase.execute('src-1', 'user-intruder')).rejects.toThrow(ForbiddenException);
  });

  it('returns empty items when no concepts have been extracted yet', async () => {
    sourceRepository.findById.mockResolvedValue(makeSource('user-1'));
    conceptRepository.findBySourceIdOrderedByImportance.mockResolvedValue([]);

    const result = await useCase.execute('src-1', 'user-1');

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
