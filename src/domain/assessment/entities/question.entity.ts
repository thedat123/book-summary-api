import { QuestionOption } from './question-option.entity';

export class Question {
  constructor(
    public readonly id: string,
    public readonly assessmentId: string,
    public readonly conceptId: string | null,
    public readonly body: string,
    public readonly explanation: string | null,
    public readonly difficulty: number | null,
    public readonly options: QuestionOption[],
    public readonly createdAt: Date | null,
  ) {}

  getCorrectOption(): QuestionOption | undefined {
    // TODO: find the first option where isCorrect === true
    throw new Error('Not implemented');
  }

  isOptionCorrect(optionId: string): boolean {
    // TODO: find option by id, return option?.isCorrect === true
    throw new Error('Not implemented');
  }

  hasEnoughOptions(min = 2): boolean {
    // TODO: return true when options.length >= min
    throw new Error('Not implemented');
  }

  hasExactlyOneCorrectOption(): boolean {
    // TODO: filter options where isCorrect === true, return true when count === 1
    throw new Error('Not implemented');
  }

  isLinkedToConcept(): boolean {
    // TODO: return true when conceptId is not null
    throw new Error('Not implemented');
  }
}
