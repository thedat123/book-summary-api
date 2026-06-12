export class Assessment {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly title: string | null,
    public readonly createdAt: Date | null,
  ) {}

  hasTitle(): boolean {
    // TODO: return true when title is not null AND title.trim().length > 0
    throw new Error('Not implemented');
  }

  displayTitle(): string {
    // TODO: return this.title if it's truthy, otherwise `Assessment ${this.id.slice(0, 8)}`
    throw new Error('Not implemented');
  }
}
