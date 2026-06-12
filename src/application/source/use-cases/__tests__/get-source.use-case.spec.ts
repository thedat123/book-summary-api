import { GetSourceUseCase } from '../get-source.use-case';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { Source } from '@domain/source/entities/source.entity';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

const makeSource = (ownerId = 'user-1') =>
  new Source('src-1', ownerId, 'Clean Code', SourceType.PDF, 'https://example.com/book.pdf', SourceStatus.COMPLETED, null, new Date());

describe('GetSourceUseCase', () => {
  let useCase: GetSourceUseCase;
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
    useCase = new GetSourceUseCase(sourceRepository as any);
  });

  // TODO: returns a DTO when source exists and belongs to the requesting user
  // TODO: throws NotFoundException when source does not exist
  // TODO: throws ForbiddenException when source belongs to a different user
  // TODO: DTO does not expose internal entity methods (isCompleted, belongsToUser)
});
