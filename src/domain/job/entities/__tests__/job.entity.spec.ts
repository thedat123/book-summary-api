import { Job } from '../job.entity';
import { JobStatus } from '../../value-objects/job-status.vo';
import { JobType } from '../../value-objects/job-type.vo';

const makeJob = (status: JobStatus) =>
  new Job('job-1', 'source-1', JobType.EXTRACT_CONCEPTS, status, null, new Date());

describe('Job entity', () => {
  describe('status predicates', () => {
    // TODO: isPending() is true only for PENDING, false for other statuses
    // TODO: isRunning() is true only for RUNNING, false for other statuses
    // TODO: isCompleted() is true only for COMPLETED, false for other statuses
    // TODO: hasFailed() is true only for FAILED, false for other statuses
  });

  describe('isTerminal()', () => {
    // TODO: returns true for COMPLETED
    // TODO: returns true for FAILED
    // TODO: returns false for PENDING
    // TODO: returns false for RUNNING
  });

  describe('canRetry()', () => {
    // TODO: returns true only for FAILED jobs
    // TODO: returns false for PENDING, RUNNING, COMPLETED
  });

  describe('immutability', () => {
    // TODO: retrying a FAILED job means creating a NEW Job entity with PENDING status
    //       (the original entity state must remain unchanged)
  });
});
