import { Artifact } from '../entities/artifact.entity';
import { ArtifactType } from '../value-objects/artifact-type.vo';

export interface IArtifactRepository {
  findById(id: string): Promise<Artifact | null>;
  findBySourceId(sourceId: string): Promise<Artifact[]>;
  findBySourceIdAndType(sourceId: string, type: ArtifactType): Promise<Artifact | null>;
  save(artifact: Artifact): Promise<Artifact>;
  saveMany(artifacts: Artifact[]): Promise<Artifact[]>;
  deleteBySourceId(sourceId: string): Promise<void>;
  countBySourceId(sourceId: string): Promise<number>;
}
