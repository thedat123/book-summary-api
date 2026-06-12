import { ConceptRelationType } from '../value-objects/concept-relation-type.vo';

export class ConceptRelation {
  constructor(
    public readonly id: string,
    public readonly sourceConceptId: string,
    public readonly targetConceptId: string,
    public readonly relationType: ConceptRelationType,
    public readonly createdAt: Date | null,
  ) {}

  isDependency(): boolean {
    // TODO: return true when relationType === ConceptRelationType.DEPENDS_ON
    throw new Error('Not implemented');
  }

  isRelated(): boolean {
    // TODO: return true when relationType === ConceptRelationType.RELATED_TO
    throw new Error('Not implemented');
  }

  isSelfLoop(): boolean {
    // TODO: return true when sourceConceptId === targetConceptId
    throw new Error('Not implemented');
  }
}
