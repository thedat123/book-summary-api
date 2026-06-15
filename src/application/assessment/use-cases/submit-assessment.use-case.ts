import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IAssessmentRepository } from '@domain/assessment/repositories/assessment.repository.interface';
import { IQuestionRepository } from '@domain/assessment/repositories/question.repository.interface';
import { IAssessmentAttemptRepository } from '@domain/assessment/repositories/assessment-attempt.repository.interface';
import { ILearnerConceptMasteryRepository } from '@domain/mastery/repositories/learner-concept-mastery.repository.interface';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { SubmitAssessmentDto } from '../dtos/submit-assessment.dto';
import { AssessmentResponseDto } from '../dtos/assessment-response.dto';
import { AssessmentAttempt } from '@domain/assessment/entities/assessment-attempt.entity';
import { QuestionAttempt } from '@domain/assessment/entities/question-attempt.entity';
import { AssessmentStatus } from '@domain/assessment/value-objects/assessment-status.vo';

/**
 * SubmitAssessmentUseCase
 *
 * Orchestrates the full submission flow:
 *   1. Load assessment and questions
 *   2. Score each answer by matching positional option index → option id → isCorrect
 *   3. Persist AssessmentAttempt + QuestionAttempts
 *   4. Upsert LearnerConceptMastery for concept-tagged questions
 *   5. Return a scored AssessmentResponseDto
 *
 * Answer format: dto.answers[i] is the 0-based option index for questions[i].
 * Missing / out-of-range indices are treated as skipped (isCorrect = false).
 *
 * Mastery score per concept = correct answers / total questions for that concept
 * in this submission (0.0 – 1.0). Repeated attempts use upsertMany which
 * overwrites — averaging across attempts can be added at the repository layer.
 */
@Injectable()
export class SubmitAssessmentUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.ASSESSMENT_REPOSITORY)
    private readonly assessmentRepository: IAssessmentRepository,

    @Inject(INJECTION_TOKENS.QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,

    @Inject(INJECTION_TOKENS.ASSESSMENT_ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IAssessmentAttemptRepository,

    @Inject(INJECTION_TOKENS.LEARNER_CONCEPT_MASTERY_REPOSITORY)
    private readonly masteryRepository: ILearnerConceptMasteryRepository,
  ) {}

  async execute(dto: SubmitAssessmentDto, userId: string): Promise<AssessmentResponseDto> {
    // ── 1. Load assessment ────────────────────────────────────────────────────
    const assessment = await this.assessmentRepository.findById(dto.assessmentId);
    if (!assessment) {
      throw new NotFoundException(`Assessment ${dto.assessmentId} not found`);
    }

    // ── 2. Load questions with their options (IQuestionRepository contract
    //        guarantees options are eagerly loaded) ───────────────────────────
    const questions = await this.questionRepository.findByAssessmentId(dto.assessmentId);

    // ── 3. Score answers ──────────────────────────────────────────────────────
    let correctCount = 0;

    // Accumulate per-concept results for mastery update.
    // Map key = conceptId, value = running { correct, total } tally.
    const masteryTally = new Map<string, { correct: number; total: number }>();

    // Shared attempt id so question attempts reference the parent row.
    const attemptId = randomUUID();

    const questionAttempts: QuestionAttempt[] = questions.map((question, index) => {
      // dto.answers is positional: answers[i] = option index for questions[i].
      // If the user skipped a question or the index is out of range, treat as null.
      const optionIndex = dto.answers[index] ?? -1;
      const selectedOption = question.options[optionIndex] ?? null;

      // isOptionCorrect returns false if the id doesn't match any correct option,
      // so passing null-derived id is safe — it will always return false.
      const isCorrect = selectedOption
        ? question.isOptionCorrect(selectedOption.id)
        : false;

      if (isCorrect) correctCount++;

      // Accumulate mastery data only for questions linked to a concept.
      if (question.isLinkedToConcept()) {
        const conceptId = question.conceptId!;
        const prev = masteryTally.get(conceptId) ?? { correct: 0, total: 0 };
        masteryTally.set(conceptId, {
          correct: prev.correct + (isCorrect ? 1 : 0),
          total: prev.total + 1,
        });
      }

      return new QuestionAttempt(
        randomUUID(),
        attemptId,
        question.id,
        selectedOption?.id ?? null,
        isCorrect,
      );
    });

    // Score as an integer percentage (0–100). Guard against empty question set.
    const score = questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

    // ── 4. Persist attempt ────────────────────────────────────────────────────
    // submittedAt is set immediately — there is no separate "start attempt" step
    // in this flow; submission is atomic.
    const attempt = new AssessmentAttempt(
      attemptId,
      userId,
      dto.assessmentId,
      score,
      new Date(),
    );

    const savedAttempt = await this.attemptRepository.save(attempt);

    // Persist individual question results for later review / analytics.
    await this.attemptRepository.saveQuestionAttempts(questionAttempts);

    // ── 5. Upsert mastery scores ──────────────────────────────────────────────
    // Only called when at least one question was concept-tagged; avoids an
    // unnecessary write on purely structural assessments.
    if (masteryTally.size > 0) {
      const masteryInputs = Array.from(masteryTally.entries()).map(
        ([conceptId, { correct, total }]) => ({
          userId,
          conceptId,
          masteryScore: correct / total, // normalised 0.0 – 1.0
        }),
      );
      await this.masteryRepository.upsertMany(masteryInputs);
    }

    // ── 6. Map to response DTO ────────────────────────────────────────────────
    return {
      id: savedAttempt.id,
      userId,
      title: assessment.displayTitle(),
      status: AssessmentStatus.COMPLETED,
      score: savedAttempt.score,
      maxScore: questions.length,
      percentageScore: score,
      passed: savedAttempt.isPassed(), // default threshold = 70%
      createdAt: assessment.createdAt!,
      updatedAt: savedAttempt.submittedAt!,
    };
  }
}
