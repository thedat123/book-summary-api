/**
 * IFileStorage — Infrastructure Interface
 *
 * Responsibility: Abstract over physical file storage (local disk, AWS S3,
 *   Google Cloud Storage, Azure Blob) so use cases are decoupled from vendor.
 * Scalability: Swap implementations via the NestJS module provider without
 *   touching any application or domain code.
 */
export interface IFileStorage {
  upload(file: Express.Multer.File, prefix?: string): Promise<UploadResult>;
  download(storageKey: string): Promise<Buffer>;
  delete(storageKey: string): Promise<void>;
  getSignedUrl(storageKey: string, expiresInSeconds?: number): Promise<string>;
}

export interface UploadResult {
  storageKey: string;
  url: string;
  sizeBytes: number;
}
