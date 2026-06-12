import { Assessment } from '../assessment.entity';

const makeAssessment = (title: string | null) =>
  new Assessment('assess-1', 'source-1', title, new Date());

describe('Assessment entity', () => {
  describe('hasTitle()', () => {
    // TODO: returns true when a non-empty title is set
    // TODO: returns false when title is null
    // TODO: returns false when title is only whitespace
  });

  describe('displayTitle()', () => {
    // TODO: returns the title when one is set
    // TODO: returns a fallback using the id prefix when title is null (format: `Assessment ${id.slice(0, 8)}`)
  });
});
