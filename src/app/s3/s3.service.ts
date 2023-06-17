import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestPresigningArguments } from '@aws-sdk/types';
import * as DataLoader from 'dataloader';

@Injectable()
export class S3Service {
  client: S3Client;
  bucket: string;
  s3Loader: DataLoader<string, string>;

  constructor(private configService: ConfigService) {
    const s3Config = this.configService.get('s3');
    this.client = new S3Client(s3Config.clientConfig);
    this.bucket = s3Config.bucket;
  }

  generateGetCommandS3 = (input: GetObjectCommandInput) => {
    return new GetObjectCommand(input);
  };

  generatePutCommandS3 = (input: PutObjectCommandInput) => {
    return new PutObjectCommand(input);
  };

  generateGetSignedUrl = async (
    input: GetObjectCommandInput,
    opts?: RequestPresigningArguments,
  ) => {
    const s3Command = this.generateGetCommandS3(input);
    return await getSignedUrl(this.client, s3Command, opts);
  };

  generatePutSignedUrl = async (
    input: GetObjectCommandInput,
    opts?: RequestPresigningArguments,
  ) => {
    const s3Command = this.generatePutCommandS3(input);
    return await getSignedUrl(this.client, s3Command, opts);
  };

  getS3SignedUrl = async (
    command: GetObjectCommand | PutObjectCommand,
    expiresIn = 86400,
  ) => {
    return await getSignedUrl(this.client, command, { expiresIn });
  };

  bulkGenerateGetSignedUrl = async (keys: string[]) => {
    return await Promise.all(
      keys.map(async (key) => {
        if (!key) {
          return '';
        }

        const s3Command = this.generateGetCommandS3({
          Bucket: this.bucket,
          Key: key,
        });
        const signedUrl = await this.getS3SignedUrl(s3Command);

        return signedUrl;
      }),
    );
  };

  generateGetSignedUrlForBucket = async (key: string) => {
    const s3Command = this.generateGetCommandS3({
      Bucket: this.bucket,
      Key: key,
    });
    const signedUrl = await this.getS3SignedUrl(s3Command);

    return signedUrl;
  };
}
