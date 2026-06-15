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
    return this.relationType === ConceptRelationType.DEPENDS_ON;
  }

  isRelated(): boolean {
    return this.relationType === ConceptRelationType.RELATED_TO;
  }

  isSelfLoop(): boolean {
    return this.sourceConceptId === this.targetConceptId;
  }
}
