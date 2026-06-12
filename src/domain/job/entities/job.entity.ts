import { JobType } from '../value-objects/job-type.vo';
import { JobStatus } from '../value-objects/job-status.vo';

export class Job {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly type: JobType,
    public readonly status: JobStatus,
    public readonly errorMessage: string | null,
    public readonly createdAt: Date | null,
  ) {}

  isPending(): boolean {
    // TODO: status === JobStatus.PENDING
    throw new Error('Not implemented');
  }

  isRunning(): boolean {
    // TODO: status === JobStatus.RUNNING
    throw new Error('Not implemented');
  }

  isCompleted(): boolean {
    // TODO: status === JobStatus.COMPLETED
    throw new Error('Not implemented');
  }

  hasFailed(): boolean {
    // TODO: status === JobStatus.FAILED
    throw new Error('Not implemented');
  }

  isTerminal(): boolean {
    // TODO: true when status is COMPLETED or FAILED (no further transitions)
    throw new Error('Not implemented');
  }

  canRetry(): boolean {
    // TODO: only FAILED jobs can be retried — delegate to hasFailed()
    throw new Error('Not implemented');
  }
}
