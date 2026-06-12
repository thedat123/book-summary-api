import { Question } from '../entities/question.entity';

/**
 * IQuestionRepository — Domain Repository Interface
 *
 * Mirrors the FK relationships:
 *   questions.assessment_id → assessments.id
 *   questions.concept_id   → concepts.id  (nullable)
 *
 * Questions are always retrieved WITH their options (eagerly loaded)
 *   because presenting a question without options is meaningless.
 */
export interface IQuestionRepository {
  findById(id: string): Promise<Question | null>;                    // includes options
  findByAssessmentId(assessmentId: string): Promise<Question[]>;    // includes options
  findByConceptId(conceptId: string): Promise<Question[]>;          // for mastery mapping
  saveMany(questions: Question[]): Promise<Question[]>;             // questions + options in one tx
  deleteByAssessmentId(assessmentId: string): Promise<void>;
  countByAssessmentId(assessmentId: string): Promise<number>;
}
