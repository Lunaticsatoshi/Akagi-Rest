import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Context } from 'apollo-server-core';
import { __prod__ } from './constants';
import { LoggerModule } from './common/logger/logger.module';
import { parser } from './common/middleware/firebase-token-parser';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { configuration } from './config';
import { S3Module } from './app/s3/s3.module';
import { HelloModule } from './app/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

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
          entities: ['dist/**/*.entity.{ts,js}'],
          migrations: ['dist/migrations/*.{ts,js}'],
          migrationsTableName: 'migrations',
          synchronize: !__prod__,
          logging: !__prod__,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      fieldResolverEnhancers: ['guards'],
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      subscriptions: {
        'graphql-ws': {
          onConnect: async (context: Context<any>) => {
            const { connectionParams, extra } = context;
            const authHeader = connectionParams.authorization;
            // extract user information from token
            const user = await parser(
              authHeader,
              connectionParams['x-mimic-user-id'],
            );
            extra.user = user;
          },
        },
        'subscriptions-transport-ws': {
          onConnect: async (connectionParams) => {
            const authHeader = connectionParams.authorization;
            // extract user information from token
            const user = await parser(
              authHeader,
              connectionParams['x-mimic-user-id'],
            );
            return { extra: { user } };
          },
        },
      },
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
    LoggerModule,
    PubSubModule,
    S3Module,
    HelloModule,
  ],
})
export class AppModule {}
