import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateSourceUseCase } from '@application/source/use-cases/create-source.use-case';
import { GetSourceUseCase } from '@application/source/use-cases/get-source.use-case';
import { ListSourcesUseCase } from '@application/source/use-cases/list-sources.use-case';
import { DeleteSourceUseCase } from '@application/source/use-cases/delete-source.use-case';
import { CreateSourceDto, ListSourcesDto } from '@application/source/dtos/create-source.dto';
import { SourceResponseDto, PaginatedSourcesResponseDto } from '@application/source/dtos/source-response.dto';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

/**
 * SourceController — Presentation Layer
 * Route prefix: /sources
 *
 * Auth status: Using @CurrentUser() with guest fallback (no JWT guard yet).
 *   - Without JwtAuthGuard: userId = GUEST_USER_ID from current-user.decorator.ts
 *   - With JwtAuthGuard:    userId = real user from validated JWT token
 *
 * To activate real auth (when AuthModule is ready — see .ai/auth-guide.md):
 *   1. Import JwtAuthGuard from '@presentation/guards/jwt-auth.guard'
 *   2. Uncomment @UseGuards(JwtAuthGuard) below
 *   3. That's it — @CurrentUser() already reads request.user.userId
 */
@ApiTags('Sources')
@ApiBearerAuth()
// TODO [auth]: @UseGuards(JwtAuthGuard)
@Controller('sources')
export class SourceController {
  constructor(
    private readonly createSource: CreateSourceUseCase,
    private readonly getSource: GetSourceUseCase,
    private readonly listSources: ListSourcesUseCase,
    private readonly deleteSource: DeleteSourceUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new source' })
  @Post()
  async create(
    @Body() dto: CreateSourceDto,
    @CurrentUser() userId: string,
  ): Promise<SourceResponseDto> {
    return this.createSource.execute(dto, userId);
  }

  @ApiOperation({ summary: 'List my sources' })
  @Get()
  async list(
    @Query() dto: ListSourcesDto,
    @CurrentUser() userId: string,
  ): Promise<PaginatedSourcesResponseDto> {
    return this.listSources.execute(userId, dto);
  }

  @ApiOperation({ summary: 'Get source by ID' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<SourceResponseDto> {
    return this.getSource.execute(id, userId);
  }

  @ApiOperation({ summary: 'Delete a source' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.deleteSource.execute(id, userId);
  }
}
