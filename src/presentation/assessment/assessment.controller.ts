import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateAssessmentUseCase } from '@application/assessment/use-cases/create-assessment.use-case';
import { SubmitAssessmentUseCase } from '@application/assessment/use-cases/submit-assessment.use-case';
import { CreateAssessmentDto } from '@application/assessment/dtos/create-assessment.dto';
import { SubmitAssessmentDto } from '@application/assessment/dtos/submit-assessment.dto';
import { AssessmentResponseDto } from '@application/assessment/dtos/assessment-response.dto';

/**
 * AssessmentController — Presentation Layer
 * Route prefix: /api/v1/assessments
 */
@ApiTags('Assessments')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('assessments')
export class AssessmentController {
  constructor(
    private readonly createAssessment: CreateAssessmentUseCase,
    private readonly submitAssessment: SubmitAssessmentUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new assessment' })
  @Post()
  async create(
    @Body() dto: CreateAssessmentDto,
    // @CurrentUser() userId: string,
  ): Promise<AssessmentResponseDto> {
    // TODO: return this.createAssessment.execute(dto, userId);
    throw new Error('Not implemented');
  }

  @ApiOperation({ summary: 'Submit assessment answers' })
  @Post(':id/submit')
  async submit(
    @Param('id') id: string,
    @Body() dto: SubmitAssessmentDto,
    // @CurrentUser() userId: string,
  ): Promise<AssessmentResponseDto> {
    // TODO: return this.submitAssessment.execute({ ...dto, assessmentId: id }, userId);
    throw new Error('Not implemented');
  }

  @ApiOperation({ summary: 'Get all my assessments' })
  @Get()
  async findAll(
    // @CurrentUser() userId: string,
  ): Promise<AssessmentResponseDto[]> {
    // TODO
    throw new Error('Not implemented');
  }

  @ApiOperation({ summary: 'Get assessment result by ID' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    // @CurrentUser() userId: string,
  ): Promise<AssessmentResponseDto> {
    // TODO
    throw new Error('Not implemented');
  }
}
