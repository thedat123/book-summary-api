import { LearnerConceptMastery } from '../learner-concept-mastery.entity';

const makeMastery = (score: number | null) =>
  new LearnerConceptMastery('user-1', 'concept-1', score, new Date());

describe('LearnerConceptMastery entity', () => {
  describe('isUnassessed()', () => {
    // TODO: returns true when masteryScore is null
    // TODO: returns false when masteryScore is set
  });

  describe('isNovice()', () => {
    // TODO: returns true when score is below default threshold of 0.2
    // TODO: returns false when score meets or exceeds threshold
    // TODO: returns false when score is null
  });

  describe('isMastered()', () => {
    // TODO: returns true when score meets or exceeds default threshold of 0.8
    // TODO: returns false when score is below threshold
    // TODO: returns false when score is null
    // TODO: respects a custom threshold parameter
  });

  describe('masteryLevel()', () => {
    // TODO: returns 'UNASSESSED' when score is null
    // TODO: returns 'NOVICE' when score < 0.2
    // TODO: returns 'LEARNING' when score is between 0.2 and 0.79 (inclusive on both ends)
    // TODO: returns 'MASTERED' when score is 0.8 or above
  });
});
