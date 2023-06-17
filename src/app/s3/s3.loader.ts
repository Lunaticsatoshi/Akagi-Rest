import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { S3Service } from './s3.service';

@Injectable()
export class S3Loader {
  s3Loader: DataLoader<string, string>;

  constructor(private readonly s3Service: S3Service) {
    this.s3Loader = new DataLoader<string, string>(async (keys: string[]) =>
      this.s3Service.bulkGenerateGetSignedUrl(keys as any),
    );
  }

  getS3SignedUrl(key: string) {
    return this.s3Loader.load(key);
  }
}
