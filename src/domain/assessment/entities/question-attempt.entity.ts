export class QuestionAttempt {
  constructor(
    public readonly id: string,
    public readonly assessmentAttemptId: string,
    public readonly questionId: string,
    public readonly selectedOptionId: string | null,
    public readonly isCorrect: boolean | null,
  ) {}

  wasAnswered(): boolean {
    // TODO: return true when selectedOptionId is not null
    throw new Error('Not implemented');
  }

  wasSkipped(): boolean {
    // TODO: return true when selectedOptionId is null
    throw new Error('Not implemented');
  }

  isGraded(): boolean {
    // TODO: return true when isCorrect is not null
    throw new Error('Not implemented');
  }
}
