import { Assessment } from '../entities/assessment.entity';

/**
 * IAssessmentRepository — Domain Repository Interface
 *
 * Mirrors the FK relationship:
 *   assessments.source_id → sources.id
 *
 * Responsibility: Persist Assessment entities.
 *   Assessment is a lightweight container (title + source link).
 *   Questions are persisted by IQuestionRepository.
 */
export interface IAssessmentRepository {
  findById(id: string): Promise<Assessment | null>;
  findBySourceId(sourceId: string): Promise<Assessment[]>;
  save(assessment: Assessment): Promise<Assessment>;
  update(id: string, partial: UpdateAssessmentData): Promise<Assessment>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
}

export interface UpdateAssessmentData {
  title?: string;
}
