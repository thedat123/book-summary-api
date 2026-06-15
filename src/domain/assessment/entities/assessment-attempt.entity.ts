export class AssessmentAttempt {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly assessmentId: string,
    public readonly score: number | null,
    public readonly submittedAt: Date | null,
  ) {}

  isSubmitted(): boolean {
    return this.submittedAt !== null;
  }

  isPassed(passingThreshold = 70): boolean {
    return this.isSubmitted() && this.score !== null && this.score >= passingThreshold;
  }

  isInProgress(): boolean {
    return this.submittedAt === null;
  }
}
