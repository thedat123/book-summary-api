import { Concept } from '../entities/concept.entity';

/**
 * IConceptRepository — Domain Repository Interface
 *
 * Mirrors the FK relationship:
 *   concepts.source_id → sources.id
 *
 * Responsibility: Persist and retrieve Concept entities for a Source.
 *   All concepts for a source are replaced atomically on re-extraction
 *   (deleteBySourceId + saveMany in one transaction).
 */
export interface IConceptRepository {
  findById(id: string): Promise<Concept | null>;
  findBySourceId(sourceId: string): Promise<Concept[]>;
  findBySourceIdOrderedByImportance(sourceId: string): Promise<Concept[]>;
  save(concept: Concept): Promise<Concept>;
  saveMany(concepts: Concept[]): Promise<Concept[]>;
  deleteBySourceId(sourceId: string): Promise<void>;
  countBySourceId(sourceId: string): Promise<number>;
  existsById(id: string): Promise<boolean>;
}
