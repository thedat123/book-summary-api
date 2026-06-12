import { ArtifactType } from '../value-objects/artifact-type.vo';

export type ArtifactContent = Record<string, unknown>;

export class Artifact {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly type: ArtifactType,
    public readonly content: ArtifactContent,
    public readonly createdAt: Date | null,
  ) {}

  isSummary(): boolean {
    // TODO: type === ArtifactType.SUMMARY
    throw new Error('Not implemented');
  }

  isFlashcardSet(): boolean {
    // TODO: type === ArtifactType.FLASHCARD_SET
    throw new Error('Not implemented');
  }

  isQuizSet(): boolean {
    // TODO: type === ArtifactType.QUIZ_SET
    throw new Error('Not implemented');
  }

  isLearningPath(): boolean {
    // TODO: type === ArtifactType.LEARNING_PATH
    throw new Error('Not implemented');
  }
}
