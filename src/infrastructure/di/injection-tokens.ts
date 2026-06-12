export const INJECTION_TOKENS = {
  // ─── Repository tokens ────────────────────────────────────────────────────
  USER_REPOSITORY: Symbol('IUserRepository'),
  SOURCE_REPOSITORY: Symbol('ISourceRepository'),
  CONCEPT_REPOSITORY: Symbol('IConceptRepository'),
  CONCEPT_RELATION_REPOSITORY: Symbol('IConceptRelationRepository'),
  ARTIFACT_REPOSITORY: Symbol('IArtifactRepository'),
  ASSESSMENT_REPOSITORY: Symbol('IAssessmentRepository'),
  QUESTION_REPOSITORY: Symbol('IQuestionRepository'),
  ASSESSMENT_ATTEMPT_REPOSITORY: Symbol('IAssessmentAttemptRepository'),
  LEARNER_CONCEPT_MASTERY_REPOSITORY: Symbol('ILearnerConceptMasteryRepository'),
  JOB_REPOSITORY: Symbol('IJobRepository'),

  // ─── External service tokens ───────────────────────────────────────────────
  FILE_STORAGE: Symbol('IFileStorage'),
  AI_PROVIDER: Symbol('IAiProvider'),
  
} as const;
