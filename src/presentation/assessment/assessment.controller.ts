import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateAssessmentUseCase } from '@application/assessment/use-cases/create-assessment.use-case';
import { SubmitAssessmentUseCase } from '@application/assessment/use-cases/submit-assessment.use-case';
import { CreateAssessmentDto } from '@application/assessment/dtos/create-assessment.dto';
import { SubmitAssessmentDto } from '@application/assessment/dtos/submit-assessment.dto';
import { AssessmentResponseDto } from '@application/assessment/dtos/assessment-response.dto';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

/**
 * AssessmentController — Presentation Layer
 * Route prefix: /assessments
 *
 * Auth status: Using @CurrentUser() with guest fallback (no JWT guard yet).
 * To activate real auth: uncomment @UseGuards(JwtAuthGuard) — see .ai/auth-guide.md
 */
@ApiTags('Assessments')
@ApiBearerAuth()
// TODO [auth]: @UseGuards(JwtAuthGuard)
@Controller('assessments')
export class AssessmentController {
  constructor(
    private readonly createAssessment: CreateAssessmentUseCase,
    private readonly submitAssessment: SubmitAssessmentUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new assessment for a source' })
  @Post()
  async create(
    @Body() dto: CreateAssessmentDto,
    @CurrentUser() userId: string,
  ): Promise<AssessmentResponseDto> {
    return this.createAssessment.execute(dto, userId);
  }

  @ApiOperation({ summary: 'Submit assessment answers' })
  @Post(':id/submit')
  async submit(
    @Param('id') id: string,
    @Body() dto: SubmitAssessmentDto,
    @CurrentUser() userId: string,
  ): Promise<AssessmentResponseDto> {
    return this.submitAssessment.execute({ ...dto, assessmentId: id }, userId);
  }

  @ApiOperation({ summary: 'Get all my assessments' })
  @Get()
  async findAll(
    @CurrentUser() userId: string,
  ): Promise<AssessmentResponseDto[]> {
    // TODO: implement GetAssessmentsUseCase — list assessment attempts by userId
    // File to create: src/application/assessment/use-cases/get-assessments.use-case.ts
    void userId;
    throw new Error('Not implemented');
  }

  @ApiOperation({ summary: 'Get assessment result by ID' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<AssessmentResponseDto> {
    // TODO: implement GetAssessmentByIdUseCase — load attempt + ownership check
    // File to create: src/application/assessment/use-cases/get-assessment.use-case.ts
    void id; void userId;
    throw new Error('Not implemented');
  }
}
