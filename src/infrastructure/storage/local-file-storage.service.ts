import { Injectable } from '@nestjs/common';
import { IFileStorage, UploadResult } from './file-storage.interface';

/**
 * LocalFileStorageService — Infrastructure Implementation
 *
 * Responsibility: Store files on the local filesystem during development.
 * Why it exists: Allows development without cloud credentials.
 *   In production, swap this for S3FileStorageService via the module provider.
 *
 * TODO: implement using the 'fs' module and a configurable upload directory.
 */
@Injectable()
export class LocalFileStorageService implements IFileStorage {
  async upload(file: Express.Multer.File, prefix?: string): Promise<UploadResult> {
    // TODO
    throw new Error('Not implemented');
  }

  async download(storageKey: string): Promise<Buffer> {
    // TODO
    throw new Error('Not implemented');
  }

  async delete(storageKey: string): Promise<void> {
    // TODO
    throw new Error('Not implemented');
  }

  async getSignedUrl(storageKey: string, expiresInSeconds = 3600): Promise<string> {
    // TODO
    throw new Error('Not implemented');
  }
}
