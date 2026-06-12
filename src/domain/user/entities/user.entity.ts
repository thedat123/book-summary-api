export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string | null,
    public readonly createdAt: Date | null,
  ) {}

  hasEmail(email: string): boolean {
    return this.email === email;
  }

  displayName(): string {
    return this.name ?? this.email.split('@')[0];
  }
}
