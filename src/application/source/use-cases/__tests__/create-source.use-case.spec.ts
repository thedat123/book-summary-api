import { CreateSourceUseCase } from '../create-source.use-case';
import { ISourceRepository } from '@domain/source/repositories/source.repository.interface';
import { Source } from '@domain/source/entities/source.entity';
import { SourceType } from '@domain/source/value-objects/source-type.vo';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';

// ── Shared factory ────────────────────────────────────────────────────────────
// Builds the entity the repository would return after a successful save.
// Using a factory keeps tests independent — each can call makeSaved() with
// different overrides without sharing mutable state.
const makeSaved = (overrides: Partial<ConstructorParameters<typeof Source>[number]> = {}) =>
  new Source(
    'src-1',
    'user-1',
    'Clean Code',
    SourceType.PDF,
    null,
    SourceStatus.PROCESSING,
    null,
    new Date(),
  );

describe('CreateSourceUseCase', () => {
  let useCase: CreateSourceUseCase;
  let sourceRepository: jest.Mocked<ISourceRepository>;

  beforeEach(() => {
    // Full mock of every repository method so TypeScript is satisfied.
    // Individual tests only set up the methods they exercise.
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

  it('saves a new Source and returns a DTO with PROCESSING status', async () => {
    // A freshly created source always starts as PROCESSING — the AI pipeline
    // moves it to COMPLETED or FAILED asynchronously.
    sourceRepository.save.mockResolvedValue(makeSaved());

    const result = await useCase.execute(
      { title: 'Clean Code', sourceType: SourceType.PDF },
      'user-1',
    );

    expect(result.status).toBe(SourceStatus.PROCESSING);
    expect(sourceRepository.save).toHaveBeenCalledTimes(1);
  });

  it('assigns the requesting userId as ownerId on the persisted entity', async () => {
    sourceRepository.save.mockResolvedValue(makeSaved());

    await useCase.execute({ title: 'Clean Code', sourceType: SourceType.PDF }, 'user-42');

    // Verify the entity passed TO save() carries the correct ownerId,
    // not just the DTO that comes back (which is shaped by the saved entity).
    expect(sourceRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: 'user-42' }),
    );
  });

  it('passes dto.title and dto.sourceType to the entity sent to save()', async () => {
    sourceRepository.save.mockResolvedValue(makeSaved());

    await useCase.execute({ title: 'Clean Code', sourceType: SourceType.PDF }, 'user-1');

    expect(sourceRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Clean Code', sourceType: SourceType.PDF }),
    );
  });

  it('sets sourceUrl to null when not provided in dto', async () => {
    // dto.sourceUrl is optional — must default to null, never undefined,
    // so the persistence layer always receives a clean value.
    sourceRepository.save.mockResolvedValue(makeSaved());

    await useCase.execute({ title: 'Clean Code', sourceType: SourceType.PDF }, 'user-1');

    expect(sourceRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ sourceUrl: null }),
    );
  });

  it('DTO does not expose internal entity methods', async () => {
    sourceRepository.save.mockResolvedValue(makeSaved());

    const result = await useCase.execute(
      { title: 'Clean Code', sourceType: SourceType.PDF },
      'user-1',
    );

    // The response DTO is a plain data object — no domain methods should
    // leak through, otherwise callers get unexpected callable properties.
    expect((result as any).isCompleted).toBeUndefined();
    expect((result as any).belongsToUser).toBeUndefined();
    expect((result as any).isProcessing).toBeUndefined();
  });
});
