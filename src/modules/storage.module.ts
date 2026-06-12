import { Module, Global } from '@nestjs/common';
import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
import { LocalFileStorageService } from '@infrastructure/storage/local-file-storage.service';

/**
 * StorageModule — Global Infrastructure Module
 *
 * Responsibility: Bind the IFileStorage token to a concrete implementation.
 * Scalability: Change the useClass to S3FileStorageService for production
 *   by reading process.env.STORAGE_PROVIDER — no other files change.
 */
@Global()
@Module({
  providers: [
    {
      provide: INJECTION_TOKENS.FILE_STORAGE,
      useClass: LocalFileStorageService,
      // TODO: useFactory + ConfigService to switch on STORAGE_PROVIDER env var
    },
  ],
  exports: [INJECTION_TOKENS.FILE_STORAGE],
})
export class StorageModule {}
