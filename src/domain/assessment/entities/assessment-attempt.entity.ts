export class AssessmentAttempt {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly assessmentId: string,
    public readonly score: number | null,
    public readonly submittedAt: Date | null,
  ) {}

  isSubmitted(): boolean {
    // TODO: return true when submittedAt is not null
    throw new Error('Not implemented');
  }

  isPassed(passingThreshold = 70): boolean {
    // TODO: true when isSubmitted() AND score !== null AND score >= passingThreshold
    throw new Error('Not implemented');
  }

  isInProgress(): boolean {
    // TODO: return true when submittedAt is null (attempt not yet submitted)
    throw new Error('Not implemented');
  }
}
