/**
 * JobStatus — Value Object
 *
 * Responsibility: Track the lifecycle of a background job.
 *   Maps to the `status` varchar column in the `jobs` table.
 *
 * Lifecycle:
 *   PENDING → RUNNING → COMPLETED
 *                     ↘ FAILED  (error_message is populated)
 *
 * A FAILED job can be retried by creating a new Job record (immutable log).
 */
export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
