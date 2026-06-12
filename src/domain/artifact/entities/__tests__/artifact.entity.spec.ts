import { Artifact } from '../artifact.entity';
import { ArtifactType } from '../../value-objects/artifact-type.vo';

const makeArtifact = (type: ArtifactType) =>
  new Artifact('art-1', 'src-1', type, { data: 'content' }, new Date());

describe('Artifact entity', () => {
  describe('isSummary()', () => {
    // TODO: returns true for SUMMARY type
    // TODO: returns false for FLASHCARD_SET, QUIZ_SET, LEARNING_PATH
  });

  describe('isFlashcardSet()', () => {
    // TODO: returns true for FLASHCARD_SET type
    // TODO: returns false for other types
  });

  describe('isQuizSet()', () => {
    // TODO: returns true for QUIZ_SET type
    // TODO: returns false for other types
  });

  describe('isLearningPath()', () => {
    // TODO: returns true for LEARNING_PATH type
    // TODO: returns false for other types
  });
});
