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
    // TODO: return true when importanceScore is not null AND >= threshold
    throw new Error('Not implemented');
  }

  hasDescription(): boolean {
    // TODO: return true when description.trim() has length > 0
    throw new Error('Not implemented');
  }
}
