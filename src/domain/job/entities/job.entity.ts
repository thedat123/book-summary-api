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
    return this.status === JobStatus.PENDING;
  }

  isRunning(): boolean {
    return this.status === JobStatus.RUNNING;
  }

  isCompleted(): boolean {
    return this.status === JobStatus.COMPLETED;
  }

  hasFailed(): boolean {
    return this.status === JobStatus.FAILED;
  }

  isTerminal(): boolean {
    return this.isCompleted() || this.hasFailed()
  }

  canRetry(): boolean {
    return this.hasFailed()
  }
}
