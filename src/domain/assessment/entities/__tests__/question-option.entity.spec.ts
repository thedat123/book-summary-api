import { QuestionOption } from '../question-option.entity';

const makeOption = (isCorrect: boolean | null, content: string | null = 'Option text') =>
  new QuestionOption('opt-1', 'q-1', content, isCorrect);

describe('QuestionOption entity', () => {
  describe('isCorrectOption()', () => {
    // TODO: returns true when isCorrect is true
    // TODO: returns false when isCorrect is false
    // TODO: returns false when isCorrect is null
  });

  describe('hasContent()', () => {
    // TODO: returns true when content is non-empty
    // TODO: returns false when content is null
    // TODO: returns false when content is whitespace only
    // TODO: returns false when content is empty string
  });
});
