import { AssessmentAttempt } from '../assessment-attempt.entity';

const makeAttempt = (score: number | null, submittedAt: Date | null) =>
  new AssessmentAttempt('att-1', 'user-1', 'assess-1', score, submittedAt);

describe('AssessmentAttempt entity', () => {
  describe('isSubmitted()', () => {
    // TODO: returns true when submittedAt is set
    // TODO: returns false when submittedAt is null
  });

  describe('isPassed()', () => {
    // TODO: returns true when submitted and score meets default threshold of 70
    // TODO: returns false when score is below threshold
    // TODO: returns false when not yet submitted (submittedAt is null)
    // TODO: returns false when score is null
    // TODO: respects a custom passing threshold parameter
  });

  describe('isInProgress()', () => {
    // TODO: returns true when submittedAt is null
    // TODO: returns false once submitted (submittedAt is set)
  });
});
