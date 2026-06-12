import { Test, TestingModule } from '@nestjs/testing';
import { SourceController } from '../source.controller';
import { CreateSourceUseCase } from '@application/source/use-cases/create-source.use-case';
import { GetSourceUseCase } from '@application/source/use-cases/get-source.use-case';
import { ListSourcesUseCase } from '@application/source/use-cases/list-sources.use-case';
import { DeleteSourceUseCase } from '@application/source/use-cases/delete-source.use-case';
import { SourceType } from '@domain/source/value-objects/source-type.vo';
import { SourceStatus } from '@domain/source/value-objects/source-status.vo';

const stubSourceDto = {
  id: 'src-1',
  ownerId: 'stub-user-id',
  title: 'Clean Code',
  sourceType: SourceType.PDF,
  sourceUrl: null,
  status: SourceStatus.PROCESSING,
  aiSnapshot: null,
  createdAt: new Date(),
};

describe('SourceController', () => {
  let controller: SourceController;
  let createSource: jest.Mocked<CreateSourceUseCase>;
  let getSource: jest.Mocked<GetSourceUseCase>;
  let listSources: jest.Mocked<ListSourcesUseCase>;
  let deleteSource: jest.Mocked<DeleteSourceUseCase>;

  beforeEach(async () => {
    createSource = { execute: jest.fn() } as any;
    getSource = { execute: jest.fn() } as any;
    listSources = { execute: jest.fn() } as any;
    deleteSource = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SourceController],
      providers: [
        { provide: CreateSourceUseCase, useValue: createSource },
        { provide: GetSourceUseCase, useValue: getSource },
        { provide: ListSourcesUseCase, useValue: listSources },
        { provide: DeleteSourceUseCase, useValue: deleteSource },
      ],
    }).compile();

    controller = module.get<SourceController>(SourceController);
  });

  describe('create()', () => {
    // TODO: delegates to CreateSourceUseCase.execute(dto, STUB_USER_ID) and returns its result
  });

  describe('list()', () => {
    // TODO: delegates to ListSourcesUseCase.execute(STUB_USER_ID, dto) and returns paginated result
  });

  describe('findOne()', () => {
    // TODO: delegates to GetSourceUseCase.execute(id, STUB_USER_ID) with the given id
  });

  describe('remove()', () => {
    // TODO: delegates to DeleteSourceUseCase.execute(id, STUB_USER_ID) with the given id
  });
});
