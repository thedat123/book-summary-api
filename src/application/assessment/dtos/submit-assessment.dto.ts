import { IsString, IsArray, IsInt, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * SubmitAssessmentDto — Input DTO
 *
 * Scalability: When assessments span multiple quizzes, answers will need
 *   to be keyed by questionId rather than being a positional array.
 */
export class SubmitAssessmentDto {
  @ApiProperty()
  @IsString()
  assessmentId: string;

  @ApiProperty({ type: [Number], description: 'Answers indexed per question' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  answers: number[];
}
