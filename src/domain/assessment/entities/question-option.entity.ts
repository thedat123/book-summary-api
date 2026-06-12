export class QuestionOption {
  constructor(
    public readonly id: string,
    public readonly questionId: string,
    public readonly content: string | null,
    public readonly isCorrect: boolean | null,
  ) {}

  isCorrectOption(): boolean {
    // TODO: return true only when isCorrect === true (not null, not false)
    throw new Error('Not implemented');
  }

  hasContent(): boolean {
    // TODO: return true when content is not null AND content.trim().length > 0
    throw new Error('Not implemented');
  }
}
