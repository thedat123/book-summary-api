import { AssessmentAttempt } from '../entities/assessment-attempt.entity';
import { QuestionAttempt } from '../entities/question-attempt.entity';

/**
 * IAssessmentAttemptRepository — Domain Repository Interface
 *
 * Mirrors the FK relationships:
 *   assessment_attempts.user_id       → users.id
 *   assessment_attempts.assessment_id → assessments.id
 *   question_attempts.assessment_attempt_id → assessment_attempts.id
 *   question_attempts.question_id           → questions.id
 *   question_attempts.selected_option_id    → question_options.id
 */
export interface IAssessmentAttemptRepository {
  findById(id: string): Promise<AssessmentAttempt | null>;
  findByUserId(userId: string): Promise<AssessmentAttempt[]>;
  findByUserIdAndAssessmentId(userId: string, assessmentId: string): Promise<AssessmentAttempt[]>;
  findLatestByUserIdAndAssessmentId(userId: string, assessmentId: string): Promise<AssessmentAttempt | null>;
  save(attempt: AssessmentAttempt): Promise<AssessmentAttempt>;
  submitAttempt(id: string, score: number, submittedAt: Date): Promise<AssessmentAttempt>;

  // QuestionAttempts are managed through the AssessmentAttempt aggregate
  saveQuestionAttempts(questionAttempts: QuestionAttempt[]): Promise<QuestionAttempt[]>;
  findQuestionAttemptsByAttemptId(assessmentAttemptId: string): Promise<QuestionAttempt[]>;
}
