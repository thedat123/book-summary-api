import { NotFoundException } from '@nestjs/common';
import { SubmitAssessmentUseCase } from '../submit-assessment.use-case';
import { IAssessmentRepository } from '@domain/assessment/repositories/assessment.repository.interface';
import { IQuestionRepository } from '@domain/assessment/repositories/question.repository.interface';
import { IAssessmentAttemptRepository } from '@domain/assessment/repositories/assessment-attempt.repository.interface';
import { ILearnerConceptMasteryRepository } from '@domain/mastery/repositories/learner-concept-mastery.repository.interface';
import { Assessment } from '@domain/assessment/entities/assessment.entity';
import { Question } from '@domain/assessment/entities/question.entity';
import { QuestionOption } from '@domain/assessment/entities/question-option.entity';
import { AssessmentAttempt } from '@domain/assessment/entities/assessment-attempt.entity';
import { AssessmentStatus } from '@domain/assessment/value-objects/assessment-status.vo';

// ── Shared factories ──────────────────────────────────────────────────────────

const makeAssessment = () =>
  new Assessment('assess-1', 'source-1', 'Test Quiz', new Date(), AssessmentStatus.PENDING);

/**
 * Builds a Question with two options. optionCorrectIndex determines which
 * option is marked correct (0 = first, 1 = second).
 * conceptId is null by default; pass a string to simulate a concept-tagged question.
 */
const makeQuestion = (
  id: string,
  optionCorrectIndex: 0 | 1,
  conceptId: string | null = null,
): Question => {
  const options = [
    new QuestionOption(`${id}-opt-0`, id, 'Option A', optionCorrectIndex === 0),
    new QuestionOption(`${id}-opt-1`, id, 'Option B', optionCorrectIndex === 1),
  ];
  return new Question(id, 'assess-1', conceptId, 'A question body', null, null, options, new Date());
};

// The attempt the repository echoes back after save()
const makeSavedAttempt = (score = 100) =>
  new AssessmentAttempt('attempt-1', 'user-1', 'assess-1', score, new Date());

// ── Test suite ────────────────────────────────────────────────────────────────

