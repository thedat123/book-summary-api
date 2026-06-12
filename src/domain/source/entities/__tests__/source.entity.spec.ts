import { Source } from '../source.entity';
import { SourceStatus } from '../../value-objects/source-status.vo';
import { SourceType } from '../../value-objects/source-type.vo';

const makeSource = (status: SourceStatus, ownerId = 'user-1') =>
  new Source('src-1', ownerId, 'Clean Code', SourceType.PDF, null, status, null, new Date());

describe('Source entity', () => {
 describe('isCompleted()', () => {
    it('should return true only for completed source', () => {
      const completedSource = makeSource(SourceStatus.COMPLETED);
      expect(completedSource.isCompleted()).toBe(true);
    });

    it('should return false for non-completed source', () => {
      const processingSource = makeSource(SourceStatus.PROCESSING);
      const failedSource = makeSource(SourceStatus.FAILED);

      expect(processingSource.isCompleted()).toBe(false);
      expect(failedSource.isCompleted()).toBe(false);
    });
  });

  describe('isProcessing()', () => {
    const completedSource = makeSource(SourceStatus.COMPLETED);
    const processingSource = makeSource(SourceStatus.PROCESSING);
    const failedSource = makeSource(SourceStatus.FAILED);

    expect(completedSource.isProcessing()).toBe(false);
    expect(processingSource.isProcessing()).toBe(true);
    expect(failedSource.isProcessing()).toBe(false);
  });

  describe('hasFailed()', () => {
    const completedSource = makeSource(SourceStatus.COMPLETED);
    const processingSource = makeSource(SourceStatus.PROCESSING);
    const failedSource = makeSource(SourceStatus.FAILED);

    expect(completedSource.hasFailed()).toBe(false);
    expect(processingSource.hasFailed()).toBe(false);
    expect(failedSource.hasFailed()).toBe(true);
  });

  describe('belongsToUser()', () => {
    // TODO: returns true when userId matches ownerId
    // TODO: returns false when userId does not match ownerId
  });

  describe('canStartJob()', () => {
    // TODO: returns true when status is FAILED
    // TODO: returns true when status is PROCESSING
    // TODO: returns false when status is COMPLETED
  });

  describe('hasAiSnapshot()', () => {
    // TODO: returns false when aiSnapshot is null
    // TODO: returns true when aiSnapshot object is present
  });
});
