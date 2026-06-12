import { IsString, IsNotEmpty, MaxLength, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SourceType } from '@domain/source/value-objects/source-type.vo';

export class CreateSourceDto {
  @ApiProperty({ example: 'Clean Code', description: 'Source title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ enum: SourceType, example: SourceType.PDF })
  @IsEnum(SourceType)
  sourceType: SourceType;

  @ApiPropertyOptional({ example: 'https://example.com/article' })
  @IsOptional()
  @IsUrl()
  sourceUrl?: string;
}

export class ListSourcesDto {
  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  offset?: number;
}
