import { CreateAssessmentUseCase } from '../create-assessment.use-case';
import { IAssessmentRepository } from '@domain/assessment/repositories/assessment.repository.interface';
import { Assessment } from '@domain/assessment/entities/assessment.entity';

describe('CreateAssessmentUseCase', () => {
  let useCase: CreateAssessmentUseCase;
  let assessmentRepository: jest.Mocked<IAssessmentRepository>;

  beforeEach(() => {
    assessmentRepository = {
      findById: jest.fn(),
      findBySourceId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    useCase = new CreateAssessmentUseCase(assessmentRepository as any);
  });

  it('creates an Assessment and returns a DTO with the given title', async () => {
    const savedAssessment = new Assessment('assess-1', 'source-1', 'Chapter 1 Assessment', new Date());
    assessmentRepository.save.mockResolvedValue(savedAssessment);

    const result = await useCase.execute(
      { sourceId: 'source-1', title: 'Chapter 1 Assessment' },
      'user-1',
    );

    expect(result.id).toBe('assess-1');
    expect(result.title).toBe('Chapter 1 Assessment');
    expect(assessmentRepository.save).toHaveBeenCalledTimes(1);
  });

  it('creates an Assessment with a null title when none provided', async () => {
    const savedAssessment = new Assessment('assess-2', 'source-1', null, new Date());
    assessmentRepository.save.mockResolvedValue(savedAssessment);

    const result = await useCase.execute({ sourceId: 'source-1' }, 'user-1');

    // DTO should still have a displayTitle (from entity.displayTitle())
    expect(result.id).toBeDefined();
  });

  it('never exposes internal entity methods on the DTO', async () => {
    const savedAssessment = new Assessment('assess-1', 'source-1', 'Test', new Date());
    assessmentRepository.save.mockResolvedValue(savedAssessment);

    const result = await useCase.execute({ sourceId: 'source-1', title: 'Test' }, 'user-1');

    expect((result as any).hasTitle).toBeUndefined();
    expect((result as any).displayTitle).toBeUndefined();
  });
});
