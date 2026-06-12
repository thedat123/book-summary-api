import { ListSourcesUseCase } from '../list-sources.use-case';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { Source } from '@domain/source/entities/source.entity';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

const makeSource = (id: string) =>
  new Source(id, 'user-1', `Source ${id}`, SourceType.PDF, null, SourceStatus.COMPLETED, null, new Date());

describe('ListSourcesUseCase', () => {
  let useCase: ListSourcesUseCase;
  let sourceRepository: jest.Mocked<ISourceRepository>;

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
    useCase = new ListSourcesUseCase(sourceRepository as any);
  });

  // TODO: returns paginated sources with correct total count
  // TODO: uses default limit=20 and offset=0 when not provided in dto
  // TODO: returns empty items array when no sources exist
  // TODO: maps source entities to DTOs without exposing internal methods
});
