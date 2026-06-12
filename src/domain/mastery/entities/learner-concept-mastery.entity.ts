export class LearnerConceptMastery {
  constructor(
    public readonly userId: string,
    public readonly conceptId: string,
    public readonly masteryScore: number | null,
    public readonly updatedAt: Date | null,
  ) {}

  isMastered(threshold = 0.8): boolean {
    // TODO: true when masteryScore !== null AND masteryScore >= threshold
    throw new Error('Not implemented');
  }

  isNovice(threshold = 0.2): boolean {
    // TODO: true when masteryScore !== null AND masteryScore < threshold
    throw new Error('Not implemented');
  }

  isUnassessed(): boolean {
    // TODO: true when masteryScore is null
    throw new Error('Not implemented');
  }

  masteryLevel(): 'UNASSESSED' | 'NOVICE' | 'LEARNING' | 'MASTERED' {
    // TODO: if null → 'UNASSESSED'
    // TODO: < 0.2  → 'NOVICE'
    // TODO: < 0.8  → 'LEARNING'
    // TODO: else   → 'MASTERED'
    throw new Error('Not implemented');
  }
}
