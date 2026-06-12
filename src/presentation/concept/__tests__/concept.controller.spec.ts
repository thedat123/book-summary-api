import { Test, TestingModule } from '@nestjs/testing';
import { ConceptController } from '../concept.controller';
import { ExtractConceptsUseCase } from '@application/concept/use-cases/extract-concepts.use-case';
import { GetConceptsUseCase } from '@application/concept/use-cases/get-concepts.use-case';

describe('ConceptController', () => {
  let controller: ConceptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConceptController],
      providers: [
        { provide: ExtractConceptsUseCase, useValue: { execute: jest.fn() } },
        { provide: GetConceptsUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ConceptController>(ConceptController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it.todo('delegates to GetConceptsUseCase once auth guard is wired up');
  });

  describe('extract()', () => {
    it.todo('delegates to ExtractConceptsUseCase once auth guard is wired up');
  });
});
