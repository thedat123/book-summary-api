import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssessmentDto {
  @ApiProperty({ example: 'source-1' })
  @IsString()
  @IsNotEmpty()
  sourceId: string;

  @ApiPropertyOptional({ example: 'Clean Code — Final Assessment' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}
