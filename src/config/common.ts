import { getEnvVariable } from 'src/common/utils/env';

export const config = {
  appName: 'akagi',
  emailKickConfig: {},
  awsSESConfig: {
    region: getEnvVariable('AWS_REGION'),
  },
  airtableConfig: {},
};
