import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentController } from '../assessment.controller';
import { CreateAssessmentUseCase } from '@application/assessment/use-cases/create-assessment.use-case';
import { SubmitAssessmentUseCase } from '@application/assessment/use-cases/submit-assessment.use-case';

describe('AssessmentController', () => {
  let controller: AssessmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentController],
      providers: [
        { provide: CreateAssessmentUseCase, useValue: { execute: jest.fn() } },
        { provide: SubmitAssessmentUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AssessmentController>(AssessmentController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it.todo('delegates to CreateAssessmentUseCase once auth guard is wired up');
  });

  describe('submit()', () => {
    it.todo('delegates to SubmitAssessmentUseCase once auth guard is wired up');
  });

  describe('findAll()', () => {
    it.todo('returns all assessments for the authenticated user');
  });

  describe('findOne()', () => {
    it.todo('returns a specific assessment by id');
  });
});
