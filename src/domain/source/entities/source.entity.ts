import { SourceType } from '../value-objects/source-type.vo';
import { SourceStatus } from '../value-objects/source-status.vo';

export interface AiSnapshot {
  summary: string;
  main_topics: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimated_reading_time: number;
}

export class Source {
  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public readonly title: string,
    public readonly sourceType: SourceType,
    public readonly sourceUrl: string | null,
    public readonly status: SourceStatus,
    public readonly aiSnapshot: AiSnapshot | null,
    public readonly createdAt: Date | null,
  ) {}

  isCompleted(): boolean {
    return this.status === SourceStatus.COMPLETED
  }

  isProcessing(): boolean {
    return this.status === SourceStatus.PROCESSING
  }

  hasFailed(): boolean {
    return this.status === SourceStatus.FAILED
  }

  belongsToUser(userId: string): boolean {
    return this.ownerId === userId;
  }

  canStartJob(): boolean {
    return this.status !== SourceStatus.COMPLETED
  }

  hasAiSnapshot(): boolean {
    return this.aiSnapshot ? true : false;
  }
}
