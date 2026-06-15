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
    return this.type === ArtifactType.SUMMARY;
  }

  isFlashcardSet(): boolean {
    return this.type === ArtifactType.FLASHCARD_SET;
  }

  isQuizSet(): boolean {
    return this.type === ArtifactType.QUIZ_SET;
  }

  isLearningPath(): boolean {
    return this.type === ArtifactType.LEARNING_PATH;
  }
}
