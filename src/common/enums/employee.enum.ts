import { registerEnumType } from '@nestjs/graphql/dist';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

registerEnumType(Gender, {
  name: 'Gender',
  description: 'Gender of the person',
});
