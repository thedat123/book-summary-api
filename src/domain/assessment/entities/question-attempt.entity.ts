export class QuestionAttempt {
  constructor(
    public readonly id: string,
    public readonly assessmentAttemptId: string,
    public readonly questionId: string,
    public readonly selectedOptionId: string | null,
    public readonly isCorrect: boolean | null,
  ) {}

  wasAnswered(): boolean {
    return this.selectedOptionId !== null;
  }

  wasSkipped(): boolean {
    return this.selectedOptionId === null;
  }

  isGraded(): boolean {
    return this.isCorrect !== null;
  }
}
