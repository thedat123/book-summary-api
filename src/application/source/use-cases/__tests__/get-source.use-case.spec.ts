import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetSourceUseCase } from '../get-source.use-case';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { Source } from '@domain/source/entities/source.entity';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

// ── Shared factory ────────────────────────────────────────────────────────────
// Default owner is 'user-1'. Pass a different ownerId to test forbidden cases.
const makeSource = (ownerId = 'user-1') =>
  new Source(
    'src-1',
    ownerId,
    'Clean Code',
    SourceType.PDF,
    'https://example.com/book.pdf',
    SourceStatus.COMPLETED,
    null,
    new Date(),
  );

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

  it('returns a DTO when source exists and belongs to the requesting user', async () => {
    sourceRepository.findById.mockResolvedValue(makeSource('user-1'));

    const result = await useCase.execute('src-1', 'user-1');

    expect(result.id).toBe('src-1');
    expect(result.ownerId).toBe('user-1');
    expect(result.title).toBe('Clean Code');
    // Exactly one repository lookup should have been made
    expect(sourceRepository.findById).toHaveBeenCalledWith('src-1');
    expect(sourceRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('throws NotFoundException when source does not exist', async () => {
    // Returning null simulates a missing row in the DB.
    // We prefer 404 over 403 here so callers cannot infer resource existence
    // from the error type.
    sourceRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id', 'user-1')).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when source belongs to a different user', async () => {
    // Source exists but is owned by 'user-owner', not 'user-intruder'.
    sourceRepository.findById.mockResolvedValue(makeSource('user-owner'));

    await expect(useCase.execute('src-1', 'user-intruder')).rejects.toThrow(ForbiddenException);
  });

  it('DTO does not expose internal entity methods', async () => {
    sourceRepository.findById.mockResolvedValue(makeSource('user-1'));

    const result = await useCase.execute('src-1', 'user-1');

    // Plain data objects only — no domain behaviour should bleed into the response.
    expect((result as any).isCompleted).toBeUndefined();
    expect((result as any).belongsToUser).toBeUndefined();
    expect((result as any).canStartJob).toBeUndefined();
  });
});
