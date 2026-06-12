import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma.module';
import { StorageModule } from './modules/storage.module';
import { AiModule } from './modules/ai.module';
import { SourceModule } from './modules/source.module';
import { ConceptModule } from './modules/concept.module';
import { AssessmentModule } from './modules/assessment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Infrastructure (global)
    PrismaModule,
    StorageModule,
    AiModule,

    // Feature modules
    SourceModule,
    ConceptModule,
    AssessmentModule,

    // TODO: AuthModule (JWT strategy, guards, user registration/login)
  ],
})
export class AppModule {}
