import { Module } from '@nestjs/common';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { ConceptPrismaRepository } from '@infrastructure/persistence/repositories/concept.prisma-repository';
import { SourcePrismaRepository } from '@infrastructure/persistence/repositories/source.prisma-repository';
import { ExtractConceptsUseCase } from '@application/concept/use-cases/extract-concepts.use-case';
import { GetConceptsUseCase } from '@application/concept/use-cases/get-concepts.use-case';
import { ConceptController } from '@presentation/concept/concept.controller';

@Module({
  controllers: [ConceptController],
  providers: [
    ExtractConceptsUseCase,
    GetConceptsUseCase,
    { provide: INJECTION_TOKENS.CONCEPT_REPOSITORY, useClass: ConceptPrismaRepository },
    { provide: INJECTION_TOKENS.SOURCE_REPOSITORY, useClass: SourcePrismaRepository },
  ],
})
export class ConceptModule {}
