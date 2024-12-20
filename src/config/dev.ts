import { RedisOptions } from 'ioredis'
import { getEnvVariable } from 'src/common/utils/env'

const postgresDbHost = getEnvVariable('DATABASE_HOST')
const postgresDbPort = getEnvVariable('DATABASE_PORT')
const postgresDbUsername = getEnvVariable('DATABASE_USERNAME')
const postgresDbPassword = getEnvVariable('DATABASE_PASSWORD')
const postgresDbName = getEnvVariable('DATABASE_NAME')
const redisDbHost = getEnvVariable('REDIS_HOST')
const redisDbPort = getEnvVariable('REDIS_PORT')

export const config: { [key: string]: any; redis: RedisOptions } = {
  postgres: {
    dbHost: postgresDbHost,
    dbPort: postgresDbPort,
    dbUsername: postgresDbUsername,
    dbPassword: postgresDbPassword,
    dbName: postgresDbName,
  },
  redis: {
    host: redisDbHost,
    port: parseInt(redisDbPort),
    db: 0,
  },
  s3: {
    bucket: getEnvVariable('USER_ASSETS_BUCKET'),
    clientConfig: {
      region: 'ap-south-1',
    },
  },
  cookieSecret: getEnvVariable('COOKIE_SECRET'),
  hostDomain: 'oshi-dev.vercel.app',
  sessionDomain: '.ophis.app',
}
