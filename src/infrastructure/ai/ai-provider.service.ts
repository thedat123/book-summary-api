import { Injectable } from '@nestjs/common';
import {
  IAiProvider,
  SummaryOptions,
  SummaryResult,
  QuizOptions,
  QuizResult,
  ConceptResult,
} from './ai-provider.interface';

/**
 * AiProviderService — Infrastructure Implementation
 *
 * Responsibility: Call the chosen LLM API (e.g., OpenAI GPT-4o, Anthropic Claude).
 * TODO: inject ConfigService, HTTP client, and implement all methods.
 *   Prompt engineering goes here — NOT in domain or application layers.
 */
@Injectable()
export class AiProviderService implements IAiProvider {
  async generateSummary(text: string, options: SummaryOptions): Promise<SummaryResult> {
    // TODO: build prompt, call LLM API, parse response
    throw new Error('Not implemented');
  }

  async generateQuiz(summary: string, options: QuizOptions): Promise<QuizResult> {
    // TODO: build quiz-generation prompt with JSON output format
    throw new Error('Not implemented');
  }

  async extractConcepts(text: string): Promise<ConceptResult[]> {
    // TODO: build concept-extraction prompt
    throw new Error('Not implemented');
  }

  async extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
    // TODO: use a PDF parsing library (e.g., pdf-parse) to extract raw text
    throw new Error('Not implemented');
  }
}
