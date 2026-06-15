import { Question } from '../question.entity';
import { QuestionOption } from '../question-option.entity';

const makeOption = (id: string, isCorrect: boolean) =>
  new QuestionOption(id, 'q-1', `Option ${id}`, isCorrect);

const makeQuestion = (options: QuestionOption[], conceptId: string | null = null) =>
  new Question('q-1', 'assess-1', conceptId, 'What is clean code?', 'Because readability matters.', 0.5, options, new Date());

describe('Question entity (assessment domain)', () => {
  describe('getCorrectOption()', () => {
    expect(makeQuestion([makeOption('opt-1', false), makeOption('opt-2', true), makeOption('opt-3', false)]).getCorrectOption())
      .toEqual(makeOption('opt-2', true));

    expect(makeQuestion([makeOption('opt-1', false), makeOption('opt-2', false)]).getCorrectOption())
      .toBeUndefined();
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
