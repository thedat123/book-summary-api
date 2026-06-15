export class LearnerConceptMastery {
  constructor(
    public readonly userId: string,
    public readonly conceptId: string,
    public readonly masteryScore: number | null,
    public readonly updatedAt: Date | null,
  ) {}

  isMastered(threshold = 0.8): boolean {
    return this.masteryScore !== null && this.masteryScore >= threshold;
  }

  isNovice(threshold = 0.2): boolean {
    return this.masteryScore !== null && this.masteryScore < threshold;
  }

  isUnassessed(): boolean {
    return this.masteryScore === null;
  }

  masteryLevel(): 'UNASSESSED' | 'NOVICE' | 'LEARNING' | 'MASTERED' {
    switch (true) {
      case this.isUnassessed():
        return 'UNASSESSED';
      case this.isNovice():
        return 'NOVICE';
      case this.isMastered():
        return 'MASTERED';
      default:
        return 'LEARNING';
    }
  }
}
