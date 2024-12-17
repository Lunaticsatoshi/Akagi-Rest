import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule, RedisModuleOptions, RedisService } from '@liaoliaots/nestjs-redis';

import { __prod__ } from './constants';
import { LoggerModule } from './common/logger/logger.module';
import { parser } from './common/middleware/firebase-token-parser';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { configuration } from './config';
import { S3Module } from './app/s3/s3.module';
import { UserModule } from './app/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./${process.env.ENV_FILE}`,
      load: [configuration],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const postgresConfig = configService.get('postgres');
        return {
          type: 'postgres',
          host: postgresConfig.dbHost,
          port: postgresConfig.dbPort,
          username: postgresConfig.dbUsername,
          password: postgresConfig.dbPassword,
          database: postgresConfig.dbName,
          migrations: ['dist/migrations/*.{ts,js}'],
          migrationsTableName: 'migrations',
          synchronize: !__prod__,
          logging: !__prod__,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        const redisConfig = configService.get('redis');
        return {
          config: {
            host: redisConfig.host,
            port: redisConfig.port,
            db: 1,
            onClientCreated: (client) => {
              client.on('error', (err) => {
                console.error('Redis Client Error', err);
              });
            }
          },
          readyLog: true,
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (redisService: RedisService) => {
        const redis = await redisService.getOrThrow();
        return {
          store: redis as unknown as CacheStore,
          ttl: 8640000,
        };
      },
      inject: [RedisService],
    }),
    LoggerModule,
    PubSubModule,
    S3Module,
    UserModule,
  ],
})
export class AppModule {}
