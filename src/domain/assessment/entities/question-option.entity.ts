export class QuestionOption {
  constructor(
    public readonly id: string,
    public readonly questionId: string,
    public readonly content: string | null,
    public readonly isCorrect: boolean | null,
  ) {}

  isCorrectOption(): boolean {
    return this.isCorrect === true
  }

  hasContent(): boolean {
    return this.content !== null && this.content.trim().length > 0;
  }
}
