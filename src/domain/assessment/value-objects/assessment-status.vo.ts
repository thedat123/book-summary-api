/**
 * AssessmentStatus — Value Object
 *
 * Scalability: Add EXPIRED status when time-limited assessments are introduced.
 */
export enum AssessmentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
