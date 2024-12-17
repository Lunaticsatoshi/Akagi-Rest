import { getEnvVariable } from 'src/common/utils/env';
import { RedisOptions } from 'ioredis';

const postgresDbHost = getEnvVariable('DATABASE_HOST');
const postgresDbPort = getEnvVariable('DATABASE_PORT');
const postgresDbUsername = getEnvVariable('DATABASE_USERNAME');
const postgresDbPassword = getEnvVariable('DATABASE_PASSWORD');
const postgresDbName = getEnvVariable('DATABASE_NAME');

export const config: { [key: string]: any; redis: RedisOptions } = {
  postgres: {
    dbHost: postgresDbHost,
    dbPort: postgresDbPort,
    dbUsername: postgresDbUsername,
    dbPassword: postgresDbPassword,
    dbName: postgresDbName,
  },
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0,
  },
  s3: {
    bucket: getEnvVariable('USER_ASSETS_BUCKET'),
    clientConfig: {
      region: 'ap-south-1',
      credentials: {
        accessKeyId: getEnvVariable('SECRET_AWS_ACCESS_KEY'),
        secretAccessKey: getEnvVariable('SECRET_AWS_ACCESS_KEY_SECRET'),
      },
    },
  },
  hostDomain: 'kaguya-dev.vercel.app',
};
