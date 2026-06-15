import { AssessmentStatus } from "@domain/assessment/value-objects/assessment-status.vo";

/**
 * Assessment — Domain Entity
 *
 * Represents a quiz template tied to a Source. It is NOT user-specific;
 * any authenticated user can attempt it. Per-user data lives in AssessmentAttempt.
 *
 * Design note: Assessment has no userId field by design. Ownership of the
 * underlying Source is enforced at the use-case level when needed.
 */
export class Assessment {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly title: string | null,
    public readonly createdAt: Date | null,
    public readonly status: AssessmentStatus,
  ) {}

  /** True when a non-empty title was provided explicitly. */
  hasTitle(): boolean {
    return this.title !== null && this.title.trim().length > 0;
  }

  /**
   * Returns the title if set, otherwise a deterministic fallback using the
   * first 8 chars of the id so the UI always has a displayable string.
   */
  displayTitle(): string {
    return this.hasTitle() ? this.title! : `Assessment ${this.id.slice(0, 8)}`;
  }

  /** True when the assessment has already been submitted and scored. */
  isCompleted(): boolean {
    return this.status === AssessmentStatus.COMPLETED;
  }
}
