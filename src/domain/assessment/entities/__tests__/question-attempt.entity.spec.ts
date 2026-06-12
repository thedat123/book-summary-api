import { QuestionAttempt } from '../question-attempt.entity';

const makeAttempt = (selectedOptionId: string | null, isCorrect: boolean | null) =>
  new QuestionAttempt('qa-1', 'att-1', 'q-1', selectedOptionId, isCorrect);

describe('QuestionAttempt entity', () => {
  describe('wasAnswered()', () => {
    // TODO: returns true when an option was selected (selectedOptionId is not null)
    // TODO: returns false when no option was selected (selectedOptionId is null)
  });

  describe('wasSkipped()', () => {
    // TODO: returns true when selectedOptionId is null
    // TODO: returns false when an option was selected
  });

  describe('isGraded()', () => {
    // TODO: returns true when isCorrect is not null (regardless of value)
    // TODO: returns false when isCorrect is null
  });
});
