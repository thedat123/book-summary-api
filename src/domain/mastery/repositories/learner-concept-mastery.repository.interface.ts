import { LearnerConceptMastery } from '../entities/learner-concept-mastery.entity';

/**
 * ILearnerConceptMasteryRepository — Domain Repository Interface
 *
 * Mirrors the FK relationships:
 *   learner_concept_mastery.user_id    → users.id
 *   learner_concept_mastery.concept_id → concepts.id
 *
 * The table has a composite PK (user_id, concept_id) — upsert is the
 *   primary write operation (create on first assessment, update on retry).
 *
 * Responsibility: Track and update per-user, per-concept mastery scores.
 *   Updated by the SubmitAssessmentAttemptUseCase after grading.
 */
export interface ILearnerConceptMasteryRepository {
  findByUserIdAndConceptId(userId: string, conceptId: string): Promise<LearnerConceptMastery | null>;
  findByUserId(userId: string): Promise<LearnerConceptMastery[]>;
  findByConceptId(conceptId: string): Promise<LearnerConceptMastery[]>;

  // Find all mastery records for a user filtered by a source's concepts
  findByUserIdAndSourceId(userId: string, sourceId: string): Promise<LearnerConceptMastery[]>;

  upsert(userId: string, conceptId: string, masteryScore: number): Promise<LearnerConceptMastery>;
  upsertMany(records: UpsertMasteryInput[]): Promise<LearnerConceptMastery[]>;
}

export interface UpsertMasteryInput {
  userId: string;
  conceptId: string;
  masteryScore: number;
}
