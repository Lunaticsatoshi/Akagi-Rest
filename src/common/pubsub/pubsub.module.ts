import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub } from 'graphql-subscriptions';
// import { RedisPubSub } from 'graphql-redis-subscriptions';
// import * as Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return new PubSub();

        // const options: Redis.RedisOptions = configService.get('redis');

        // return new RedisPubSub({
        //   publisher: new Redis(options),
        //   subscriber: new Redis(options),
        // });
      },
    },
  ],
  exports: ['PUB_SUB'],
})
export class PubSubModule {}
