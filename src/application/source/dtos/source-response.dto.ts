import { ApiProperty } from '@nestjs/swagger';
import { SourceType } from '@domain/source/value-objects/source-type.vo';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';
import { AiSnapshot } from '@domain/source/entities/source.entity';

export class SourceResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() ownerId: string;
  @ApiProperty() title: string;
  @ApiProperty({ enum: SourceType }) sourceType: SourceType;
  @ApiProperty({ nullable: true }) sourceUrl: string | null;
  @ApiProperty({ enum: SourceStatus }) status: SourceStatus;
  @ApiProperty({ nullable: true }) aiSnapshot: AiSnapshot | null;
  @ApiProperty({ nullable: true }) createdAt: Date | null;
}

export class PaginatedSourcesResponseDto {
  @ApiProperty({ type: [SourceResponseDto] }) items: SourceResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() limit: number;
  @ApiProperty() offset: number;
}
