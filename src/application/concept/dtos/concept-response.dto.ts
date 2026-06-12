import { ApiProperty } from '@nestjs/swagger';

export class ConceptResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() bookId: string;
  @ApiProperty() name: string;
  @ApiProperty() definition: string;
  @ApiProperty({ type: [String] }) examples: string[];
  @ApiProperty({ nullable: true }) pageNumber: number | null;
  @ApiProperty() createdAt: Date;
}

export class ConceptListResponseDto {
  @ApiProperty({ type: [ConceptResponseDto] }) items: ConceptResponseDto[];
  @ApiProperty() total: number;
}
