import { ApiProperty } from '@nestjs/swagger';
import { AssessmentStatus } from '@domain/assessment/value-objects/assessment-status.vo';

export class AssessmentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() title: string;
  @ApiProperty({ enum: AssessmentStatus }) status: AssessmentStatus;
  @ApiProperty({ nullable: true }) score: number | null;
  @ApiProperty({ nullable: true }) maxScore: number | null;
  @ApiProperty({ nullable: true }) percentageScore: number | null;
  @ApiProperty({ nullable: true }) passed: boolean | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
