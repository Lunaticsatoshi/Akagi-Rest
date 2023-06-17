import { getEnvVariable } from 'src/common/utils/env';

const postgresDbHost = getEnvVariable('DATABASE_HOST');
const postgresDbPort = getEnvVariable('DATABASE_PORT');
const postgresDbUsername = getEnvVariable('DATABASE_USERNAME');
const postgresDbPassword = getEnvVariable('DATABASE_PASSWORD');
const postgresDbName = getEnvVariable('DATABASE_NAME');

export const config = {
  postgres: {
    dbHost: postgresDbHost,
    dbPort: postgresDbPort,
    dbUsername: postgresDbUsername,
    dbPassword: postgresDbPassword,
    dbName: postgresDbName,
  },
  redis: {
    // host: getEnvVariable('SECRET_REDIS_HOST'),
    // port: 6379,
    // username: getEnvVariable('SECRET_REDIS_USERNAME'),
    // password: getEnvVariable('SECRET_REDIS_PASSWORD'),
  },
  s3: {
    bucket: getEnvVariable('USER_ASSETS_BUCKET'),
    clientConfig: {
      region: 'ap-south-1',
    },
  },
  hostDomain: 'raven-dev.vercel.app',
};
