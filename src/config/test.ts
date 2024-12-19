import { getEnvVariable } from 'src/common/utils/env'

const postgresDbHost = getEnvVariable('DATABASE_HOST')
const postgresDbPort = getEnvVariable('DATABASE_PORT')
const postgresDbUsername = getEnvVariable('DATABASE_USERNAME')
const postgresDbPassword = getEnvVariable('DATABASE_PASSWORD')
const postgresDbName = getEnvVariable('DATABASE_NAME')

export const config = {
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
  },
  s3: {
    bucket: 'akagi-user-assets-dev',
  },
}
