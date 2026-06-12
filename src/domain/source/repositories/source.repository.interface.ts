import { Source, AiSnapshot } from '../entities/source.entity';
import { SourceStatus } from '../value-objects/source-status.vo';

export interface ISourceRepository {
  findById(id: string): Promise<Source | null>;
  findByOwnerId(ownerId: string, options?: FindSourcesOptions): Promise<Source[]>;
  findByOwnerIdAndStatus(ownerId: string, status: SourceStatus): Promise<Source[]>;
  save(source: Source): Promise<Source>;
  updateStatus(id: string, status: SourceStatus): Promise<Source>;
  update(id: string, partial: UpdateSourceData): Promise<Source>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
  countByOwnerId(ownerId: string): Promise<number>;
}

export interface FindSourcesOptions {
  limit?: number;
  offset?: number;
  status?: SourceStatus;
}

export interface UpdateSourceData {
  title?: string;
  status?: SourceStatus;
  sourceUrl?: string | null;
  aiSnapshot?: AiSnapshot | null;
}