describe('SubmitAssessmentUseCase', () => {
  let useCase: SubmitAssessmentUseCase;
  let assessmentRepository: jest.Mocked<IAssessmentRepository>;
  let questionRepository: jest.Mocked<IQuestionRepository>;
  let attemptRepository: jest.Mocked<IAssessmentAttemptRepository>;
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

    questionRepository = {
      findById: jest.fn(),
      findByAssessmentId: jest.fn(),
      findByConceptId: jest.fn(),
      saveMany: jest.fn(),
      deleteByAssessmentId: jest.fn(),
      countByAssessmentId: jest.fn(),
    };

    attemptRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdAndAssessmentId: jest.fn(),
      findLatestByUserIdAndAssessmentId: jest.fn(),
      save: jest.fn(),
      submitAttempt: jest.fn(),
      saveQuestionAttempts: jest.fn(),
      findQuestionAttemptsByAttemptId: jest.fn(),
    };

    masteryRepository = {
      findByUserIdAndConceptId: jest.fn(),
      findByUserId: jest.fn(),
      findByConceptId: jest.fn(),
      findByUserIdAndSourceId: jest.fn(),
      upsert: jest.fn(),
      upsertMany: jest.fn(),
    };

    useCase = new SubmitAssessmentUseCase(
      assessmentRepository as any,
      questionRepository as any,
      attemptRepository as any,
      masteryRepository as any,
    );
  });

  it('throws NotFoundException when assessment does not exist', async () => {
    assessmentRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ assessmentId: 'missing', answers: [0] }, 'user-1'),
    ).rejects.toThrow(NotFoundException);

    // No further repository calls should happen after the 404
    expect(questionRepository.findByAssessmentId).not.toHaveBeenCalled();
    expect(attemptRepository.save).not.toHaveBeenCalled();
  });

  it('scores answers correctly and returns 100% when all answers are correct', async () => {
    // q-1: correct option is index 0 (opt-0), user answers 0 → correct
    // q-2: correct option is index 1 (opt-1), user answers 1 → correct
    assessmentRepository.findById.mockResolvedValue(makeAssessment());
    questionRepository.findByAssessmentId.mockResolvedValue([
      makeQuestion('q-1', 0),
      makeQuestion('q-2', 1),
    ]);
    attemptRepository.save.mockResolvedValue(makeSavedAttempt(100));
    attemptRepository.saveQuestionAttempts.mockResolvedValue([]);

    const result = await useCase.execute(
      { assessmentId: 'assess-1', answers: [0, 1] },
      'user-1',
    );

    expect(result.score).toBe(100);
    expect(result.percentageScore).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.status).toBe(AssessmentStatus.COMPLETED);
  });

  it('scores 50% when half the answers are correct', async () => {
    // q-1: correct=0, user answers 0 → correct
    // q-2: correct=1, user answers 0 → wrong
    assessmentRepository.findById.mockResolvedValue(makeAssessment());
    questionRepository.findByAssessmentId.mockResolvedValue([
      makeQuestion('q-1', 0),
      makeQuestion('q-2', 1),
    ]);
    attemptRepository.save.mockResolvedValue(makeSavedAttempt(50));
    attemptRepository.saveQuestionAttempts.mockResolvedValue([]);

    const result = await useCase.execute(
      { assessmentId: 'assess-1', answers: [0, 0] },
      'user-1',
    );

    expect(result.score).toBe(50);
    expect(result.passed).toBe(false); // below 70% threshold
  });

  it('saves question attempts for every question answered', async () => {
    assessmentRepository.findById.mockResolvedValue(makeAssessment());
    questionRepository.findByAssessmentId.mockResolvedValue([
      makeQuestion('q-1', 0),
      makeQuestion('q-2', 1),
    ]);
    attemptRepository.save.mockResolvedValue(makeSavedAttempt(100));
    attemptRepository.saveQuestionAttempts.mockResolvedValue([]);

    await useCase.execute({ assessmentId: 'assess-1', answers: [0, 1] }, 'user-1');

    // One QuestionAttempt per question should be persisted
    const savedAttempts = attemptRepository.saveQuestionAttempts.mock.calls[0][0];
    expect(savedAttempts).toHaveLength(2);
    expect(savedAttempts[0].questionId).toBe('q-1');
    expect(savedAttempts[1].questionId).toBe('q-2');
  });

  it('upserts mastery for concept-tagged questions after submission', async () => {
    // q-1 is tagged with concept-x, q-2 is untagged
    assessmentRepository.findById.mockResolvedValue(makeAssessment());
    questionRepository.findByAssessmentId.mockResolvedValue([
      makeQuestion('q-1', 0, 'concept-x'), // correct answer = index 0
      makeQuestion('q-2', 1),              // no concept
    ]);
    attemptRepository.save.mockResolvedValue(makeSavedAttempt(100));
    attemptRepository.saveQuestionAttempts.mockResolvedValue([]);
    masteryRepository.upsertMany.mockResolvedValue([]);

    await useCase.execute({ assessmentId: 'assess-1', answers: [0, 1] }, 'user-1');

    expect(masteryRepository.upsertMany).toHaveBeenCalledTimes(1);
    const upsertArg = masteryRepository.upsertMany.mock.calls[0][0];
    // Only concept-x should appear — q-2 has no concept
    expect(upsertArg).toHaveLength(1);
    expect(upsertArg[0].conceptId).toBe('concept-x');
    expect(upsertArg[0].userId).toBe('user-1');
  });

  it('computes mastery score as correct/total ratio per concept', async () => {
    // Both questions are tagged with the same concept.
    // User answers only q-1 correctly (index 0 = correct), q-2 wrong (index 0 ≠ correct index 1).
    assessmentRepository.findById.mockResolvedValue(makeAssessment());
    questionRepository.findByAssessmentId.mockResolvedValue([
      makeQuestion('q-1', 0, 'concept-x'), // correct = index 0
      makeQuestion('q-2', 1, 'concept-x'), // correct = index 1
    ]);
    attemptRepository.save.mockResolvedValue(makeSavedAttempt(50));
    attemptRepository.saveQuestionAttempts.mockResolvedValue([]);
    masteryRepository.upsertMany.mockResolvedValue([]);

    await useCase.execute({ assessmentId: 'assess-1', answers: [0, 0] }, 'user-1');

    const upsertArg = masteryRepository.upsertMany.mock.calls[0][0];
    // 1 correct out of 2 → masteryScore = 0.5
    expect(upsertArg[0].masteryScore).toBeCloseTo(0.5);
  });

  it('does not call masteryRepository when no questions are concept-tagged', async () => {
    assessmentRepository.findById.mockResolvedValue(makeAssessment());
    questionRepository.findByAssessmentId.mockResolvedValue([
      makeQuestion('q-1', 0), // no conceptId
    ]);
    attemptRepository.save.mockResolvedValue(makeSavedAttempt(100));
    attemptRepository.saveQuestionAttempts.mockResolvedValue([]);

    await useCase.execute({ assessmentId: 'assess-1', answers: [0] }, 'user-1');

    // Avoids an unnecessary write when the assessment has no concept coverage
    expect(masteryRepository.upsertMany).not.toHaveBeenCalled();
  });
});
