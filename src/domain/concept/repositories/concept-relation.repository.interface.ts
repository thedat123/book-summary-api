import { ConceptRelation } from '../entities/concept-relation.entity';
import { ConceptRelationType } from '../value-objects/concept-relation-type.vo';

/**
 * IConceptRelationRepository — Domain Repository Interface
 *
 * Mirrors the FK relationships:
 *   concept_relations.source_concept_id → concepts.id
 *   concept_relations.target_concept_id → concepts.id
 *
 * Responsibility: Persist and query the directed concept graph.
 *   Both directions of traversal are required:
 *     outgoing: "what concepts does X lead to?" (find by source)
 *     incoming: "what must be learned before X?" (find by target)
 */
export interface IConceptRelationRepository {
  findBySourceConceptId(sourceConceptId: string): Promise<ConceptRelation[]>;
  findByTargetConceptId(targetConceptId: string): Promise<ConceptRelation[]>;
  findByConceptId(conceptId: string): Promise<ConceptRelation[]>;  // both directions
  findByType(sourceConceptId: string, type: ConceptRelationType): Promise<ConceptRelation[]>;
  saveMany(relations: ConceptRelation[]): Promise<ConceptRelation[]>;
  deleteByConceptId(conceptId: string): Promise<void>;
  deleteBySourceId(sourceId: string): Promise<void>;
}
