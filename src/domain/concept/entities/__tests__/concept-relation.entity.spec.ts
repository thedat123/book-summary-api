import { ConceptRelation } from '../concept-relation.entity';
import { ConceptRelationType } from '../../value-objects/concept-relation-type.vo';

const makeRelation = (type: ConceptRelationType, src = 'c-1', tgt = 'c-2') =>
  new ConceptRelation('rel-1', src, tgt, type, new Date());

describe('ConceptRelation entity', () => {
  describe('isDependency()', () => {
    // TODO: returns true for DEPENDS_ON
    // TODO: returns false for USES, PART_OF, RELATED_TO
  });

  describe('isRelated()', () => {
    // TODO: returns true for RELATED_TO
    // TODO: returns false for DEPENDS_ON
  });

  describe('isSelfLoop()', () => {
    // TODO: returns true when sourceConceptId === targetConceptId
    // TODO: returns false when sourceConceptId !== targetConceptId
  });
});
