import { DeleteSourceUseCase } from '../delete-source.use-case';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { Source } from '@domain/source/entities/source.entity';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

const makeSource = (ownerId = 'user-1') =>
  new Source('src-1', ownerId, 'Title', SourceType.PDF, null, SourceStatus.COMPLETED, null, new Date());

describe('DeleteSourceUseCase', () => {
  let useCase: DeleteSourceUseCase;
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
    useCase = new DeleteSourceUseCase(sourceRepository as any);
  });

  // TODO: deletes the source when it exists and belongs to the requesting user
  // TODO: throws NotFoundException when source does not exist (delete must NOT be called)
  // TODO: throws ForbiddenException when source belongs to a different user (delete must NOT be called)
});
