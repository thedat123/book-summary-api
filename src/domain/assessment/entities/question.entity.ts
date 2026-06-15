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
    return this.options.find(option => option.isCorrectOption());
  }

  isOptionCorrect(optionId: string): boolean {
    return this.options.some(option => option.id === optionId && option.isCorrectOption());
  }

  hasEnoughOptions(min = 2): boolean {
    return this.options.length >= min;
  }

  hasExactlyOneCorrectOption(): boolean {
    return this.options.filter(option => option.isCorrectOption()).length === 1;
  }

  isLinkedToConcept(): boolean {
    return this.conceptId !== null;
  }
}
