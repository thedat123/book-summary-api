import { CreateSourceUseCase } from '../create-source.use-case';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

describe('CreateSourceUseCase', () => {
  let useCase: CreateSourceUseCase;
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
    useCase = new CreateSourceUseCase(sourceRepository as any);
  });

  // TODO: saves a new Source and returns a DTO with PROCESSING status
  // TODO: assigns the requesting userId as ownerId
  // TODO: passes dto.title and dto.sourceType to the saved entity
  // TODO: returns null sourceUrl when sourceUrl is not provided in dto
  // TODO: DTO does not expose internal entity methods (isCompleted, belongsToUser)
});
