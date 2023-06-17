import { Module } from '@nestjs/common';
import { S3Loader } from './s3.loader';
import { S3Service } from './s3.service';

@Module({
  providers: [S3Service, S3Loader],
  exports: [S3Service, S3Loader],
})
export class S3Module {}
