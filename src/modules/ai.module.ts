import { Module, Global } from '@nestjs/common';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { AiProviderService } from '@infrastructure/ai/ai-provider.service';

/**
 * AiModule — Global Infrastructure Module
 *
 * Responsibility: Bind the IAiProvider token to AiProviderService.
 * Scalability: Inject ConfigService to read API_KEY, MODEL_NAME from env.
 *   To switch AI vendors, only swap the useClass here.
 */
@Global()
@Module({
  providers: [
    {
      provide: INJECTION_TOKENS.AI_PROVIDER,
      useClass: AiProviderService,
    },
  ],
  exports: [INJECTION_TOKENS.AI_PROVIDER],
})
export class AiModule {}
