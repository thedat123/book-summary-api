/**
 * IAiProvider — Infrastructure Interface
 *
 * Responsibility: Abstract all AI/LLM interactions behind a single interface.
 * Why it exists: Decouples the application layer from OpenAI, Anthropic, or
 *   any other provider. Switching providers requires only a new implementation,
 *   not touching use cases.
 * Scalability: Add streaming variants (generateSummaryStream) when the UI
 *   needs real-time token streaming.
 */
export interface IAiProvider {
  generateSummary(text: string, options: SummaryOptions): Promise<SummaryResult>;
  generateQuiz(summary: string, options: QuizOptions): Promise<QuizResult>;
  extractConcepts(text: string): Promise<ConceptResult[]>;
  extractTextFromPdf(pdfBuffer: Buffer): Promise<string>;
}

export interface SummaryOptions {
  targetWordCount: number;
  keyPointCount: number;
}

export interface SummaryResult {
  content: string;
  keyPoints: string[];
  wordCount: number;
}

export interface QuizOptions {
  difficulty: string;
  questionCount: number;
  title?: string;
}

export interface QuizResult {
  title: string;
  questions: {
    text: string;
    options: string[];
    correctOption: number;
    explanation: string;
  }[];
}

export interface ConceptResult {
  name: string;
  definition: string;
  examples: string[];
  pageNumber: number | null;
}
