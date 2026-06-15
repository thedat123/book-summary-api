export class Concept {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly importanceScore: number | null,
    public readonly createdAt: Date | null,
  ) {}

  isHighImportance(threshold = 0.7): boolean {
    return this.importanceScore !== null && this.importanceScore >= threshold;
  }

  hasDescription(): boolean {
    return this.description.trim().length > 0;
  }
}
