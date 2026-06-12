import { Question } from '../question.entity';
import { QuestionOption } from '../question-option.entity';

const makeOption = (id: string, isCorrect: boolean) =>
  new QuestionOption(id, 'q-1', `Option ${id}`, isCorrect);

const makeQuestion = (options: QuestionOption[], conceptId: string | null = null) =>
  new Question('q-1', 'assess-1', conceptId, 'What is clean code?', 'Because readability matters.', 0.5, options, new Date());

describe('Question entity (assessment domain)', () => {
  describe('getCorrectOption()', () => {
    // TODO: returns the option where isCorrect is true
    // TODO: returns undefined when no correct option exists
  });

  describe('isOptionCorrect()', () => {
    // TODO: returns true for the correct option id
    // TODO: returns false for an incorrect option id
    // TODO: returns false for a non-existent option id
  });

  describe('hasEnoughOptions()', () => {
    // TODO: returns true when options count meets the minimum (default 2)
    // TODO: returns false when options count is below minimum
    // TODO: respects a custom minimum parameter
  });

  describe('hasExactlyOneCorrectOption()', () => {
    // TODO: returns true when exactly one option is correct
    // TODO: returns false when no option is correct
    // TODO: returns false when multiple options are correct
  });

  describe('isLinkedToConcept()', () => {
    // TODO: returns true when conceptId is set
    // TODO: returns false when conceptId is null
  });
});
