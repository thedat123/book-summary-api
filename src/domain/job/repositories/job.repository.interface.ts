import { Job } from '../entities/job.entity';
import { JobType } from '../value-objects/job-type.vo';
import { JobStatus } from '../value-objects/job-status.vo';

/**
 * IJobRepository — Domain Repository Interface
 *
 * Mirrors the FK relationship:
 *   jobs.source_id → sources.id
 *
 * Responsibility: Persist and query background jobs.
 *   Jobs are append-only — never updated after creation.
 *   A new status record means creating a new Job row (immutable log pattern).
 *
 * findPending is the primary method for the job worker: it polls for work.
 *   In production, replace polling with a queue (BullMQ) that calls
 *   save() to persist the job, then pushes the id to the queue.
 */
export interface IJobRepository {
  findById(id: string): Promise<Job | null>;
  findBySourceId(sourceId: string): Promise<Job[]>;
  findByStatus(status: JobStatus): Promise<Job[]>;
  findPendingByType(type: JobType): Promise<Job[]>;
  findLatestBySourceIdAndType(sourceId: string, type: JobType): Promise<Job | null>;
  save(job: Job): Promise<Job>;
  updateStatus(id: string, status: JobStatus, errorMessage?: string): Promise<Job>;
}
