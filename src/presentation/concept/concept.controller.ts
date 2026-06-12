import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExtractConceptsUseCase } from '@application/concept/use-cases/extract-concepts.use-case';
import { GetConceptsUseCase } from '@application/concept/use-cases/get-concepts.use-case';
import { ConceptListResponseDto } from '@application/concept/dtos/concept-response.dto';

/**
 * ConceptController — Presentation Layer
 * Route prefix: /sources/:sourceId/concepts
 */
@ApiTags('Concepts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
// @UseGuards(JwtAuthGuard)
@Controller('sources/:sourceId/concepts')
export class ConceptController {
  constructor(
    private readonly extractConcepts: ExtractConceptsUseCase,
    private readonly getConcepts: GetConceptsUseCase,
  ) {}

  @ApiOperation({ summary: 'Get extracted concepts for a source' })
  @Get()
  async findAll(
    @Param('sourceId') sourceId: string,
    // @CurrentUser() userId: string,
  ): Promise<ConceptListResponseDto> {
    // TODO: return this.getConcepts.execute(sourceId, userId);
    throw new Error('Not implemented');
  }

  @ApiOperation({ summary: 'Extract concepts from source (AI)' })
  @Post('extract')
  async extract(
    @Param('sourceId') sourceId: string,
    // @CurrentUser() userId: string,
  ): Promise<ConceptListResponseDto> {
    // TODO: return this.extractConcepts.execute(sourceId, userId);
    throw new Error('Not implemented');
  }
}
