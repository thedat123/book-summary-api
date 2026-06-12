import { Module } from '@nestjs/common';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { SourcePrismaRepository } from '@infrastructure/persistence/repositories/source.prisma-repository';
import { CreateSourceUseCase } from '@application/source/use-cases/create-source.use-case';
import { GetSourceUseCase } from '@application/source/use-cases/get-source.use-case';
import { ListSourcesUseCase } from '@application/source/use-cases/list-sources.use-case';
import { DeleteSourceUseCase } from '@application/source/use-cases/delete-source.use-case';
import { SourceController } from '@presentation/source/source.controller';

@Module({
  controllers: [SourceController],
  providers: [
    CreateSourceUseCase,
    GetSourceUseCase,
    ListSourcesUseCase,
    DeleteSourceUseCase,
    {
      provide: INJECTION_TOKENS.SOURCE_REPOSITORY,
      useClass: SourcePrismaRepository,
    },
  ],
  exports: [INJECTION_TOKENS.SOURCE_REPOSITORY],
})
export class SourceModule {}
