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

/**
 * SourceController — Presentation Layer
 * Route prefix: /sources
 *
 * Auth status: JWT not yet wired. Each action currently uses a stub userId.
 * When auth is ready:
 *   - Add @UseGuards(JwtAuthGuard) to the controller class
 *   - Add @CurrentUser() userId: string to each action parameter
 *   - Remove STUB_USER_ID
 *
 * Responsibility per action:
 *   - create()   → delegate to CreateSourceUseCase.execute(dto, userId)
 *   - list()     → delegate to ListSourcesUseCase.execute(userId, dto)
 *   - findOne()  → delegate to GetSourceUseCase.execute(id, userId)
 *   - remove()   → delegate to DeleteSourceUseCase.execute(id, userId)
 *
 * Test cases to write (see __tests__/source.controller.spec.ts):
 *   - create() delegates to CreateSourceUseCase with correct dto and userId
 *   - list() delegates to ListSourcesUseCase with correct userId and query params
 *   - findOne() delegates to GetSourceUseCase with correct id and userId
 *   - remove() delegates to DeleteSourceUseCase with correct id and userId
 */

// TODO: Remove STUB_USER_ID once @CurrentUser() + JwtAuthGuard are implemented
const STUB_USER_ID = 'stub-user-id';

@ApiTags('Sources')
@ApiBearerAuth()
// TODO: @UseGuards(JwtAuthGuard)
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
  async create(@Body() dto: CreateSourceDto): Promise<SourceResponseDto> {
    // TODO: replace STUB_USER_ID with userId from @CurrentUser()
    // TODO: return this.createSource.execute(dto, userId)
    return this.createSource.execute(dto, STUB_USER_ID);
  }

  @ApiOperation({ summary: 'List my sources' })
  @Get()
  async list(@Query() dto: ListSourcesDto): Promise<PaginatedSourcesResponseDto> {
    // TODO: return this.listSources.execute(userId, dto)
    throw new Error('Not implemented');
  }

  @ApiOperation({ summary: 'Get source by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SourceResponseDto> {
    // TODO: return this.getSource.execute(id, userId)
    throw new Error('Not implemented');
  }

  @ApiOperation({ summary: 'Delete a source' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    // TODO: return this.deleteSource.execute(id, userId)
    throw new Error('Not implemented');
  }
}
