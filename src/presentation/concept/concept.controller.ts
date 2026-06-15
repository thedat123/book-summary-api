import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExtractConceptsUseCase } from '@application/concept/use-cases/extract-concepts.use-case';
import { GetConceptsUseCase } from '@application/concept/use-cases/get-concepts.use-case';
import { ConceptListResponseDto } from '@application/concept/dtos/concept-response.dto';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

/**
 * ConceptController — Presentation Layer
 * Route prefix: /sources/:sourceId/concepts
 *
 * Auth status: Using @CurrentUser() with guest fallback (no JWT guard yet).
 * To activate real auth: uncomment @UseGuards(JwtAuthGuard) — see .ai/auth-guide.md
 */
@ApiTags('Concepts')
@ApiBearerAuth()
// TODO [auth]: @UseGuards(JwtAuthGuard)
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
    @CurrentUser() userId: string,
  ): Promise<ConceptListResponseDto> {
    return this.getConcepts.execute(sourceId, userId);
  }

  @ApiOperation({ summary: 'Extract concepts from source using AI' })
  @Post('extract')
  async extract(
    @Param('sourceId') sourceId: string,
    @CurrentUser() userId: string,
  ): Promise<ConceptListResponseDto> {
    return this.extractConcepts.execute(sourceId, userId);
  }
}
