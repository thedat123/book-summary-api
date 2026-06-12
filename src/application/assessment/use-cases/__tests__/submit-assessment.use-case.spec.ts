import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SubmitAssessmentUseCase } from '../submit-assessment.use-case';
import { IAssessmentRepository } from '@domain/assessment/repositories/assessment.repository.interface';
import { ILearnerConceptMasteryRepository } from '@domain/mastery/repositories/learner-concept-mastery.repository.interface';

/**
 * SubmitAssessmentUseCase scores each answer, persists the attempt,
 * and updates LearnerConceptMastery for concept-tagged questions.
 */
describe('SubmitAssessmentUseCase', () => {
  let useCase: SubmitAssessmentUseCase;
  let assessmentRepository: jest.Mocked<IAssessmentRepository>;
  let masteryRepository: jest.Mocked<ILearnerConceptMasteryRepository>;

  beforeEach(() => {
    assessmentRepository = {
      findById: jest.fn(),
      findBySourceId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    masteryRepository = {
      findByUserIdAndConceptId: jest.fn(),
      findByUserId: jest.fn(),
      findByConceptId: jest.fn(),
      findByUserIdAndSourceId: jest.fn(),
      upsert: jest.fn(),
      upsertMany: jest.fn(),
    };
    useCase = new SubmitAssessmentUseCase(assessmentRepository as any, masteryRepository as any);
  });

  it('throws NotFoundException when assessment does not exist', async () => {
    assessmentRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(
        { assessmentId: 'missing', answers: [] },
        'user-1',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('scores answers and returns the attempt with a computed score', async () => {
    // Mock assessment with 2 questions: q1 correct=0, q2 correct=2
    const mockAssessment = {
      id: 'assess-1',
      sourceId: 'source-1',
      questions: [
        { id: 'q-1', options: [{ id: 'opt-a', isCorrect: true }, { id: 'opt-b', isCorrect: false }], conceptId: null },
        { id: 'q-2', options: [{ id: 'opt-c', isCorrect: false }, { id: 'opt-d', isCorrect: true }], conceptId: 'concept-1' },
      ],
    };
    assessmentRepository.findById.mockResolvedValue(mockAssessment as any);
    masteryRepository.upsertMany.mockResolvedValue(undefined as any);

    const result = await useCase.execute(
      {
        assessmentId: 'assess-1',
        answers: [0, 1], // q-1: opt-a (index 0), q-2: opt-d (index 1)
      },
      'user-1',
    );

    expect(result.score).toBe(100);
    expect(result.id).toBeDefined();
  });

  it('updates mastery for concept-tagged questions after submission', async () => {
    const mockAssessment = {
      id: 'assess-1',
      sourceId: 'source-1',
      questions: [
        { id: 'q-1', options: [{ id: 'opt-a', isCorrect: true }], conceptId: 'concept-x' },
      ],
    };
    assessmentRepository.findById.mockResolvedValue(mockAssessment as any);
    masteryRepository.upsertMany.mockResolvedValue(undefined as any);

    await useCase.execute(
      { assessmentId: 'assess-1', answers: [0] },
      'user-1',
    );

    expect(masteryRepository.upsertMany).toHaveBeenCalledTimes(1);
    const upsertArg = masteryRepository.upsertMany.mock.calls[0][0];
    expect(upsertArg.some((m: any) => m.conceptId === 'concept-x')).toBe(true);
  });

  it('does not call masteryRepository when no questions are concept-tagged', async () => {
    const mockAssessment = {
      id: 'assess-1',
      sourceId: 'source-1',
      questions: [
        { id: 'q-1', options: [{ id: 'opt-a', isCorrect: true }], conceptId: null },
      ],
    };
    assessmentRepository.findById.mockResolvedValue(mockAssessment as any);

    await useCase.execute(
      { assessmentId: 'assess-1', answers: [0] },
      'user-1',
    );

    expect(masteryRepository.upsertMany).not.toHaveBeenCalled();
  });
});
