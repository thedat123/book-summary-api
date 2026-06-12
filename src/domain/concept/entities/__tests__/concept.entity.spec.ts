import { Concept } from '../concept.entity';

const makeConcept = (importanceScore: number | null, description = 'A valid description') =>
  new Concept('c-1', 'src-1', 'Clean Code', description, importanceScore, new Date());

describe('Concept entity', () => {
  describe('isHighImportance()', () => {
    // TODO: returns true when importanceScore meets the default threshold of 0.7
    // TODO: returns true when importanceScore is above the threshold
    // TODO: returns false when importanceScore is below default threshold
    // TODO: returns false when importanceScore is null
    // TODO: respects a custom threshold parameter
  });

  describe('hasDescription()', () => {
    // TODO: returns true when description is non-empty
    // TODO: returns false when description is blank whitespace
    // TODO: returns false when description is an empty string
  });
});
